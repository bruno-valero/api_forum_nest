import { Either, left, right } from '@/core/either'
import AnswersRepository from '../repositories/answers-repository'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

export interface DeleteAnswerUseCaseRequest {
  authorId: string
  answerId: string
}

export type DeleteAnswerUseCaseResponse = Either<
  UnauthorizedError | ResourceNotFoundError,
  null
>

@Injectable()
export default class DeleteAnswerUseCase {
  constructor(protected answersRepository: AnswersRepository) {}

  async execute({
    authorId,
    answerId,
  }: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {
    const answerResp = await this.answersRepository.getById(answerId)
    // console.log('DeleteAnswerUseCase - answerResp', answerResp)
    if (!answerResp) return left(new ResourceNotFoundError())

    const { answer } = answerResp

    if (answer.authorId.value !== authorId) return left(new UnauthorizedError())

    await this.answersRepository.delete(answerId, authorId)

    return right(null)
  }
}
