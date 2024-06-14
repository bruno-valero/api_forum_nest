import { AnswerAttachmentsRepository } from '../answer-attachment-repository'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'

export default class InMemoryAnswerAttachmentRepository
  implements AnswerAttachmentsRepository
{
  items: AnswerAttachment[] = []

  async create(
    answerAttachment: AnswerAttachment,
  ): Promise<{ answerAttachment: AnswerAttachment }> {
    this.items.push(answerAttachment)

    return { answerAttachment }
  }

  async createMany(attachments: AnswerAttachment[]): Promise<void> {
    this.items.push(...attachments)
  }

  async deleteMany(attachments: AnswerAttachment[]): Promise<void> {
    const answerAttachments = this.items.filter((item) => {
      return !attachments.some((attachment) => attachment.equals(item))
    })

    this.items = answerAttachments
  }

  async getById(
    id: string,
  ): Promise<{ answerAttachment: AnswerAttachment } | null> {
    const answerAttachment =
      this.items.filter((item) => item.id.value === id)[0] ?? null

    if (!answerAttachment) return null
    return { answerAttachment }
  }

  async deleteManyByAnswerId(answerId: string) {
    this.items = this.items.filter((item) => item.answerId.value !== answerId)
  }

  async deleteUniqueByAttachmentId(attachmentId: string): Promise<void> {
    this.items = this.items.filter((item) => item.id.value === attachmentId)
  }

  async findManyByAnswerId(
    answerId: string,
  ): Promise<{ answerAttachments: AnswerAttachment[] }> {
    const answerAttachments = this.items.filter(
      (item) => item.answerId.value === answerId,
    )

    return { answerAttachments }
  }
}
