import UniqueEntityId from '@/core/entities/unique-entity-id'
import { afterAll, describe, expect, it } from 'vitest'
import Answer from '../../enterprise/entities/answer'
import InMemoryAnswersRepository from '../repositories/in-memory-repositories/in-memory-answers-repository'
import AnswerQuestion from './answer-questions'
import InMemoryAnswerAttachmentAttachmentRepository from '../repositories/in-memory-repositories/in-memory-answer-attachment-repository'

let answerAttachmentsRepository: InMemoryAnswerAttachmentAttachmentRepository
let repository: InMemoryAnswersRepository
let sut: AnswerQuestion

describe('Answer Question Use Case', () => {
  beforeEach(() => {
    answerAttachmentsRepository =
      new InMemoryAnswerAttachmentAttachmentRepository()
    repository = new InMemoryAnswersRepository(answerAttachmentsRepository)
    sut = new AnswerQuestion(repository)
  })

  afterAll(() => {})

  it('should create an answer', async () => {
    const result = await sut.execute({
      authorId: '1',
      questionId: '1',
      content: 'teste',
      attachmentsIds: ['1', '2'],
    })

    expect(result.isRight()).toEqual(true)
    if (result.isRight()) {
      expect(result.value.answer).toBeInstanceOf(Answer)
      expect(result.value.answer).toEqual(
        expect.objectContaining({
          content: 'teste',
          authorId: expect.any(UniqueEntityId),
          questionId: expect.any(UniqueEntityId),
          id: expect.any(UniqueEntityId),
          createdAt: expect.any(Date),
        }),
      )
      expect(result.value.answer.attachments.currentItems).toHaveLength(2)
      expect(result.value.answer.attachments.currentItems[0]).toEqual(
        expect.objectContaining({
          attachmentId: new UniqueEntityId('1'),
        }),
      )
    }
  })

  it('should persist attachments when creating a new answer', async () => {
    const result = await sut.execute({
      questionId: '1',
      authorId: '1',
      content: 'Conteúdo da resposta',
      attachmentsIds: ['1', '2'],
    })

    expect(result.isRight()).toBe(true)
    expect(answerAttachmentsRepository.items).toHaveLength(2)
    expect(answerAttachmentsRepository.items).toEqual(
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
