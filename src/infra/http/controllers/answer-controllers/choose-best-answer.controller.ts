import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
  UsePipes,
} from '@nestjs/common'
import { TokenSchema } from '@/infra/auth/jwt.strategy'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import ChooseBestAnswerUseCase from '@/domain/forum/application/use-cases/choose-best-answer-use-case'

@Controller('/answers/:answerId/choose-as-best')
export class ChooseBestAnswerController {
  constructor(
    private readonly chooseBestAnswer: ChooseBestAnswerUseCase,
    // private readonly jwt: JwtService,
  ) {}

  @Patch()
  @HttpCode(204)
  @UsePipes()
  async handle(
    @Param('answerId') answerId: string,
    @CurrentUser() user: TokenSchema,
  ) {
    const answerResp = await this.chooseBestAnswer.execute({
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
