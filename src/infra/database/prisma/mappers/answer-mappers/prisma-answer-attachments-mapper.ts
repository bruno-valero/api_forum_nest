import UniqueEntityId from '@/core/entities/unique-entity-id'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'
import { Attachment as PrismaAttachment } from '@prisma/client'

export class PrismaAttachmentMapper {
  static toDomain(prismaAttachment: PrismaAttachment): AnswerAttachment {
    const { id, ...data } = prismaAttachment

    if (!data.answerId) throw new Error('invalid attachment type.')

    const answer = AnswerAttachment.create(
      {
        answerId: data.answerId,
        attachmentId: id,
      },
      new UniqueEntityId(id),
    )

    return answer
  }

  //   static domainToPrisma(answer: AnswerAttachment): PrismaAttachment {
  //     const prismaQuestion: PrismaAttachment = {
  //       id: answer.id.value,
  //       authorId: answer.authorId.value,
  //       answerId: answer.answerId.value,
  //       content: answer.content,
  //       questionId: null,
  //       createdAt: answer.createdAt,
  //       updatedAt: answer.updatedAt ?? null,
  //     }
  //     return prismaQuestion
  //   }
}
