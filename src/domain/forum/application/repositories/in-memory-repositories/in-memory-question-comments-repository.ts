import { PaginationParams } from '@/core/respositories/pagination-params'
import QuestionCommentsRepository from '../question-comments-repository'
import QuestionComment from '@/domain/forum/enterprise/entities/question-comments'
import { DomainEvents } from '@/core/events/domain-events'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects.ts/comment-with-author'
import InMemoryStudentsRepository from './in-memory-students-repository'

export default class InMemoryQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  items: QuestionComment[] = []

  constructor(private studentsRepository: InMemoryStudentsRepository) {}

  async create(
    questionComment: QuestionComment,
  ): Promise<{ questionComment: QuestionComment }> {
    this.items.push(questionComment)

    DomainEvents.dispatchEventsForAggregate(questionComment.id)

    return { questionComment }
  }

  async getById(
    id: string,
  ): Promise<{ questionComment: QuestionComment } | null> {
    const questionComment =
      this.items.filter((item) => item.id.value === id)[0] ?? null

    if (!questionComment) return null
    return { questionComment }
  }

  async delete(questionId: string, authorId: string): Promise<void> {
    const index = this.items.findIndex(
      (item) =>
        item.id.value === questionId && item.authorId.value === authorId,
    )

    if (index < 0) throw new Error('unauthorized.')

    this.items.splice(index, 1)
  }

  async update(
    questionId: string,
    authorId: string,
    questionComment: QuestionComment,
  ): Promise<{ questionComment: QuestionComment }> {
    const index = this.items.findIndex(
      (item) =>
        item.id.value === questionId && item.authorId.value === authorId,
    )

    if (index < 0) throw new Error('unauthorized.')

    this.items[index] = questionComment

    return { questionComment }
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<{ questionComments: QuestionComment[] }> {
    if (page === 0) {
      page = 1
    }
    const questionComments = this.items
      .filter((item) => item.questionId.value === questionId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return { questionComments }
  }

  async findManyByQuestionIdWithAuthor(
    questionId: string,
    { page }: PaginationParams,
  ) {
    const questionComments = this.items
      .filter((item) => item.questionId.value === questionId)
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

    return { questionComments }
  }
}
