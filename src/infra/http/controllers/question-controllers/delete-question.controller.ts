import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
  UsePipes,
} from '@nestjs/common'

import DeleteQuestionUseCase from '@/domain/forum/application/use-cases/delete-question-use-case'
import { TokenSchema } from '@/infra/auth/jwt.strategy'
import { CurrentUser } from '@/infra/auth/current-user-decorator'

@Controller('/questions/:questionId')
export class DeleteQuestionController {
  constructor(
    private readonly deleteQuestion: DeleteQuestionUseCase,
    // private readonly jwt: JwtService,
  ) {}

  @Delete()
  @HttpCode(204)
  @UsePipes()
  async handle(
    @Param('questionId') questionId: string,
    @CurrentUser() user: TokenSchema,
  ) {
    const questionResp = await this.deleteQuestion.execute({
      authorId: user.sub,
      questionId,
    })

    if (questionResp.isLeft()) {
      throw new BadRequestException()
    }

    if (questionResp.isRight()) {
      return null
    }
  }
}
