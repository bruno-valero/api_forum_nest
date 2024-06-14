import { BadRequestException, Controller, Get, Param } from '@nestjs/common'

import GetQuestionBySlugUseCase from '@/domain/forum/application/use-cases/get-question-by-slug-use-case'
import { QuestionDetailsPresenter } from '../../presenters/question-details-presenter'

@Controller('/questions/:slug')
export class GetQuestionBySlugController {
  constructor(
    private readonly getQuestionBySlug: GetQuestionBySlugUseCase,
    // private readonly jwt: JwtService,
  ) {}

  @Get()
  async handle(@Param('slug') slug: string) {
    const questionResp = await this.getQuestionBySlug.execute({ slug })

    if (questionResp.isLeft()) {
      throw new BadRequestException()
    }

    if (questionResp.isRight()) {
      const question = QuestionDetailsPresenter.toHTTP(
        questionResp.value.question,
      )

      return { question }
    }
  }
}
