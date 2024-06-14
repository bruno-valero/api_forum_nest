import { Either, right } from '@/core/either'
import Answer from '../../enterprise/entities/answer'
import AnswersRepository from '../repositories/answers-repository'
import { Injectable } from '@nestjs/common'

export interface FetchQuestionAnswerUseCaseRequest {
  questionId: string
  page: number
}

export type FetchQuestionAnswerUseCaseResponse = Either<
  null,
  {
    answers: Answer[]
  }
>

@Injectable()
export default class FetchQuestionAnswerUseCase {
  constructor(protected answersRepository: AnswersRepository) {}

  async execute({
    questionId,
    page,
  }: FetchQuestionAnswerUseCaseRequest): Promise<FetchQuestionAnswerUseCaseResponse> {
    const { answers } = await this.answersRepository.findManyByQuestionId(
      questionId,
      { page },
    )

    return right({ answers })
  }
}
