import FetchAnswersUseCase from './fetch-answer-comments'
import InMemoryAnswerCommentsRepository from '../repositories/in-memory-repositories/in-memory-answer-comments-repository'
import MakeAnswerComment from '../../../../factories/tests/make-answer-comment'
import InMemoryStudentsRepository from '../repositories/in-memory-repositories/in-memory-students-repository'
import MakeStudent from '@/factories/tests/make-student'

let studentsRepository: InMemoryStudentsRepository
let answerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: FetchAnswersUseCase

describe('fetch recent answers comments Use Case', async () => {
  beforeAll(() => {
    vi.useFakeTimers()
  })

  beforeEach(() => {
    studentsRepository = new InMemoryStudentsRepository()
    answerCommentsRepository = new InMemoryAnswerCommentsRepository(
      studentsRepository,
    )
    sut = new FetchAnswersUseCase(answerCommentsRepository)
  })

  afterAll(() => {
    vi.useRealTimers()
  })

  it('should be able to fetch recent answer comments', async () => {
    const student = MakeStudent({ name: 'John Doe' })
    studentsRepository.items.push(student)

    const comment1 = MakeAnswerComment({
      answerId: 'answer-1',
      authorId: student.id.value,
    })

    const comment2 = MakeAnswerComment({
      answerId: 'answer-1',
      authorId: student.id.value,
    })

    const comment3 = MakeAnswerComment({
      answerId: 'answer-1',
      authorId: student.id.value,
    })

    await answerCommentsRepository.create(comment1)
    await answerCommentsRepository.create(comment2)
    await answerCommentsRepository.create(comment3)

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 1,
    })

    expect(result.isRight()).toEqual(true)
    if (result.isRight()) {
      expect(result.value.answerComments).toHaveLength(3)
      expect(result.value.answerComments).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            author: 'John Doe',
            commentId: comment1.id.value,
          }),
          expect.objectContaining({
            author: 'John Doe',
            commentId: comment2.id.value,
          }),
          expect.objectContaining({
            author: 'John Doe',
            commentId: comment3.id.value,
          }),
        ]),
      )
    }
  })
})
