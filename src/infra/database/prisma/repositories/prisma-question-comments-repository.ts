import { PaginationParams } from '@/core/respositories/pagination-params'
import QuestionCommentsRepository from '@/domain/forum/application/repositories/question-comments-repository'
import QuestionComment from '@/domain/forum/enterprise/entities/question-comments'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaQuestionCommentMapper } from '../mappers/question-mappers/prisma-question-comments-mapper'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects.ts/comment-with-author'
import { PrismaCommentWithAuthorMapper } from '../mappers/prisma-question-comment-with-author-mapper'

@Injectable()
export class PrismaQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create(
    questionComment: QuestionComment,
  ): Promise<{ questionComment: QuestionComment }> {
    const prismaComment = await this.prisma.comment.create({
      data: PrismaQuestionCommentMapper.domainToPrisma(questionComment),
    })

    const mappedComment = PrismaQuestionCommentMapper.toDomain(prismaComment)

    return { questionComment: mappedComment }
  }

  async getById(
    id: string,
  ): Promise<{ questionComment: QuestionComment } | null> {
    const prismaComment = await this.prisma.comment.findUnique({
      where: {
        id,
      },
    })

    if (!prismaComment) return null

    const mappedComment = PrismaQuestionCommentMapper.toDomain(prismaComment)

    return { questionComment: mappedComment }
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
    questionId: string,
    authorId: string,
    data: QuestionComment,
  ): Promise<{ questionComment: QuestionComment }> {
    await this.prisma.comment.updateMany({
      where: {
        questionId,
        authorId,
      },
      data: PrismaQuestionCommentMapper.domainToPrisma(data),
    })

    return { questionComment: data }
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<{ questionComments: QuestionComment[] }> {
    const prismaComments = await this.prisma.comment.findMany({
      where: {
        questionId,
      },
      take: 20,
      skip: page - 1,
    })

    const mappedComment = prismaComments.map(
      PrismaQuestionCommentMapper.toDomain,
    )

    return { questionComments: mappedComment }
  }

  async findManyByQuestionIdWithAuthor(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<{ questionComments: CommentWithAuthor[] }> {
    const questionCommentsResp = await this.prisma.comment.findMany({
      where: {
        questionId,
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

    const questionComments = questionCommentsResp.map(
      PrismaCommentWithAuthorMapper.toDomain,
    )

    return { questionComments }
  }
}
