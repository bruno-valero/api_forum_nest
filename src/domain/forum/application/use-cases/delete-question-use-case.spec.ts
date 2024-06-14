import InMemoryQuestionRepository from '../repositories/in-memory-repositories/in-memory-questions-repository'
import MakeQuestion from '@/factories/tests/make-question'
import DeleteQuestionUseCase from './delete-question-use-case'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import InMemoryQuestionAttachmentAttachmentRepository from '../repositories/in-memory-repositories/in-memory-question-attachment-repository'
import MakeQuestionAttachment from '@/factories/tests/make-question-attachment'
import { InMemoryAttachmentsRepository } from '../repositories/in-memory-repositories/in-memory-attachments-repository'
import InMemoryStudentsRepository from '../repositories/in-memory-repositories/in-memory-students-repository'

let attachmentsRepository: InMemoryAttachmentsRepository
let studentsRepository: InMemoryStudentsRepository

let questionAttachmentsRepository: InMemoryQuestionAttachmentAttachmentRepository
let questionsRepository: InMemoryQuestionRepository
let sut: DeleteQuestionUseCase

describe('delete question Use Case', async () => {
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
    sut = new DeleteQuestionUseCase(questionsRepository)
  })

  afterAll(() => {})

  it('should be able to delete a question', async () => {
    const { question } = await questionsRepository.create(
      MakeQuestion({ authorId: '123' }),
    )

    questionAttachmentsRepository.create(
      MakeQuestionAttachment({
        attachmentId: '1',
        questionId: question.id.value,
      }),
    )
    questionAttachmentsRepository.create(
      MakeQuestionAttachment({
        attachmentId: '2',
        questionId: question.id.value,
      }),
    )

    const result = await sut.execute({
      authorId: question.authorId.value,
      questionId: question.id.value!,
    })

    const deleted = await questionsRepository.getById(question.id.value)

    expect(result.isRight()).toEqual(true)
    expect(deleted).toEqual(null)
    expect(questionAttachmentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a question from a different author', async () => {
    const { question } = await questionsRepository.create(
      MakeQuestion({ authorId: '123' }),
    )

    const result = await sut.execute({
      authorId: 'other author',
      questionId: question.id.value!,
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(UnauthorizedError)
  })
})
