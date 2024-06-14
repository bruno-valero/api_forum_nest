import { Either, right } from '@/core/either'
import QuestionsRepository from '../repositories/questions-repository'
import { Injectable } from '@nestjs/common'
import { QuestionDetails } from '../../enterprise/entities/value-objects.ts/question-details'

export interface GetQuestionBySlugUseCaseRequest {
  slug: string
}

export type GetQuestionBySlugUseCaseResponse = Either<
  null,
  {
    question: QuestionDetails
  }
>

@Injectable()
export default class GetQuestionBySlugUseCase {
  constructor(protected questionsRepository: QuestionsRepository) {}

  async execute({
    slug,
  }: GetQuestionBySlugUseCaseRequest): Promise<GetQuestionBySlugUseCaseResponse> {
    const resp = await this.questionsRepository.findDetailsBySlug(slug)
    console.log('resp', resp)

    if (!resp) throw new Error('question not found')

    const question = resp

    return right({ question })
  }
}
