import { PaginationParams } from '@/core/respositories/pagination-params'
import QuestionsRepository from '@/domain/forum/application/repositories/questions-repository'
import Question from '@/domain/forum/enterprise/entities/question'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaQuestionMapper } from '../mappers/question-mappers/prisma-question-mapper'
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/questions-attachment-repository'
import { PrismaQuestionDetailsMapper } from '../mappers/question-mappers/prisma-question-details-mapper'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects.ts/question-details'
import { DomainEvents } from '@/core/events/domain-events'
import { CacheRepository } from '@/infra/cache/cache-repository'

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
  constructor(
    private prisma: PrismaService,
    private questionAttachmentsRepository: QuestionAttachmentsRepository,
    private cache: CacheRepository,
  ) {}

  async create(question: Question): Promise<{ question: Question }> {
    const questionPrisma = await this.prisma.question.create({
      data: PrismaQuestionMapper.domainToPrisma(question),
    })

    await this.questionAttachmentsRepository.createMany(
      question.attachments.getItems(),
    )

    const mappedQuestion = PrismaQuestionMapper.toDomain(questionPrisma)

    DomainEvents.dispatchEventsForAggregate(question.id)

    return { question: mappedQuestion }
  }

  async getById(id: string): Promise<{ question: Question } | null> {
    const questionGetted = await this.prisma.question.findUnique({
      where: {
        id,
      },
    })

    if (!questionGetted) return null

    const mappedQuestion = PrismaQuestionMapper.toDomain(questionGetted)

    return { question: mappedQuestion }
  }

  async getBySlug(slug: string): Promise<{ question: Question } | null> {
    const questionGetted = await this.prisma.question.findUnique({
      where: {
        slug,
      },
    })

    if (!questionGetted) return null

    const mappedQuestion = PrismaQuestionMapper.toDomain(questionGetted)

    return { question: mappedQuestion }
  }

  async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
    const cacheHit = await this.cache.get(`question:${slug}:details`)

    if (cacheHit) {
      const cacheData = JSON.parse(cacheHit)

      return cacheData
    }

    const question = await this.prisma.question.findUnique({
      where: {
        slug,
      },
      include: {
        author: true,
        attachments: true,
      },
    })

    if (!question) {
      return null
    }

    const questionDetails = PrismaQuestionDetailsMapper.toDomain(question)

    await this.cache.set(
      `question:${slug}:details`,
      JSON.stringify(questionDetails),
    )

    return questionDetails
  }

  async delete(questionId: string, authorId: string): Promise<void> {
    await this.prisma.question.delete({
      where: {
        id: questionId,
        authorId,
      },
    })
  }

  async update(
    questionId: string,
    authorId: string,
    data: Question,
  ): Promise<{ question: Question }> {
    const questionUpdated = await this.prisma.question.update({
      where: {
        id: questionId,
        authorId,
      },
      data: PrismaQuestionMapper.domainToPrisma(data),
    })

    await Promise.all([
      this.questionAttachmentsRepository.createMany(
        data.attachments.getNewItems(),
      ),
      this.questionAttachmentsRepository.deleteMany(
        data.attachments.getRemovedItems(),
      ),
      this.cache.delete(`question:${data.slug}:details`),
    ])

    DomainEvents.dispatchEventsForAggregate(data.id)

    const mappedQuestion = PrismaQuestionMapper.toDomain(questionUpdated)

    return { question: mappedQuestion }
  }

  async findManyRecent(
    params: PaginationParams,
  ): Promise<{ questions: Question[] }> {
    const questionFetched = await this.prisma.question.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (params.page - 1) * 20,
    })

    const mappedQuestions = questionFetched.map(PrismaQuestionMapper.toDomain)

    return { questions: mappedQuestions }
  }
}
