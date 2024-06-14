import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaQuestionAttachmentMapper } from '../mappers/question-mappers/prisma-question-attachments-mapper'
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/questions-attachment-repository'

@Injectable()
export class PrismaQuestionAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async createMany(attachments: QuestionAttachment[]): Promise<void> {
    if (attachments.length === 0) {
      return
    }

    const attachmentIds = attachments.map((attachment) => {
      return attachment.attachmentId.value
    })

    const questionId = attachments[0].questionId.value

    await this.prisma.attachment.updateMany({
      where: {
        id: {
          in: attachmentIds,
        },
      },
      data: {
        questionId,
      },
    })
  }

  async deleteMany(attachments: QuestionAttachment[]): Promise<void> {
    if (attachments.length === 0) {
      return
    }

    const attachmentIds = attachments.map((attachment) => {
      return attachment.attachmentId.value
    })

    await this.prisma.attachment.deleteMany({
      where: {
        id: {
          in: attachmentIds,
        },
      },
    })
  }

  async deleteManyByQuestionId(questionId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({
      where: {
        questionId,
      },
    })
  }

  async findManyByQuestionId(
    questionId: string,
  ): Promise<{ questionAttachments: QuestionAttachment[] }> {
    const prismaAttachments = await this.prisma.attachment.findMany({
      where: {
        questionId,
      },
    })

    const mappedAttachment = prismaAttachments.map(
      PrismaQuestionAttachmentMapper.toDomain,
    )

    return { questionAttachments: mappedAttachment }
  }
}
