import InMemoryQuestionRepository from '../repositories/in-memory-repositories/in-memory-questions-repository'
import MakeQuestion from '@/factories/tests/make-question'
import FetchRecentQuestionsUseCase from './fetch-recent-questions-use-case'
import InMemoryQuestionAttachmentAttachmentRepository from '../repositories/in-memory-repositories/in-memory-question-attachment-repository'
import { InMemoryAttachmentsRepository } from '../repositories/in-memory-repositories/in-memory-attachments-repository'
import InMemoryStudentsRepository from '../repositories/in-memory-repositories/in-memory-students-repository'

let attachmentsRepository: InMemoryAttachmentsRepository
let studentsRepository: InMemoryStudentsRepository

let questionAttachmentsRepository: InMemoryQuestionAttachmentAttachmentRepository
let questionsRepository: InMemoryQuestionRepository
let sut: FetchRecentQuestionsUseCase

describe('fetch recent questions Use Case', async () => {
  beforeAll(() => {
    vi.useFakeTimers()
  })

  beforeEach(() => {
    attachmentsRepository = new InMemoryAttachmentsRepository()
    studentsRepository = new InMemoryStudentsRepository()

    questionAttachmentsRepository =
      new InMemoryQuestionAttachmentAttachmentRepository()
    questionsRepository = new InMemoryQuestionRepository(
      questionAttachmentsRepository,
      attachmentsRepository,
      studentsRepository,
    )
    sut = new FetchRecentQuestionsUseCase(questionsRepository)
  })

  afterAll(() => {
    vi.useRealTimers()
  })

  it('should be able to fetch recent questions', async () => {
    for (let i = 1; i <= 22; i++) {
      await questionsRepository.create(
        MakeQuestion({ createdAt: new Date(2024, 0, 0, i) }),
      )
    }

    const result = await sut.execute({
      page: 2,
    })

    expect(result.isRight()).toEqual(true)
    if (result.isRight()) {
      expect(result.value.questions).toHaveLength(2)
      expect(result.value.questions).toEqual([
        expect.objectContaining({
          createdAt: new Date(2024, 0, 0, 2),
        }),
        expect.objectContaining({
          createdAt: new Date(2024, 0, 0, 1),
        }),
      ])
    }
  })
})
