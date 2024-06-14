import UniqueEntityId from '@/core/entities/unique-entity-id'
import AnswerComment from '@/domain/forum/enterprise/entities/answer-comments'
import { Comment as PrismaComment } from '@prisma/client'

export class PrismaAnswerCommentMapper {
  static toDomain(prismaComment: PrismaComment): AnswerComment {
    const { id, ...data } = prismaComment

    if (!data.answerId) throw new Error('invalid comment type.')

    const answer = AnswerComment.create(
      {
        authorId: data.authorId,
        answerId: data.answerId,
        content: data.content,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
      new UniqueEntityId(id),
    )

    return answer
  }

  static domainToPrisma(answer: AnswerComment): PrismaComment {
    const prismaQuestion: PrismaComment = {
      id: answer.id.value,
      authorId: answer.authorId.value,
      answerId: answer.answerId.value,
      content: answer.content,
      questionId: null,
      createdAt: answer.createdAt,
      updatedAt: answer.updatedAt ?? null,
    }
    return prismaQuestion
  }
}
