import RegisterStudentUseCase from './register-student-use-case'
import { FakeHasher } from '../../cryptography/fake-cryptography.ts/fake-hasher'
import InMemoryStudentsRepository from '../repositories/in-memory-repositories/in-memory-students-repository'

let studentsRepository: InMemoryStudentsRepository
let hashGenerator: FakeHasher
let sut: RegisterStudentUseCase

describe('register student Use Case', async () => {
  beforeEach(() => {
    studentsRepository = new InMemoryStudentsRepository()
    hashGenerator = new FakeHasher()
    sut = new RegisterStudentUseCase(studentsRepository, hashGenerator)
  })

  afterAll(() => {})

  it('should be able to register a student', async () => {
    const result = await sut.execute({
      email: 'oi@iopp.com',
      name: 'oioi',
      password: '123',
    })

    expect(result.isRight()).toEqual(true)
    if (result.isRight()) {
      expect(result.value.student.password).toEqual('123-hashed')
    }
  })
})
