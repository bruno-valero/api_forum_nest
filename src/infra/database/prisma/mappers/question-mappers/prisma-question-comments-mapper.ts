import UniqueEntityId from '@/core/entities/unique-entity-id'
import QuestionComment from '@/domain/forum/enterprise/entities/question-comments'
import { Comment as PrismaComment } from '@prisma/client'

export class PrismaQuestionCommentMapper {
  static toDomain(prismaComment: PrismaComment): QuestionComment {
    const { id, ...data } = prismaComment

    if (!data.questionId) throw new Error('invalid comment type.')

    const question = QuestionComment.create(
      {
        authorId: data.authorId,
        questionId: data.questionId,
        content: data.content,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
      new UniqueEntityId(id),
    )

    return question
  }

  static domainToPrisma(question: QuestionComment): PrismaComment {
    const prismaQuestion: PrismaComment = {
      id: question.id.value,
      authorId: question.authorId.value,
      questionId: question.questionId.value,
      content: question.content,
      answerId: null,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt ?? null,
    }
    return prismaQuestion
  }
}
