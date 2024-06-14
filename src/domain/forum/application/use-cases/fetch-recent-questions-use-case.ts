import { Either, right } from '@/core/either'
import Question from '../../enterprise/entities/question'
import QuestionsRepository from '../repositories/questions-repository'
import { Injectable } from '@nestjs/common'

export interface FetchRecentQuestionsUseCaseRequest {
  page: number
}

export type FetchRecentQuestionsUseCaseResponse = Either<
  null,
  {
    questions: Question[]
  }
>

@Injectable()
export default class FetchRecentQuestionsUseCase {
  constructor(protected questionsRepository: QuestionsRepository) {}

  async execute({
    page,
  }: FetchRecentQuestionsUseCaseRequest): Promise<FetchRecentQuestionsUseCaseResponse> {
    const { questions } = await this.questionsRepository.findManyRecent({
      page,
    })

    return right({ questions })
  }
}
