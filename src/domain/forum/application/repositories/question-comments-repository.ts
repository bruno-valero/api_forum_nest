import { PaginationParams } from '@/core/respositories/pagination-params'
import QuestionComment from '../../enterprise/entities/question-comments'
import { CommentWithAuthor } from '../../enterprise/entities/value-objects.ts/comment-with-author'

export default abstract class QuestionCommentsRepository {
  abstract create(
    questionComment: QuestionComment,
  ): Promise<{ questionComment: QuestionComment }>

  abstract getById(
    id: string,
  ): Promise<{ questionComment: QuestionComment } | null>

  abstract delete(questionId: string, authorId: string): Promise<void>

  abstract update(
    questionId: string,
    authorId: string,
    data: QuestionComment,
  ): Promise<{ questionComment: QuestionComment }>

  abstract findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<{ questionComments: QuestionComment[] }>

  abstract findManyByQuestionIdWithAuthor(
    questionId: string,
    params: PaginationParams,
  ): Promise<{ questionComments: CommentWithAuthor[] }>
}
