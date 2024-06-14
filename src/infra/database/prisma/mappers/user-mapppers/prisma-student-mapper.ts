import UniqueEntityId from '@/core/entities/unique-entity-id'
import Student from '@/domain/forum/enterprise/entities/student'
import { User as PrismaStudent } from '@prisma/client'

export class PrismaStudentMapper {
  static toDomain(prismaStudent: PrismaStudent): Student {
    const { id, ...data } = prismaStudent
    const student = Student.create(
      {
        email: data.email,
        name: data.name,
        password: data.password_hash,
      },
      new UniqueEntityId(id),
    )

    return student
  }

  static domainToPrisma(student: Student): PrismaStudent {
    const prismaStudent: PrismaStudent = {
      id: student.id.value,
      email: student.email,
      name: student.name,
      password_hash: student.password,
      role: 'STUDENT',
    }
    return prismaStudent
  }
}
