import { Either, left, right } from '@/core/either'
import QuestionCommentsRepository from '../repositories/question-comments-repository'
import QuestionsRepository from '../repositories/questions-repository'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

export interface DeleteCommentOnQuestionUseCaseRequest {
  authorId: string
  questionId: string
  questionCommentId: string
}

export type DeleteCommentOnQuestionUseCaseResponse = Either<
  ResourceNotFoundError | UnauthorizedError,
  null
>

@Injectable()
export default class DeleteCommentOnQuestionUseCase {
  constructor(
    protected questionsRepository: QuestionsRepository,
    protected questionCommentsRepository: QuestionCommentsRepository,
  ) {}

  async execute(
    props: DeleteCommentOnQuestionUseCaseRequest,
  ): Promise<DeleteCommentOnQuestionUseCaseResponse> {
    const questionResp = await this.questionsRepository.getById(
      props.questionId,
    )

    if (!questionResp) throw new Error('question not found.')

    const questionCommentResp = await this.questionCommentsRepository.getById(
      props.questionCommentId,
    )

    if (!questionCommentResp) return left(new ResourceNotFoundError())
    const { questionComment } = questionCommentResp

    if (questionComment.authorId.value !== props.authorId)
      return left(new UnauthorizedError())

    await this.questionCommentsRepository.delete(
      props.questionCommentId,
      props.authorId,
    )

    return right(null)
  }
}
