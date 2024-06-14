import { Either, left, right } from '@/core/either'
import QuestionsRepository from '../repositories/questions-repository'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

export interface DeleteQuestionUseCaseRequest {
  authorId: string
  questionId: string
}

export type DeleteQuestionUseCaseResponse = Either<
  ResourceNotFoundError | UnauthorizedError,
  null
>

@Injectable()
export default class DeleteQuestionUseCase {
  constructor(protected questionsRepository: QuestionsRepository) {}

  async execute({
    authorId,
    questionId,
  }: DeleteQuestionUseCaseRequest): Promise<DeleteQuestionUseCaseResponse> {
    const questionResp = await this.questionsRepository.getById(questionId)

    if (!questionResp) return left(new ResourceNotFoundError())

    const { question } = questionResp

    if (question.authorId.value !== authorId)
      return left(new UnauthorizedError())

    await this.questionsRepository.delete(questionId, authorId)

    return right(null)
  }
}
