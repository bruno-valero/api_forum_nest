import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { TokenSchema } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

import { z } from 'zod'
import CommentOnQuestionUseCase from '@/domain/forum/application/use-cases/comment-on-question'
import { PrismaQuestionCommentMapper } from '@/infra/database/prisma/mappers/question-mappers/prisma-question-comments-mapper'

const bodySchema = z.object({
  content: z.string(),
})

type BodySchema = z.infer<typeof bodySchema>

@Controller('/questions/:questionId/comments')
export class CommentOnQuestionController {
  constructor(
    private readonly commentOnQuestion: CommentOnQuestionUseCase,
    // private readonly jwt: JwtService,
  ) {}

  @Post()
  async handle(
    @Body(new ZodValidationPipe(bodySchema))
    body: BodySchema,
    @Param('questionId') questionId: string,
    @CurrentUser() user: TokenSchema,
  ) {
    console.log('questionResp body', body)
    console.log('questionResp questionId', questionId)
    console.log('questionResp authorId', user.sub)

    const questionResp = await this.commentOnQuestion.execute({
      ...body,
      questionId,
      authorId: user.sub,
    })

    console.log('questionResp value', questionResp.value)

    if (questionResp.isLeft()) {
      throw new BadRequestException()
    }

    if (questionResp.isRight()) {
      const question = PrismaQuestionCommentMapper.domainToPrisma(
        questionResp.value.questionComment,
      )

      return { question }
    }
  }
}
