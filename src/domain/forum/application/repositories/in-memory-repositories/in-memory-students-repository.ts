import Student from '@/domain/forum/enterprise/entities/student'
import StudentsRepository from '../students-repository'
import { PaginationParams } from '@/core/respositories/pagination-params'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

export default class InMemoryStudentsRepository implements StudentsRepository {
  items: Student[] = []

  async create(student: Student): Promise<{ student: Student }> {
    this.items.push(student)

    return { student }
  }

  async getByEmail(email: string): Promise<{ student: Student } | null> {
    const student = this.items.filter((item) => item.email === email)[0] ?? null

    if (!student) return null
    return { student }
  }

  async delete(studentId: string): Promise<void> {
    this.items = this.items.filter((item) => item.id.value === studentId)
  }

  async update(
    studentId: string,
    data: Student,
  ): Promise<{ student: Student }> {
    const index = this.items.findIndex((item) => item.id.value === studentId)

    if (index < 0) throw new ResourceNotFoundError()
    this.items[index] = data

    return { student: this.items[index] }
  }

  async findMany({ page }: PaginationParams): Promise<{ students: Student[] }> {
    const students = this.items.splice(page - 1, page * 20)

    return { students }
  }
}
