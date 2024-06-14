import { Either, left, right } from '@/core/either'
import Answer from '../../enterprise/entities/answer'
import AnswersRepository from '../repositories/answers-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'
import { AnswerAttachmentsRepository } from '../repositories/answer-attachment-repository'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'
import { Injectable } from '@nestjs/common'

export interface EditAnswerUseCaseRequest {
  authorId: string
  answerId: string
  data: { content: string }
  attachmentsIds: string[]
}

export type EditAnswerUseCaseResponse = Either<
  ResourceNotFoundError | UnauthorizedError,
  {
    answer: Answer
  }
>

@Injectable()
export default class EditAnswerUseCase {
  constructor(
    protected answersRepository: AnswersRepository,
    protected answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) {}

  async execute({
    authorId,
    answerId,
    data,
    attachmentsIds,
  }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
    const resp = await this.answersRepository.getById(answerId)

    if (!resp) return left(new ResourceNotFoundError())

    const { answer } = resp

    if (answer.authorId.value !== authorId) return left(new UnauthorizedError())

    const { answerAttachments } =
      await this.answerAttachmentsRepository.findManyByAnswerId(answer.id.value)
    const answerAttachmentList = new AnswerAttachmentList(answerAttachments)

    const attachments = attachmentsIds.map((item) => {
      return AnswerAttachment.create({
        attachmentId: item,
        answerId: answer.id.value,
      })
    })

    answerAttachmentList.update(attachments)

    answer.content = data.content
    answer.attachments = answerAttachmentList

    await this.answersRepository.update(answerId, authorId, answer)

    return right({
      answer,
    })
  }
}
