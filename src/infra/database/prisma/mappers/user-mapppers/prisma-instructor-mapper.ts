import UniqueEntityId from '@/core/entities/unique-entity-id'
import Instructor from '@/domain/forum/enterprise/entities/instructor'
import { User as PrismaInstructor } from '@prisma/client'

export class PrismaInstructorMapper {
  static toDomain(prismaInstructor: PrismaInstructor): Instructor {
    const { id, ...data } = prismaInstructor
    const instructor = Instructor.create(
      {
        email: data.email,
        name: data.name,
        password: data.password_hash,
      },
      new UniqueEntityId(id),
    )

    return instructor
  }

  static domainToPrisma(instructor: Instructor): PrismaInstructor {
    const prismaInstructor: PrismaInstructor = {
      id: instructor.id.value,
      email: instructor.email,
      name: instructor.name,
      password_hash: instructor.password,
      role: 'INSTRUCTOR',
    }
    return prismaInstructor
  }
}
