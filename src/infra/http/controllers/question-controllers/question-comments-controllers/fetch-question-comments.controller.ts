import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Param,
  Query,
} from '@nestjs/common'

import FetchQuestionCommentsUseCase from '@/domain/forum/application/use-cases/fetch-question-comments'
import { CommentWithAuthorPresenter } from '@/infra/http/presenters/comment-with-author-presenter'

@Controller('/questions/:questionId/comments')
export class FetchQuestionCommentsController {
  constructor(
    private readonly fetchQuestionComments: FetchQuestionCommentsUseCase,
    // private readonly jwt: JwtService,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Param('questionId') questionId: string,
    @Query('page') page?: string,
  ) {
    const questionResp = await this.fetchQuestionComments.execute({
      questionId,
      page: Number(page ?? 1),
    })

    console.log('questionResp value', questionResp.value)

    if (questionResp.isLeft()) {
      throw new BadRequestException()
    }

    if (questionResp.isRight()) {
      const questionComments = questionResp.value.questionComments.map(
        CommentWithAuthorPresenter.toHTTP,
      )

      return { questionComments }
    }
  }
}
