import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

import { z } from 'zod'
import RegisterStudentUseCase from '@/domain/forum/application/use-cases/register-student-use-case'
import { PrismaStudentMapper } from '@/infra/database/prisma/mappers/user-mapppers/prisma-student-mapper'
import { StudentAlreadyExistsError } from '@/core/errors/errors/student-already-exists-error'
import { Public } from '@/infra/auth/public'

const bodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})

type BodySchema = z.infer<typeof bodySchema>

@Controller('/accounts')
export class CreateAccountController {
  constructor(private readonly registerStudent: RegisterStudentUseCase) {}

  @Public()
  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe<BodySchema>(bodySchema))
  async handle(
    @Body()
    { name, email, password },
  ) {
    const studentResp = await this.registerStudent.execute({
      name,
      email,
      password,
    })

    if (studentResp.isLeft()) {
      const error = studentResp.value
      const constructor = error.constructor
      if (constructor === StudentAlreadyExistsError)
        throw new ConflictException(error.message)

      throw new BadRequestException(error.message)
    }

    if (studentResp.isRight()) {
      const { student } = studentResp.value

      return { student: PrismaStudentMapper.domainToPrisma(student) }
    }
  }
}
