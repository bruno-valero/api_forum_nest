import { PaginationParams } from '@/core/respositories/pagination-params'
import AnswerComment from '../../enterprise/entities/answer-comments'
import { CommentWithAuthor } from '../../enterprise/entities/value-objects.ts/comment-with-author'

export default abstract class AnswerCommentsRepository {
  abstract create(
    answerComment: AnswerComment,
  ): Promise<{ answerComment: AnswerComment }>

  abstract getById(id: string): Promise<{ answerComment: AnswerComment } | null>
  abstract delete(id: string, authorId: string): Promise<void>
  abstract update(
    answerId: string,
    authorId: string,
    data: AnswerComment,
  ): Promise<{ answerComment: AnswerComment }>

  abstract findManyByAnswerId(
    answerId: string,
    params: PaginationParams,
  ): Promise<{ answerComments: AnswerComment[] }>

  abstract findManyByAnswerIdWithAuthor(
    answerId: string,
    params: PaginationParams,
  ): Promise<{ answerComments: CommentWithAuthor[] }>
}
