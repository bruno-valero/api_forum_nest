import { Either, right } from '@/core/either'
import Answer from '../../enterprise/entities/answer'
import AnswersRepository from '../repositories/answers-repository'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'
import { Injectable } from '@nestjs/common'

export interface AnswerQuestionUseCaseRequest {
  authorId: string
  questionId: string
  content: string
  attachmentsIds: string[]
}

export type AnswerQuestionUseCaseResponse = Either<null, { answer: Answer }>

@Injectable()
export default class AnswerQuestionUseCase {
  constructor(protected answerRepository: AnswersRepository) {}

  async execute({
    authorId,
    questionId,
    content,
    attachmentsIds,
  }: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
    const answer = Answer.create({
      authorId,
      questionId,
      content,
    })

    const attachments = attachmentsIds.map((item) => {
      return AnswerAttachment.create({
        attachmentId: item,
        answerId: answer.id.value,
      })
    })

    answer.attachments = new AnswerAttachmentList(attachments)

    await this.answerRepository.create(answer)

    return right({ answer })
  }
}
