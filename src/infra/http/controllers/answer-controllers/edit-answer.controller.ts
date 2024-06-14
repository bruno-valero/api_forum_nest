import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
  UsePipes,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

import { z } from 'zod'
import EditAnswerUseCase from '@/domain/forum/application/use-cases/edit-answer-use-case'
import { TokenSchema } from '@/infra/auth/jwt.strategy'
import { CurrentUser } from '@/infra/auth/current-user-decorator'

const bodySchema = z.object({
  //   authorId: z.string(),
  data: z.object({ content: z.string() }),
  attachmentsIds: z.array(z.string()),
})

type BodySchema = z.infer<typeof bodySchema>

const validationPipe = new ZodValidationPipe(bodySchema)

@Controller('/answers/:answerId')
export class EditAnswerController {
  constructor(
    private readonly editAnswer: EditAnswerUseCase,
    // private readonly jwt: JwtService,
  ) {}

  @Put()
  @HttpCode(204)
  @UsePipes()
  async handle(
    @Body(validationPipe) body: BodySchema,
    @Param('answerId') answerId: string,
    @CurrentUser() user: TokenSchema,
  ) {
    const answerResp = await this.editAnswer.execute({
      ...body,
      authorId: user.sub,
      answerId,
    })

    if (answerResp.isLeft()) {
      throw new BadRequestException()
    }

    // if (answerResp.isRight()) {
    //   return null
    // }
  }
}
