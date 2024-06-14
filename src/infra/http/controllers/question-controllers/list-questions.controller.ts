import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UsePipes,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

import { z } from 'zod'
import FetchRecentQuestionsUseCase from '@/domain/forum/application/use-cases/fetch-recent-questions-use-case'
import { QuestionPresenter } from '../../presenters/question-presenter'

const querySchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

type QuerySchema = z.infer<typeof querySchema>

const validationPipe = new ZodValidationPipe(querySchema)

@Controller('/questions')
export class ListQuestionsController {
  constructor(
    private readonly listQuestions: FetchRecentQuestionsUseCase,
    // private readonly jwt: JwtService,
  ) {}

  @Get()
  @UsePipes()
  async handle(@Query('page', validationPipe) page: QuerySchema) {
    const questionResp = await this.listQuestions.execute({ page })

    if (questionResp.isLeft()) {
      throw new BadRequestException()
    }

    if (questionResp.isRight()) {
      const questions = questionResp.value.questions.map(
        QuestionPresenter.toHTTP,
      )

      return { questions }
    }
  }
}
