import { Either, left, right } from '@/core/either'
import Question from '../../enterprise/entities/question'
import QuestionsRepository from '../repositories/questions-repository'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'
import { QuestionAttachmentsRepository } from '../repositories/questions-attachment-repository'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'
import { Injectable } from '@nestjs/common'

export interface EditQuestionUseCaseRequest {
  authorId: string
  questionId: string
  data: { title: string; content: string }
  attachmentsIds: string[]
}

export type EditQuestionUseCaseResponse = Either<
  ResourceNotFoundError | UnauthorizedError,
  {
    question: Question
  }
>

@Injectable()
export default class EditQuestionUseCase {
  constructor(
    protected questionsRepository: QuestionsRepository,
    protected questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  async execute({
    authorId,
    questionId,
    data,
    attachmentsIds,
  }: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
    const resp = await this.questionsRepository.getById(questionId)

    if (!resp) return left(new ResourceNotFoundError())

    const { question } = resp

    if (question.authorId.value !== authorId)
      return left(new UnauthorizedError())

    const { questionAttachments } =
      await this.questionAttachmentsRepository.findManyByQuestionId(
        question.id.value,
      )
    const questionAttachmentList = new QuestionAttachmentList(
      questionAttachments,
    )

    const attachments = attachmentsIds.map((item) => {
      return QuestionAttachment.create({
        attachmentId: item,
        questionId: question.id.value,
      })
    })

    questionAttachmentList.update(attachments)

    question.title = data.title
    question.content = data.content
    question.attachments = questionAttachmentList

    await this.questionsRepository.update(questionId, authorId, question)

    return right({
      question: resp.question,
    })
  }
}
