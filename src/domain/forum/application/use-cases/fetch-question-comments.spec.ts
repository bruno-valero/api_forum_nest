import FetchQuestionCommentsUseCase from './fetch-question-comments'
import InMemoryQuestionCommentsRepository from '../repositories/in-memory-repositories/in-memory-question-comments-repository'
import MakeQuestionComment from '@/factories/tests/make-question-comment'
import InMemoryStudentsRepository from '../repositories/in-memory-repositories/in-memory-students-repository'
import MakeStudent from '@/factories/tests/make-student'

let studentsRepository: InMemoryStudentsRepository
let questionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: FetchQuestionCommentsUseCase

describe('fetch recent questions comments Use Case', async () => {
  beforeAll(() => console.log('bfall'))

  beforeEach(() => {
    studentsRepository = new InMemoryStudentsRepository()
    questionCommentsRepository = new InMemoryQuestionCommentsRepository(
      studentsRepository,
    )
    sut = new FetchQuestionCommentsUseCase(questionCommentsRepository)
  })

  it('should be able to fetch recent question comments', async () => {
    const student = MakeStudent({ name: 'John Doe' })

    studentsRepository.items.push(student)

    const comment1 = MakeQuestionComment({
      questionId: 'question-1',
      authorId: student.id.value,
    })

    const comment2 = MakeQuestionComment({
      questionId: 'question-1',
      authorId: student.id.value,
    })

    const comment3 = MakeQuestionComment({
      questionId: 'question-1',
      authorId: student.id.value,
    })

    await questionCommentsRepository.create(comment1)
    await questionCommentsRepository.create(comment2)
    await questionCommentsRepository.create(comment3)

    const result = await sut.execute({
      questionId: 'question-1',
      page: 1,
    })

    expect(result.isRight()).toEqual(true)
    if (result.isRight()) {
      expect(result.value?.questionComments).toHaveLength(3)
      expect(result.value?.questionComments).toEqual(
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
