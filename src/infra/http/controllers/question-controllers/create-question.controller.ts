import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { TokenSchema } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

import { z } from 'zod'
import CreateQuestionUseCase from '@/domain/forum/application/use-cases/create-question-use-case'
import { PrismaQuestionMapper } from '@/infra/database/prisma/mappers/question-mappers/prisma-question-mapper'

const bodySchema = z.object({
  title: z.string(),
  content: z.string(),
  attachments: z.array(z.string().uuid()),
})

type BodySchema = z.infer<typeof bodySchema>

@Controller('/questions')
export class CreateQuestionController {
  constructor(
    private readonly createQuestion: CreateQuestionUseCase,
    // private readonly jwt: JwtService,
  ) {}

  @Post()
  async handle(
    @Body(new ZodValidationPipe(bodySchema))
    { title, content, attachments }: BodySchema,
    @CurrentUser() user: TokenSchema,
  ) {
    const questionResp = await this.createQuestion.execute({
      authorId: user.sub,
      title,
      content,
      attachmentsIds: attachments,
    })

    if (questionResp.isLeft()) {
      throw new BadRequestException()
    }

    if (questionResp.isRight()) {
      const question = PrismaQuestionMapper.domainToPrisma(
        questionResp.value.question,
      )

      return { question }
    }
  }
}
