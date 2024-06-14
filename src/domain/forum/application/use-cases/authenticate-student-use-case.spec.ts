import { FakeHasher } from '../../cryptography/fake-cryptography.ts/fake-hasher'
import InMemoryStudentsRepository from '../repositories/in-memory-repositories/in-memory-students-repository'
import AuthenticateStudentUseCase from './authenticate-student-use-case'
import { FakeEncrypter } from '../../cryptography/fake-cryptography.ts/fake-encrypter'
import MakeStudent from '@/factories/tests/make-student'

let studentsRepository: InMemoryStudentsRepository
let hasher: FakeHasher
let encrypter: FakeEncrypter
let sut: AuthenticateStudentUseCase

describe('register student Use Case', async () => {
  beforeEach(() => {
    studentsRepository = new InMemoryStudentsRepository()
    hasher = new FakeHasher()
    encrypter = new FakeEncrypter()
    sut = new AuthenticateStudentUseCase(studentsRepository, hasher, encrypter)
  })

  afterAll(() => {})

  it('should be able to register a student', async () => {
    const password = '123'
    const passwordHash = await hasher.hash(password)
    const { student } = await studentsRepository.create(
      MakeStudent({ password: passwordHash }),
    )

    const result = await sut.execute({
      email: student.email,
      password,
    })

    const gettedStudent = await studentsRepository.getByEmail(student.email)

    console.log('gettedStudent', gettedStudent)
    expect(result.isRight()).toEqual(true)
    expect(gettedStudent).toBeTruthy()
    expect(gettedStudent?.student.email).toEqual(student.email)
    if (result.isRight()) {
      expect(result.value.token).toEqual(expect.any(String))
    }
  })
})
