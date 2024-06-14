import { BadRequestException, PipeTransform } from '@nestjs/common'
import { ZodError, ZodSchema } from 'zod'

export class ZodValidationPipe<T> implements PipeTransform {
  constructor(private schema: ZodSchema<T>) {}

  transform(value: unknown) {
    try {
      const data = this.schema.parse(value)
      return data
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          error: error.format(),
          message: 'Validation failed',
          statusCode: 400,
        })
      }
      throw new BadRequestException('Validation failed')
    }
  }
}
