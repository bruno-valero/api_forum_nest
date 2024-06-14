import InMemoryQuestionRepository from '../repositories/in-memory-repositories/in-memory-questions-repository'
import MakeQuestion from '@/factories/tests/make-question'
import EditQuestionUseCase from './edit-question-use-case'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import InMemoryQuestionAttachmentAttachmentRepository from '../repositories/in-memory-repositories/in-memory-question-attachment-repository'
import MakeQuestionAttachment from '@/factories/tests/make-question-attachment'
import UniqueEntityId from '@/core/entities/unique-entity-id'
import { InMemoryAttachmentsRepository } from '../repositories/in-memory-repositories/in-memory-attachments-repository'
import InMemoryStudentsRepository from '../repositories/in-memory-repositories/in-memory-students-repository'

let attachmentsRepository: InMemoryAttachmentsRepository
let studentsRepository: InMemoryStudentsRepository

let questionAttachmentsRepository: InMemoryQuestionAttachmentAttachmentRepository
let questionsRepository: InMemoryQuestionRepository
let sut: EditQuestionUseCase

describe('edit question Use Case', async () => {
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
    sut = new EditQuestionUseCase(
      questionsRepository,
      questionAttachmentsRepository,
    )
  })

  afterAll(() => {})

  it('should be able to edit a question', async () => {
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
      data: {
        title: 'novo title',
        content: 'novo content',
      },
      attachmentsIds: ['1', '3'],
    })

    const edit = await questionsRepository.getById(question.id.value)

    expect(result.isRight()).toEqual(true)
    expect(edit?.question.title).toEqual('novo title')
    expect(edit?.question.content).toEqual('novo content')
    expect(edit?.question.updatedAt).toEqual(expect.any(Date))
    expect(edit?.question.attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityId('3') }),
    ])
  })

  it('should not be able to edit a question from a different author', async () => {
    questionAttachmentsRepository.create(
      MakeQuestionAttachment({ attachmentId: '1' }),
    )
    questionAttachmentsRepository.create(
      MakeQuestionAttachment({ attachmentId: '2' }),
    )

    const { question } = await questionsRepository.create(
      MakeQuestion({ authorId: '123' }),
    )

    const result = await sut.execute({
      authorId: 'other author',
      questionId: question.id.value!,
      data: {
        title: 'novo title',
        content: 'novo content',
      },
      attachmentsIds: ['1', '3'],
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(UnauthorizedError)
  })

  it('should sync new and removed attachment when editing a question', async () => {
    const newQuestion = MakeQuestion(
      {
        authorId: 'author-1',
      },
      'question-1',
    )

    await questionsRepository.create(newQuestion)

    questionAttachmentsRepository.items.push(
      MakeQuestionAttachment({
        questionId: newQuestion.id.value,
        attachmentId: '1',
      }),
      MakeQuestionAttachment({
        questionId: newQuestion.id.value,
        attachmentId: '2',
      }),
    )

    const result = await sut.execute({
      questionId: newQuestion.id.value,
      authorId: 'author-1',
      data: { title: 'Pergunta teste', content: 'Conteúdo teste' },
      attachmentsIds: ['1', '3'],
    })

    expect(result.isRight()).toBe(true)
    expect(questionAttachmentsRepository.items).toHaveLength(2)
    expect(questionAttachmentsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attachmentId: new UniqueEntityId('1'),
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityId('3'),
        }),
      ]),
    )
  })
})
