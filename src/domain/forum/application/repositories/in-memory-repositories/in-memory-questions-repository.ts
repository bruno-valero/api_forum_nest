import Question from '@/domain/forum/enterprise/entities/question'
import QuestionsRepository from '../questions-repository'
import { PaginationParams } from '@/core/respositories/pagination-params'
import { DomainEvents } from '@/core/events/domain-events'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects.ts/question-details'
import InMemoryStudentsRepository from './in-memory-students-repository'
import { InMemoryAttachmentsRepository } from './in-memory-attachments-repository'
import InMemoryQuestionAttachmentRepository from './in-memory-question-attachment-repository'

export default class InMemoryQuestionRepository implements QuestionsRepository {
  constructor(
    private questionAttachmentsRepository: InMemoryQuestionAttachmentRepository,
    private attachmentsRepository: InMemoryAttachmentsRepository,
    private studentsRepository: InMemoryStudentsRepository,
  ) {}

  items: Question[] = []

  async create(question: Question): Promise<{ question: Question }> {
    this.items.push(question)

    await this.questionAttachmentsRepository.createMany(
      question.attachments.getItems(),
    )

    DomainEvents.dispatchEventsForAggregate(question.id)

    return { question }
  }

  async getBySlug(slug: string): Promise<{ question: Question } | null> {
    const question =
      this.items.filter((item) => item.slug.value === slug)[0] ?? null

    if (!question) return null
    return { question }
  }

  async getById(id: string): Promise<{ question: Question } | null> {
    const question =
      this.items.filter((item) => item.id.value === id)[0] ?? null

    if (!question) return null
    return { question }
  }

  async delete(questionId: string, authorId: string): Promise<void> {
    const index = this.items.findIndex(
      (item) =>
        item.id.value === questionId && item.authorId.value === authorId,
    )

    if (index < 0) throw new Error('unauthorized.')
    await this.questionAttachmentsRepository.deleteManyByQuestionId(questionId)
    this.items.splice(index, 1)
  }

  async update(
    questionId: string,
    authorId: string,
    question: Question,
  ): Promise<{ question: Question }> {
    const index = this.items.findIndex(
      (item) =>
        item.id.value === questionId && item.authorId.value === authorId,
    )

    if (index < 0) throw new Error('unauthorized.')

    this.items[index] = question

    await this.questionAttachmentsRepository.createMany(
      question.attachments.getNewItems(),
    )

    await this.questionAttachmentsRepository.deleteMany(
      question.attachments.getRemovedItems(),
    )

    DomainEvents.dispatchEventsForAggregate(question.id)

    return { question }
  }

  async findManyRecent({
    page,
  }: PaginationParams): Promise<{ questions: Question[] }> {
    if (page === 0) {
      page = 1
    }
    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return { questions }
  }

  async findDetailsBySlug(slug: string) {
    const question = this.items.find((item) => item.slug.value === slug)

    if (!question) {
      return null
    }

    const author = this.studentsRepository.items.find((student) => {
      return student.id.equals(question.authorId)
    })

    if (!author) {
      throw new Error(
        `Author with ID "${question.authorId.toString()}" does not exist.`,
      )
    }

    const questionAttachments = this.questionAttachmentsRepository.items.filter(
      (questionAttachment) => {
        return questionAttachment.questionId.equals(question.id)
      },
    )

    const attachments = questionAttachments.map((questionAttachment) => {
      const attachment = this.attachmentsRepository.items.find((attachment) => {
        return attachment.id.equals(questionAttachment.attachmentId)
      })

      if (!attachment) {
        throw new Error(
          `Attachment with ID "${questionAttachment.attachmentId.toString()}" does not exist.`,
        )
      }

      return attachment
    })

    return QuestionDetails.create({
      questionId: question.id,
      authorId: question.authorId,
      author: author.name,
      title: question.title,
      slug: question.slug,
      content: question.content,
      bestAnswerId: question.bestAnsweredId,
      attachments,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    })
  }
}
