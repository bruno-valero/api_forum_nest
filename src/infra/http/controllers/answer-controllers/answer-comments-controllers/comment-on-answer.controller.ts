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
import CommentOnAnswerUseCase from '@/domain/forum/application/use-cases/comment-on-answer'
import { PrismaAnswerCommentMapper } from '@/infra/database/prisma/mappers/answer-mappers/prisma-answer-comments-mapper'

const bodySchema = z.object({
  content: z.string(),
})

type BodySchema = z.infer<typeof bodySchema>

@Controller('/answers/:answerId/comments')
export class CommentOnAnswerController {
  constructor(
    private readonly commentOnAnswer: CommentOnAnswerUseCase,
    // private readonly jwt: JwtService,
  ) {}

  @Post()
  async handle(
    @Body(new ZodValidationPipe(bodySchema))
    body: BodySchema,
    @Param('answerId') answerId: string,
    @CurrentUser() user: TokenSchema,
  ) {
    const answerResp = await this.commentOnAnswer.execute({
      ...body,
      answerId,
      authorId: user.sub,
    })

    console.log('answerResp value', answerResp.value)

    if (answerResp.isLeft()) {
      throw new BadRequestException()
    }

    if (answerResp.isRight()) {
      const answer = PrismaAnswerCommentMapper.domainToPrisma(
        answerResp.value.answerComment,
      )

      return { answer }
    }
  }
}
