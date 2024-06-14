import UniqueEntityId from '@/core/entities/unique-entity-id'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'
import { Prisma, Attachment as PrismaAttachment } from '@prisma/client'

export class PrismaQuestionAttachmentMapper {
  static toDomain(prismaAttachment: PrismaAttachment): QuestionAttachment {
    const { id, ...data } = prismaAttachment

    if (!data.questionId) throw new Error('invalid attachment type.')

    const question = QuestionAttachment.create(
      {
        questionId: data.questionId,
        attachmentId: id,
      },
      new UniqueEntityId(id),
    )

    return question
  }

  static domainToPrismaUpdateMany(
    attachments: QuestionAttachment[],
  ): Prisma.AttachmentUpdateManyArgs {
    const attachmentIds = attachments.map((attachment) => {
      return attachment.id.value
    })

    return {
      where: {
        id: {
          in: attachmentIds,
        },
      },
      data: {
        questionId: attachments[0].questionId.value,
      },
    }
  }
}
