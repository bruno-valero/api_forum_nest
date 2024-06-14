import UniqueEntityId from '@/core/entities/unique-entity-id'
import Question from '@/domain/forum/enterprise/entities/question'
import Slug from '@/domain/forum/enterprise/entities/value-objects.ts/slug'
import { Question as PrismaQuestion } from '@prisma/client'

export class PrismaQuestionMapper {
  static toDomain(prismaQuestion: PrismaQuestion): Question {
    const { id, ...data } = prismaQuestion
    const question = Question.create(
      {
        authorId: data.authorId,
        content: data.content,
        title: data.title,
        bestAnsweredId: data.bestAnsweredId
          ? new UniqueEntityId(data.bestAnsweredId ?? '')
          : null,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        slug: new Slug(data.slug),
      },
      new UniqueEntityId(id),
    )

    return question
  }

  static domainToPrisma(question: Question): PrismaQuestion {
    const prismaQuestion: PrismaQuestion = {
      content: question.content,
      slug: question.slug.value,
      title: question.title,
      authorId: question.authorId.value,
      bestAnsweredId: question.bestAnsweredId?.value ?? null,
      createdAt: question.createdAt,
      id: question.id.value,
      updatedAt: question.updatedAt ?? null,
    }
    return prismaQuestion
  }
}
