import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { TokenSchema } from '@/infra/auth/jwt.strategy'

import DeleteCommentOnAnswerUseCase from '@/domain/forum/application/use-cases/delete-comment-on-answer'

@Controller('/answers/:answerId/comments/:answerCommentId')
export class DeleteCommentOnAnswerController {
  constructor(
    private readonly commentOnAnswer: DeleteCommentOnAnswerUseCase,
    // private readonly jwt: JwtService,
  ) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @Param('answerId') answerId: string,
    @Param('answerCommentId') answerCommentId: string,
    @CurrentUser() user: TokenSchema,
  ) {
    const answerResp = await this.commentOnAnswer.execute({
      authorId: user.sub,
      answerId,
      answerCommentId,
    })

    console.log('answerResp value', answerResp.value)

    if (answerResp.isLeft()) {
      throw new BadRequestException()
    }

    // if (answerResp.isRight()) {
    //   const answer = PrismaAnswerCommentMapper.domainToPrisma(
    //     answerResp.value.answerComment,
    //   )

    //   return { answer }
    // }
  }
}
