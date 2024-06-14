import UniqueEntityId from '@/core/entities/unique-entity-id'
import Question from '../../enterprise/entities/question'
import InMemoryQuestionRepository from '../repositories/in-memory-repositories/in-memory-questions-repository'
import CreateQuestionUseCase from './create-question-use-case'
import InMemoryQuestionAttachmentAttachmentRepository from '../repositories/in-memory-repositories/in-memory-question-attachment-repository'
import { InMemoryAttachmentsRepository } from '../repositories/in-memory-repositories/in-memory-attachments-repository'
import InMemoryStudentsRepository from '../repositories/in-memory-repositories/in-memory-students-repository'

let attachmentsRepository: InMemoryAttachmentsRepository
let studentsRepository: InMemoryStudentsRepository

let questionAttachmentsRepository: InMemoryQuestionAttachmentAttachmentRepository
let questionsRepository: InMemoryQuestionRepository
let sut: CreateQuestionUseCase

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
  sut = new CreateQuestionUseCase(questionsRepository)
})

afterAll(() => {})

describe('Create Question Use Case', async () => {
  it('should be able to create a question', async () => {
    const result = await sut.execute({
      authorId: '13246',
      content: 'teste',
      title: 'title teste',
      attachmentsIds: ['1', '2'],
    })

    expect(result.isRight()).toEqual(true)
    if (result.isRight()) {
      expect(result.value.question).toBeInstanceOf(Question)
      expect(result.value.question.authorId).toEqual(
        new UniqueEntityId('13246'),
      )
      expect(result.value.question.attachments.currentItems).toHaveLength(2)
      expect(result.value.question.attachments.currentItems[0]).toEqual(
        expect.objectContaining({
          attachmentId: new UniqueEntityId('1'),
        }),
      )
    }
  })

  it('should persist attachments when creating a new question', async () => {
    const result = await sut.execute({
      authorId: '1',
      title: 'Nova pergunta',
      content: 'Conteúdo da pergunta',
      attachmentsIds: ['1', '2'],
    })

    expect(result.isRight()).toBe(true)
    expect(questionAttachmentsRepository.items).toHaveLength(2)
    expect(questionAttachmentsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attachmentId: new UniqueEntityId('1'),
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityId('1'),
        }),
      ]),
    )
  })
})
