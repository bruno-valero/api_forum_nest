import { Either, left, right } from '@/core/either'
import AnswerComment from '../../enterprise/entities/answer-comments'
import AnswerCommentsRepository from '../repositories/answer-comments-repository'
import AnswersRepository from '../repositories/answers-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

export interface CommentOnAnswerUseCaseRequest {
  authorId: string
  answerId: string
  content: string
}

export type CommentOnAnswerUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    answerComment: AnswerComment
  }
>

@Injectable()
export default class CommentOnAnswerUseCase {
  constructor(
    protected answersRepository: AnswersRepository,
    protected answerCommentRepository: AnswerCommentsRepository,
  ) {}

  async execute(
    props: CommentOnAnswerUseCaseRequest,
  ): Promise<CommentOnAnswerUseCaseResponse> {
    const answerResp = await this.answersRepository.getById(props.answerId)

    // console.log('CommentOnAnswerUseCase answerResp', answerResp)

    if (!answerResp) return left(new ResourceNotFoundError())

    const { answerComment } = await this.answerCommentRepository.create(
      AnswerComment.create(props),
    )

    return right({ answerComment })
  }
}
