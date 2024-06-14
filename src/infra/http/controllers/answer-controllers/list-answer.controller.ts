import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
  UsePipes,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

import { z } from 'zod'
import FetchQuestionAnswerUseCase from '@/domain/forum/application/use-cases/fetch-question-answers-use-case'
import { AnswerPresenter } from '../../presenters/answer-presenter'

const querySchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

type QuerySchema = z.infer<typeof querySchema>

const validationPipe = new ZodValidationPipe(querySchema)

@Controller('questions/:questionId/answers')
export class ListAnswersController {
  constructor(
    private readonly listAnswers: FetchQuestionAnswerUseCase,
    // private readonly jwt: JwtService,
  ) {}

  @Get()
  @UsePipes()
  async handle(
    @Query('page', validationPipe) page: QuerySchema,
    @Param('questionId') questionId: string,
  ) {
    console.log('questionId', questionId)
    const answerResp = await this.listAnswers.execute({ page, questionId })

    if (answerResp.isLeft()) {
      throw new BadRequestException()
    }

    if (answerResp.isRight()) {
      const answers = answerResp.value.answers.map(AnswerPresenter.toHTTP)

      return { answers }
    }
  }
}
