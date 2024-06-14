import UniqueEntityId from '@/core/entities/unique-entity-id'
import Question from '../../enterprise/entities/question'
import AnswersRepository from '../repositories/answers-repository'
import QuestionsRepository from '../repositories/questions-repository'
import { Either, left, right } from '@/core/either'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

export interface ChooseBestAnswerUseCaseRequest {
  authorId: string
  answerId: string
}

export type ChooseBestAnswerUseCaseResponse = Either<
  ResourceNotFoundError | UnauthorizedError,
  {
    question: Question
  }
>

@Injectable()
export default class ChooseBestAnswerUseCase {
  constructor(
    protected answersRepository: AnswersRepository,
    protected questionsRepository: QuestionsRepository,
  ) {}

  async execute({
    authorId,
    answerId,
  }: ChooseBestAnswerUseCaseRequest): Promise<ChooseBestAnswerUseCaseResponse> {
    const answer = await this.answersRepository.getById(answerId)

    if (!answer) return left(new ResourceNotFoundError())

    const questionResp = await this.questionsRepository.getById(
      answer.answer.questionId.value,
    )
    if (!questionResp) return left(new ResourceNotFoundError())

    const { question } = questionResp

    if (question.authorId.value !== authorId)
      return left(new UnauthorizedError())

    question.bestAnsweredId = new UniqueEntityId(answerId)

    await this.questionsRepository.update(question.id.value, authorId, question)

    return right({
      question,
    })
  }
}
