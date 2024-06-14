import UniqueEntityId from '@/core/entities/unique-entity-id'
import Student, {
  StudentCreateProps,
} from '@/domain/forum/enterprise/entities/student'
import { PrismaStudentMapper } from '@/infra/database/prisma/mappers/user-mapppers/prisma-student-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export default function MakeStudent(
  override: Partial<StudentCreateProps> = {},
  id?: string,
) {
  const student = Student.create(
    {
      password: faker.internet.password(),
      email: faker.internet.email(),
      name: faker.lorem.sentence(3),
      ...override,
    },
    id ? new UniqueEntityId(id) : undefined,
  )

  return student
}

@Injectable()
export class StudentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaStudent(
    override: Partial<StudentCreateProps> = {},
    id?: string,
  ): Promise<Student> {
    const student = MakeStudent(override, id)

    await this.prisma.user.create({
      data: PrismaStudentMapper.domainToPrisma(student),
    })

    return student
  }
}
