import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Param,
  Query,
} from '@nestjs/common'

import FetchAnswerCommentsUseCase from '@/domain/forum/application/use-cases/fetch-answer-comments'
import { CommentWithAuthorPresenter } from '@/infra/http/presenters/comment-with-author-presenter'

@Controller('/answers/:answerId/comments')
export class FetchAnswerCommentsController {
  constructor(
    private readonly fetchAnswerComments: FetchAnswerCommentsUseCase,
    // private readonly jwt: JwtService,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Param('answerId') answerId: string,
    @Query('page') page?: string,
  ) {
    const answerResp = await this.fetchAnswerComments.execute({
      answerId,
      page: Number(page ?? 1),
    })

    console.log('answerResp value', answerResp.value)

    if (answerResp.isLeft()) {
      throw new BadRequestException()
    }

    if (answerResp.isRight()) {
      const answerComments = answerResp.value.answerComments.map(
        CommentWithAuthorPresenter.toHTTP,
      )

      return { answerComments }
    }
  }
}
