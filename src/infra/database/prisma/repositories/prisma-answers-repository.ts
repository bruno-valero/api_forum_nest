import { PaginationParams } from '@/core/respositories/pagination-params'
import AnswersRepository from '@/domain/forum/application/repositories/answers-repository'
import Answer from '@/domain/forum/enterprise/entities/answer'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaAnswerMapper } from '../mappers/answer-mappers/prisma-answer-mapper'
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachment-repository'
import { DomainEvents } from '@/core/events/domain-events'

@Injectable()
export class PrismaAnswersRepository implements AnswersRepository {
  constructor(
    private prisma: PrismaService,
    private answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) {}

  async create(answer: Answer): Promise<{ answer: Answer }> {
    const answerCreated = await this.prisma.answer.create({
      data: PrismaAnswerMapper.domainToPrisma(answer),
    })

    await this.answerAttachmentsRepository.createMany(
      answer.attachments.getItems(),
    )

    DomainEvents.dispatchEventsForAggregate(answer.id)

    const answerMapped = PrismaAnswerMapper.toDomain(answerCreated)

    return { answer: answerMapped }
  }

  async getById(id: string): Promise<{ answer: Answer } | null> {
    const answerGetted = await this.prisma.answer.findUnique({
      where: {
        id,
      },
    })

    if (!answerGetted) return null

    const answerMapped = PrismaAnswerMapper.toDomain(answerGetted)

    return { answer: answerMapped }
  }

  async delete(answerId: string, authorId: string): Promise<void> {
    await this.prisma.answer.delete({
      where: {
        id: answerId,
        authorId,
      },
    })
  }

  async update(
    answerId: string,
    authorId: string,
    data: Answer,
  ): Promise<{ answer: Answer }> {
    const answerUpdated = await this.prisma.answer.update({
      where: {
        id: answerId,
        authorId,
      },
      data: PrismaAnswerMapper.domainToPrisma(data),
    })

    await Promise.all([
      this.answerAttachmentsRepository.createMany(
        data.attachments.getNewItems(),
      ),
      this.answerAttachmentsRepository.deleteMany(
        data.attachments.getRemovedItems(),
      ),
    ])

    DomainEvents.dispatchEventsForAggregate(data.id)

    const answerMapped = PrismaAnswerMapper.toDomain(answerUpdated)

    return { answer: answerMapped }
  }

  async findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<{ answers: Answer[] }> {
    const answersUpdated = await this.prisma.answer.findMany({
      where: {
        questionId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (params.page - 1) * 20,
    })

    const answersMapped = answersUpdated.map(PrismaAnswerMapper.toDomain)

    return { answers: answersMapped }
  }
}
