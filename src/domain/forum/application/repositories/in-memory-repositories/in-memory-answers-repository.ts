import Answer from '@/domain/forum/enterprise/entities/answer'
import AnswersRepository from '../answers-repository'
import { PaginationParams } from '@/core/respositories/pagination-params'
import { AnswerAttachmentsRepository } from '../answer-attachment-repository'
import { DomainEvents } from '@/core/events/domain-events'

export default class InMemoryAnswersRepository implements AnswersRepository {
  constructor(
    protected answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) {}

  answers: Answer[] = []

  async create(answer: Answer): Promise<{ answer: Answer }> {
    this.answers.push(answer)

    await this.answerAttachmentsRepository.createMany(
      answer.attachments.getItems(),
    )

    DomainEvents.dispatchEventsForAggregate(answer.id)

    return { answer }
  }

  async getById(id: string): Promise<{ answer: Answer } | null> {
    const answer =
      this.answers.filter((item) => item.id.value === id)[0] ?? null

    if (!answer) return null
    return { answer }
  }

  async delete(answerId: string, authorId: string): Promise<void> {
    const index = this.answers.findIndex(
      (item) => item.id.value === answerId && item.authorId.value === authorId,
    )

    if (index < 0) throw new Error('unauthorized.')
    this.answers.splice(index, 1)

    await this.answerAttachmentsRepository.deleteManyByAnswerId(answerId)
  }

  async update(
    answerId: string,
    authorId: string,
    answer: Answer,
  ): Promise<{ answer: Answer }> {
    const index = this.answers.findIndex(
      (item) => item.id.value === answerId && item.authorId.value === authorId,
    )

    if (index < 0) throw new Error('unauthorized.')

    this.answers[index] = answer

    await this.answerAttachmentsRepository.createMany(
      answer.attachments.getNewItems(),
    )

    await this.answerAttachmentsRepository.deleteMany(
      answer.attachments.getRemovedItems(),
    )

    DomainEvents.dispatchEventsForAggregate(answer.id)

    return { answer }
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<{ answers: Answer[] }> {
    if (page === 0) {
      page = 1
    }

    const answers = this.answers
      .filter((item) => item.questionId.value === questionId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return { answers }
  }
}
