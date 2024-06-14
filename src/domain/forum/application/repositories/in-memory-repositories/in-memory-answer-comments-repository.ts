import { PaginationParams } from '@/core/respositories/pagination-params'
import AnswerComment from '@/domain/forum/enterprise/entities/answer-comments'
import AnswerCommentsRepository from '../answer-comments-repository'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { DomainEvents } from '@/core/events/domain-events'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects.ts/comment-with-author'
import InMemoryStudentsRepository from './in-memory-students-repository'

export default class InMemoryAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  items: AnswerComment[] = []

  constructor(private studentsRepository: InMemoryStudentsRepository) {}

  async create(
    answerComment: AnswerComment,
  ): Promise<{ answerComment: AnswerComment }> {
    this.items.push(answerComment)

    DomainEvents.dispatchEventsForAggregate(answerComment.id)

    return { answerComment }
  }

  async getById(id: string): Promise<{ answerComment: AnswerComment } | null> {
    const answerComment =
      this.items.filter((item) => item.id.value === id)[0] ?? null

    if (!answerComment) return null
    return { answerComment }
  }

  async delete(questionId: string, authorId: string): Promise<void> {
    const index = this.items.findIndex(
      (item) =>
        item.id.value === questionId && item.authorId.value === authorId,
    )

    if (index < 0) throw new UnauthorizedError()

    this.items.splice(index, 1)
  }

  async update(
    questionId: string,
    authorId: string,
    answerComment: AnswerComment,
  ): Promise<{ answerComment: AnswerComment }> {
    const index = this.items.findIndex(
      (item) =>
        item.id.value === questionId && item.authorId.value === authorId,
    )

    if (index < 0) throw new UnauthorizedError()

    this.items[index] = answerComment

    return { answerComment }
  }

  async findManyByAnswerId(
    answerId: string,
    { page }: PaginationParams,
  ): Promise<{ answerComments: AnswerComment[] }> {
    if (page === 0) {
      page = 1
    }
    const answerComments = this.items
      .filter((item) => item.answerId.value === answerId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return { answerComments }
  }

  async findManyByAnswerIdWithAuthor(
    answerId: string,
    { page }: PaginationParams,
  ) {
    const answerComments = this.items
      .filter((item) => item.answerId.value === answerId)
      .slice((page - 1) * 20, page * 20)
      .map((comment) => {
        const author = this.studentsRepository.items.find((student) => {
          return student.id.equals(comment.authorId)
        })

        if (!author) {
          throw new Error(
            `Author with ID "${comment.authorId.value} does not exist."`,
          )
        }

        return CommentWithAuthor.create({
          commentId: comment.id.value,
          content: comment.content,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          authorId: comment.authorId.value,
          author: author.name,
        })
      })

    return { answerComments }
  }
}
