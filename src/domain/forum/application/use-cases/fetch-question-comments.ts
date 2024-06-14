import { Either, right } from '@/core/either'
import QuestionCommentsRepository from '../repositories/question-comments-repository'
import { Injectable } from '@nestjs/common'
import { CommentWithAuthor } from '../../enterprise/entities/value-objects.ts/comment-with-author'

export interface FetchQuestionCommentsUseCaseRequest {
  questionId: string
  page: number
}

export type FetchQuestionCommentsUseCaseResponse = Either<
  null,
  {
    questionComments: CommentWithAuthor[]
  }
>

@Injectable()
export default class FetchQuestionCommentsUseCase {
  constructor(
    protected questionCommentsRepository: QuestionCommentsRepository,
  ) {}

  async execute({
    page,
    questionId,
  }: FetchQuestionCommentsUseCaseRequest): Promise<FetchQuestionCommentsUseCaseResponse> {
    const { questionComments } =
      await this.questionCommentsRepository.findManyByQuestionIdWithAuthor(
        questionId,
        {
          page,
        },
      )

    return right({ questionComments })
  }
}
