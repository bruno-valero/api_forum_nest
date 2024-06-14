import { Either, left, right } from '@/core/either'
import AnswerCommentsRepository from '../repositories/answer-comments-repository'
import AnswersRepository from '../repositories/answers-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { Injectable } from '@nestjs/common'

export interface DeleteCommentOnAnswerUseCaseRequest {
  authorId: string
  answerId: string
  answerCommentId: string
}

export type DeleteCommentOnAnswerUseCaseResponse = Either<
  ResourceNotFoundError | UnauthorizedError,
  null
>

@Injectable()
export default class DeleteCommentOnAnswerUseCase {
  constructor(
    protected answersRepository: AnswersRepository,
    protected answerCommentRepository: AnswerCommentsRepository,
  ) {}

  async execute(
    props: DeleteCommentOnAnswerUseCaseRequest,
  ): Promise<DeleteCommentOnAnswerUseCaseResponse> {
    const answerResp = await this.answersRepository.getById(props.answerId)

    if (!answerResp) return left(new ResourceNotFoundError())

    const answerCommentResp = await this.answerCommentRepository.getById(
      props.answerCommentId,
    )

    if (!answerCommentResp) return left(new ResourceNotFoundError())
    const { answerComment } = answerCommentResp

    if (answerComment.authorId.value !== props.authorId)
      return left(new UnauthorizedError())

    await this.answerCommentRepository.delete(
      props.answerCommentId,
      props.authorId,
    )

    return right(null)
  }
}
