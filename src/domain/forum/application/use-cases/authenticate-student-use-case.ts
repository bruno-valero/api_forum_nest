import { Either, left, right } from '@/core/either'
import StudentsRepository from '../repositories/students-repository'
import { HashComparer } from '../../cryptography/hash-comparer'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Encrypter } from '../../cryptography/encrypter'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { Injectable } from '@nestjs/common'

export interface AuthenticateStudentUseCaseRequest {
  email: string
  password: string
}

export type AuthenticateStudentUseCaseResponse = Either<
  ResourceNotFoundError | UnauthorizedError,
  {
    token: string
  }
>

@Injectable()
export default class AuthenticateStudentUseCase {
  constructor(
    protected studentsRepository: StudentsRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateStudentUseCaseRequest): Promise<AuthenticateStudentUseCaseResponse> {
    const resp = await this.studentsRepository.getByEmail(email)
    if (!resp) return left(new ResourceNotFoundError())

    const { student } = resp

    const isValidPassword = await this.hashComparer.compare(
      password,
      student.password,
    )
    if (!isValidPassword) return left(new UnauthorizedError())

    const token = await this.encrypter.encrypt({ sub: student.id.value })
    return right({ token })
  }
}
