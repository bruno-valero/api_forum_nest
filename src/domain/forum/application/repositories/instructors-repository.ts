import { PaginationParams } from '@/core/respositories/pagination-params'
import Instructor from '../../enterprise/entities/instructor'

export default abstract class InstructorsRepository {
  abstract create(instructor: Instructor): Promise<{ instructor: Instructor }>
  abstract getByEmail(email: string): Promise<{ instructor: Instructor } | null>
  abstract delete(instructorId: string, authorId: string): Promise<void>
  abstract update(
    instructorId: string,
    data: Instructor,
  ): Promise<{ instructor: Instructor }>

  abstract findMany(
    params: PaginationParams,
  ): Promise<{ instructors: Instructor[] }>
}
