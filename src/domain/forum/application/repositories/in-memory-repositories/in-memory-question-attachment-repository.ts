import { QuestionAttachmentsRepository } from '../questions-attachment-repository'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'

export default class InMemoryQuestionAttachmentRepository
  implements QuestionAttachmentsRepository
{
  items: QuestionAttachment[] = []

  async create(
    questionAttachment: QuestionAttachment,
  ): Promise<{ questionAttachment: QuestionAttachment }> {
    this.items.push(questionAttachment)

    return { questionAttachment }
  }

  async getById(
    id: string,
  ): Promise<{ questionAttachment: QuestionAttachment } | null> {
    const questionAttachment =
      this.items.filter((item) => item.id.value === id)[0] ?? null

    if (!questionAttachment) return null
    return { questionAttachment }
  }

  async deleteManyByQuestionId(questionId: string) {
    this.items = this.items.filter(
      (item) => item.questionId.value !== questionId,
    )
  }

  async deleteUniqueByAttachmentId(attachmentId: string): Promise<void> {
    this.items = this.items.filter((item) => item.id.value === attachmentId)
  }

  async createMany(attachments: QuestionAttachment[]): Promise<void> {
    this.items.push(...attachments)
  }

  async deleteMany(attachments: QuestionAttachment[]): Promise<void> {
    const questionAttachments = this.items.filter((item) => {
      return !attachments.some((attachment) => attachment.equals(item))
    })

    this.items = questionAttachments
  }

  async findManyByQuestionId(
    questionId: string,
  ): Promise<{ questionAttachments: QuestionAttachment[] }> {
    const questionAttachments = this.items.filter(
      (item) => item.questionId.value === questionId,
    )

    return { questionAttachments }
  }
}
