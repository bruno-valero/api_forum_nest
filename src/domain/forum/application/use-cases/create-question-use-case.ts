import { Either, right } from '@/core/either'
import Question from '../../enterprise/entities/question'
import QuestionsRepository from '../repositories/questions-repository'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'
import { Injectable } from '@nestjs/common'
import UniqueEntityId from '@/core/entities/unique-entity-id'

export interface CreateQuestionUseCaseRequest {
  authorId: string
  title: string
  content: string
  attachmentsIds: string[]
}

export type CreateQuestionUseCaseResponse = Either<
  null,
  {
    question: Question
  }
>

@Injectable()
export default class CreateQuestionUseCase {
  constructor(protected questionsRepository: QuestionsRepository) {}

  async execute({
    attachmentsIds,
    ...props
  }: CreateQuestionUseCaseRequest): Promise<CreateQuestionUseCaseResponse> {
    const newQuestion = Question.create(props)

    const attachments = attachmentsIds.map((item) => {
      return QuestionAttachment.create(
        {
          attachmentId: item,
          questionId: newQuestion.id.value,
        },
        new UniqueEntityId(item),
      )
    })

    newQuestion.attachments = new QuestionAttachmentList(attachments)

    const { question } = await this.questionsRepository.create(newQuestion)

    return right({ question })
  }
}
