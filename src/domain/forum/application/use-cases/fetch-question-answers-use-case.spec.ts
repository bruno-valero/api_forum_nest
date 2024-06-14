import InMemoryQuestionRepository from '../repositories/in-memory-repositories/in-memory-questions-repository'
import MakeQuestion from '@/factories/tests/make-question'
import FetchQuestionAnswerUseCase from './fetch-question-answers-use-case'
import InMemoryAnswersRepository from '../repositories/in-memory-repositories/in-memory-answers-repository'
import MakeAnswer from '@/factories/tests/make-answer'
import InMemoryQuestionAttachmentAttachmentRepository from '../repositories/in-memory-repositories/in-memory-question-attachment-repository'
import InMemoryAnswerAttachmentAttachmentRepository from '../repositories/in-memory-repositories/in-memory-answer-attachment-repository'
import { InMemoryAttachmentsRepository } from '../repositories/in-memory-repositories/in-memory-attachments-repository'
import InMemoryStudentsRepository from '../repositories/in-memory-repositories/in-memory-students-repository'

let attachmentsRepository: InMemoryAttachmentsRepository
let studentsRepository: InMemoryStudentsRepository
let answerAttachmentsRepository: InMemoryAnswerAttachmentAttachmentRepository
let questionAttachmentsRepository: InMemoryQuestionAttachmentAttachmentRepository
let questionsRepository: InMemoryQuestionRepository
let answersRepository: InMemoryAnswersRepository
let sut: FetchQuestionAnswerUseCase

describe('fetch recent questions Use Case', async () => {
  beforeAll(() => {
    vi.useFakeTimers()
  })

  beforeEach(() => {
    attachmentsRepository = new InMemoryAttachmentsRepository()
    studentsRepository = new InMemoryStudentsRepository()
    answerAttachmentsRepository =
      new InMemoryAnswerAttachmentAttachmentRepository()
    questionAttachmentsRepository =
      new InMemoryQuestionAttachmentAttachmentRepository()
    questionsRepository = new InMemoryQuestionRepository(
      questionAttachmentsRepository,
      attachmentsRepository,
      studentsRepository,
    )
    answersRepository = new InMemoryAnswersRepository(
      answerAttachmentsRepository,
    )
    sut = new FetchQuestionAnswerUseCase(answersRepository)
  })

  afterAll(() => {
    vi.useRealTimers()
  })

  it('should be able to fetch recent questions', async () => {
    const questionId = '132'
    await questionsRepository.create(MakeQuestion({}, questionId))

    for (let i = 1; i <= 22; i++) {
      await answersRepository.create(MakeAnswer({ questionId }))
    }

    const result = await sut.execute({
      questionId,
      page: 2,
    })
    expect(result.isRight()).toEqual(true)
    if (result.isRight()) {
      expect(result.value.answers).toHaveLength(2)
    }
  })
})
