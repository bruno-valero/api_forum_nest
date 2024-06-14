import { PaginationParams } from '@/core/respositories/pagination-params'
import AnswerCommentsRepository from '@/domain/forum/application/repositories/answer-comments-repository'
import AnswerComment from '@/domain/forum/enterprise/entities/answer-comments'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaAnswerCommentMapper } from '../mappers/answer-mappers/prisma-answer-comments-mapper'
import { PrismaCommentWithAuthorMapper } from '../mappers/prisma-question-comment-with-author-mapper'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects.ts/comment-with-author'

@Injectable()
export class PrismaAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create(
    answerComment: AnswerComment,
  ): Promise<{ answerComment: AnswerComment }> {
    const prismaComment = await this.prisma.comment.create({
      data: PrismaAnswerCommentMapper.domainToPrisma(answerComment),
    })

    const mappedComment = PrismaAnswerCommentMapper.toDomain(prismaComment)

    return { answerComment: mappedComment }
  }

  async getById(id: string): Promise<{ answerComment: AnswerComment } | null> {
    const prismaComment = await this.prisma.comment.findUnique({
      where: {
        id,
      },
    })

    if (!prismaComment) return null

    const mappedComment = PrismaAnswerCommentMapper.toDomain(prismaComment)

    return { answerComment: mappedComment }
  }

  async delete(id: string, authorId: string): Promise<void> {
    await this.prisma.comment.delete({
      where: {
        id,
        authorId,
      },
    })
  }

  async update(
    answerId: string,
    authorId: string,
    data: AnswerComment,
  ): Promise<{ answerComment: AnswerComment }> {
    await this.prisma.comment.updateMany({
      where: {
        answerId,
        authorId,
      },
      data: PrismaAnswerCommentMapper.domainToPrisma(data),
    })

    return { answerComment: data }
  }

  async findManyByAnswerId(
    answerId: string,
    { page }: PaginationParams,
  ): Promise<{ answerComments: AnswerComment[] }> {
    const prismaComments = await this.prisma.comment.findMany({
      where: {
        answerId,
      },
      take: 20,
      skip: page - 1,
    })

    const mappedComment = prismaComments.map(PrismaAnswerCommentMapper.toDomain)

    return { answerComments: mappedComment }
  }

  async findManyByAnswerIdWithAuthor(
    answerId: string,
    { page }: PaginationParams,
  ): Promise<{ answerComments: CommentWithAuthor[] }> {
    const answerCommentsResp = await this.prisma.comment.findMany({
      where: {
        answerId,
      },
      include: {
        author: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    const answerComments = answerCommentsResp.map(
      PrismaCommentWithAuthorMapper.toDomain,
    )

    return { answerComments }
  }
}
