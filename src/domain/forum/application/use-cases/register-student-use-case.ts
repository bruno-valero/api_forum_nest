import { Either, left, right } from '@/core/either'
import Student from '../../enterprise/entities/student'
import StudentsRepository from '../repositories/students-repository'
import { HashGenerator } from '../../cryptography/hash-generator'
import { Injectable } from '@nestjs/common'
import { StudentAlreadyExistsError } from '@/core/errors/errors/student-already-exists-error'

export interface RegisterStudentUseCaseRequest {
  name: string
  email: string
  password: string
}

export type RegisterStudentUseCaseResponse = Either<
  StudentAlreadyExistsError,
  {
    student: Student
  }
>

@Injectable()
export default class RegisterStudentUseCase {
  constructor(
    protected studentsRepository: StudentsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    password,
  }: RegisterStudentUseCaseRequest): Promise<RegisterStudentUseCaseResponse> {
    const existingStudent = await this.studentsRepository.getByEmail(email)

    if (existingStudent) {
      return left(new StudentAlreadyExistsError(email))
    }

    const newStudent = Student.create({
      name,
      email,
      password,
    })

    newStudent.password = await this.hashGenerator.hash(newStudent.password)
    const resp = await this.studentsRepository.create(newStudent)

    const { student } = resp

    return right({ student })
  }
}
