import UniqueEntityId from '@/core/entities/unique-entity-id'
import Answer from '@/domain/forum/enterprise/entities/answer'
import { Answer as PrismaAnswer } from '@prisma/client'

export class PrismaAnswerMapper {
  static toDomain(prismaAnswer: PrismaAnswer): Answer {
    const { id, ...data } = prismaAnswer
    const answer = Answer.create(
      {
        authorId: data.authorId,
        content: data.content,
        questionId: data.questionId,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
      new UniqueEntityId(id),
    )

    return answer
  }

  static domainToPrisma(answer: Answer): PrismaAnswer {
    const prismaQuestion: PrismaAnswer = {
      content: answer.content,
      authorId: answer.authorId.value,
      questionId: answer.questionId.value,
      createdAt: answer.createdAt,
      id: answer.id.value,
      updatedAt: answer.updatedAt ?? null,
    }
    return prismaQuestion
  }
}
