import InMemoryAnswerRepository from '../repositories/in-memory-repositories/in-memory-answers-repository'
import MakeAnswer from '@/factories/tests/make-answer'
import EditAnswerUseCase from './edit-answer-use-case'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import InMemoryAnswerAttachmentAttachmentRepository from '../repositories/in-memory-repositories/in-memory-answer-attachment-repository'
import UniqueEntityId from '@/core/entities/unique-entity-id'
import MakeAnswerAttachment from '@/factories/tests/make-answer-attachment'

let answerAttachmentsRepository: InMemoryAnswerAttachmentAttachmentRepository
let answersRepository: InMemoryAnswerRepository
let sut: EditAnswerUseCase

describe('edit answer Use Case', async () => {
  beforeEach(() => {
    answerAttachmentsRepository =
      new InMemoryAnswerAttachmentAttachmentRepository()
    answersRepository = new InMemoryAnswerRepository(
      answerAttachmentsRepository,
    )
    sut = new EditAnswerUseCase(answersRepository, answerAttachmentsRepository)
  })

  afterAll(() => {})

  it('should be able to edit a answer', async () => {
    const { answer } = await answersRepository.create(
      MakeAnswer({ authorId: '123' }),
    )

    answerAttachmentsRepository.create(
      MakeAnswerAttachment({
        attachmentId: '1',
        answerId: answer.id.value,
      }),
    )
    answerAttachmentsRepository.create(
      MakeAnswerAttachment({
        attachmentId: '2',
        answerId: answer.id.value,
      }),
    )

    const result = await sut.execute({
      authorId: answer.authorId.value,
      answerId: answer.id.value!,
      data: {
        content: 'novo content',
      },
      attachmentsIds: ['1', '3'],
    })

    const edit = await answersRepository.getById(answer.id.value)

    expect(result.isRight()).toEqual(true)
    expect(edit?.answer.content).toEqual('novo content')
    expect(edit?.answer.updatedAt).toEqual(expect.any(Date))
    expect(edit?.answer.attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityId('3') }),
    ])
  })

  it('should not be able to edit a answer from a different author', async () => {
    const { answer } = await answersRepository.create(
      MakeAnswer({ authorId: '123' }),
    )

    const result = await sut.execute({
      authorId: 'other author',
      answerId: answer.id.value!,
      data: {
        content: 'novo content',
      },
      attachmentsIds: [],
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(UnauthorizedError)
  })

  it('should sync new and removed attachment when editing an answer', async () => {
    const newAnswer = MakeAnswer(
      {
        authorId: 'author-1',
      },
      'question-1',
    )

    await answersRepository.create(newAnswer)

    answerAttachmentsRepository.items.push(
      MakeAnswerAttachment({
        answerId: newAnswer.id.value,
        attachmentId: '1',
      }),
      MakeAnswerAttachment({
        answerId: newAnswer.id.value,
        attachmentId: '2',
      }),
    )

    const result = await sut.execute({
      answerId: newAnswer.id.value,
      authorId: 'author-1',
      data: { content: 'Conteúdo teste' },
      attachmentsIds: ['1', '3'],
    })

    expect(result.isRight()).toBe(true)
    expect(answerAttachmentsRepository.items).toHaveLength(2)
    expect(answerAttachmentsRepository.items).toEqual(
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
