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
import EditQuestionUseCase from '@/domain/forum/application/use-cases/edit-question-use-case'
import { TokenSchema } from '@/infra/auth/jwt.strategy'
import { CurrentUser } from '@/infra/auth/current-user-decorator'

const bodySchema = z.object({
  //   authorId: z.string(),
  data: z.object({ title: z.string(), content: z.string() }),
  attachmentsIds: z.array(z.string()),
})

type BodySchema = z.infer<typeof bodySchema>

const validationPipe = new ZodValidationPipe(bodySchema)

@Controller('/questions/:questionId')
export class EditQuestionController {
  constructor(
    private readonly editQuestion: EditQuestionUseCase,
    // private readonly jwt: JwtService,
  ) {}

  @Put()
  @HttpCode(204)
  @UsePipes()
  async handle(
    @Body(validationPipe) body: BodySchema,
    @Param('questionId') questionId: string,
    @CurrentUser() user: TokenSchema,
  ) {
    const questionResp = await this.editQuestion.execute({
      ...body,
      authorId: user.sub,
      questionId,
    })

    if (questionResp.isLeft()) {
      throw new BadRequestException()
    }

    // if (questionResp.isRight()) {
    //   return null
    // }
  }
}
