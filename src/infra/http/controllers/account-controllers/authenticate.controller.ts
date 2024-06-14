import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

import { z } from 'zod'
import AuthenticateStudentUseCase from '@/domain/forum/application/use-cases/authenticate-student-use-case'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Public } from '@/infra/auth/public'

const bodySchema = z.object({
  email: z.string(),
  password: z.string(),
})

type BodySchema = z.infer<typeof bodySchema>

@Controller('/sessions')
export class AuthenticateController {
  constructor(
    private readonly authenticateStudent: AuthenticateStudentUseCase,
  ) {}

  @Public()
  @Post()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe<BodySchema>(bodySchema))
  async handle(@Body() { email, password }: BodySchema) {
    const authResp = await this.authenticateStudent.execute({ email, password })

    if (authResp.isLeft()) {
      const error = authResp.value
      const constructor = error.constructor
      if (constructor === UnauthorizedError)
        throw new UnauthorizedException(error.message)
      if (constructor === ResourceNotFoundError)
        throw new NotFoundException(error.message)

      throw new BadRequestException(error.message)
    }

    if (authResp.isRight()) {
      const { token } = authResp.value
      return { access_token: token }
    }
  }
}
