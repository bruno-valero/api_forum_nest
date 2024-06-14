import { Either, left, right } from '@/core/either'
import QuestionComment from '../../enterprise/entities/question-comments'
import QuestionCommentsRepository from '../repositories/question-comments-repository'
import QuestionsRepository from '../repositories/questions-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

export interface CommentOnQuestionUseCaseRequest {
  authorId: string
  questionId: string
  content: string
}

export type CommentOnQuestionUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    questionComment: QuestionComment
  }
>

@Injectable()
export default class CommentOnQuestionUseCase {
  constructor(
    protected questionsRepository: QuestionsRepository,
    protected questionCommentsRepository: QuestionCommentsRepository,
  ) {}

  async execute(
    props: CommentOnQuestionUseCaseRequest,
  ): Promise<CommentOnQuestionUseCaseResponse> {
    const questionResp = await this.questionsRepository.getById(
      props.questionId,
    )

    if (!questionResp) return left(new ResourceNotFoundError())

    const { questionComment } = await this.questionCommentsRepository.create(
      QuestionComment.create(props),
    )

    return right({ questionComment })
  }
}
