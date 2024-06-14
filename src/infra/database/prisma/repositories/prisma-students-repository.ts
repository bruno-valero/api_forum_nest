import { PaginationParams } from '@/core/respositories/pagination-params'
import StudentsRepository from '@/domain/forum/application/repositories/students-repository'
import Student from '@/domain/forum/enterprise/entities/student'
import { PrismaService } from '../prisma.service'
import { PrismaStudentMapper } from '../mappers/user-mapppers/prisma-student-mapper'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaStudentsRepository implements StudentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(student: Student): Promise<{ student: Student }> {
    const studentPrisma = await this.prisma.user.create({
      data: PrismaStudentMapper.domainToPrisma(student),
    })
    const mappedStudent = PrismaStudentMapper.toDomain(studentPrisma)

    return { student: mappedStudent }
  }

  async getByEmail(email: string): Promise<{ student: Student } | null> {
    const studentGetted = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!studentGetted) return null

    const mappedStudent = PrismaStudentMapper.toDomain(studentGetted)

    return { student: mappedStudent }
  }

  async delete(studentId: string): Promise<void> {
    await this.prisma.user.delete({
      where: {
        id: studentId,
      },
    })
  }

  async update(
    studentId: string,
    data: Student,
  ): Promise<{ student: Student }> {
    const studentUpdated = await this.prisma.user.update({
      where: {
        id: studentId,
      },
      data: PrismaStudentMapper.domainToPrisma(data),
    })

    const mappedStudent = PrismaStudentMapper.toDomain(studentUpdated)

    return { student: mappedStudent }
  }

  async findMany(params: PaginationParams): Promise<{ students: Student[] }> {
    const studentFetched = await this.prisma.user.findMany({
      orderBy: {
        name: 'asc',
      },
      take: 20,
      skip: (params.page - 1) * 20,
    })

    const mappedStudents = studentFetched.map(PrismaStudentMapper.toDomain)

    return { students: mappedStudents }
  }
}
