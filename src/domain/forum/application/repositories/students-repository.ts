import { PaginationParams } from '@/core/respositories/pagination-params'
import Student from '../../enterprise/entities/student'

export default abstract class StudentsRepository {
  abstract create(student: Student): Promise<{ student: Student }>
  abstract getByEmail(email: string): Promise<{ student: Student } | null>
  abstract delete(studentId: string): Promise<void>
  abstract update(
    studentId: string,
    data: Student,
  ): Promise<{ student: Student }>

  abstract findMany(params: PaginationParams): Promise<{ students: Student[] }>
}
