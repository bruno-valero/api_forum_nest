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
import { PrismaAnswerMapper } from '@/infra/database/prisma/mappers/answer-mappers/prisma-answer-mapper'
import AnswerQuestionUseCase from '@/domain/forum/application/use-cases/answer-questions'

const bodySchema = z.object({
  content: z.string(),
  attachmentsIds: z.array(z.string()),
})

type BodySchema = z.infer<typeof bodySchema>

@Controller('/questions/:questionId/answers/')
export class AnswerQuestionController {
  constructor(
    private readonly createAnswer: AnswerQuestionUseCase,
    // private readonly jwt: JwtService,
  ) {}

  @Post()
  async handle(
    @Body(new ZodValidationPipe(bodySchema))
    body: BodySchema,
    @Param('questionId') questionId: string,
    @CurrentUser() user: TokenSchema,
  ) {
    const answerResp = await this.createAnswer.execute({
      ...body,
      attachmentsIds: [],
      authorId: user.sub,
      questionId,
    })

    if (answerResp.isLeft()) {
      throw new BadRequestException()
    }

    if (answerResp.isRight()) {
      const answer = PrismaAnswerMapper.domainToPrisma(answerResp.value.answer)

      return { answer }
    }
  }
}
