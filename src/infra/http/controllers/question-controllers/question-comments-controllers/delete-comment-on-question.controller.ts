import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { TokenSchema } from '@/infra/auth/jwt.strategy'

import DeleteCommentOnQuestionUseCase from '@/domain/forum/application/use-cases/delete-comment-on-question'

@Controller('/questions/:questionId/comments/:questionCommentId')
export class DeleteCommentOnQuestionController {
  constructor(
    private readonly commentOnQuestion: DeleteCommentOnQuestionUseCase,
    // private readonly jwt: JwtService,
  ) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @Param('questionId') questionId: string,
    @Param('questionCommentId') questionCommentId: string,
    @CurrentUser() user: TokenSchema,
  ) {
    const questionResp = await this.commentOnQuestion.execute({
      authorId: user.sub,
      questionId,
      questionCommentId,
    })

    console.log('questionResp value', questionResp.value)

    if (questionResp.isLeft()) {
      throw new BadRequestException()
    }

    // if (questionResp.isRight()) {
    //   const question = PrismaQuestionCommentMapper.domainToPrisma(
    //     questionResp.value.questionComment,
    //   )

    //   return { question }
    // }
  }
}
