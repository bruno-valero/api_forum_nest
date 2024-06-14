import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
  UsePipes,
} from '@nestjs/common'

import DeleteAnswerUseCase from '@/domain/forum/application/use-cases/delete-answer-use-case'
import { TokenSchema } from '@/infra/auth/jwt.strategy'
import { CurrentUser } from '@/infra/auth/current-user-decorator'

@Controller('/answers/:answerId')
export class DeleteAnswerController {
  constructor(
    private readonly deleteAnswer: DeleteAnswerUseCase,
    // private readonly jwt: JwtService,
  ) {}

  @Delete()
  @HttpCode(204)
  @UsePipes()
  async handle(
    @Param('answerId') answerId: string,
    @CurrentUser() user: TokenSchema,
  ) {
    const answerResp = await this.deleteAnswer.execute({
      authorId: user.sub,
      answerId,
    })

    if (answerResp.isLeft()) {
      throw new BadRequestException()
    }

    if (answerResp.isRight()) {
      return null
    }
  }
}
