import { Either, right } from '@/core/either'
import AnswerCommentsRepository from '../repositories/answer-comments-repository'
import { Injectable } from '@nestjs/common'
import { CommentWithAuthor } from '../../enterprise/entities/value-objects.ts/comment-with-author'

export interface FetchAnswersUseCaseRequest {
  answerId: string
  page: number
}

export type FetchAnswersUseCaseResponse = Either<
  null,
  {
    answerComments: CommentWithAuthor[]
  }
>

@Injectable()
export default class FetchAnswerCommentsUseCase {
  constructor(protected answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({
    page,
    answerId,
  }: FetchAnswersUseCaseRequest): Promise<FetchAnswersUseCaseResponse> {
    const { answerComments } =
      await this.answerCommentsRepository.findManyByAnswerIdWithAuthor(
        answerId,
        {
          page,
        },
      )

    return right({ answerComments })
  }
}
