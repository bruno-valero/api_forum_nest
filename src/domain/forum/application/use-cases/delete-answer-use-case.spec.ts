import InMemoryAnswerRepository from '../repositories/in-memory-repositories/in-memory-answers-repository'
import MakeAnswer from '@/factories/tests/make-answer'
import DeleteAnswerUseCase from './delete-answer-use-case'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import InMemoryAnswerAttachmentAttachmentRepository from '../repositories/in-memory-repositories/in-memory-answer-attachment-repository'
import MakeAnswerAttachment from '@/factories/tests/make-answer-attachment'

let answerAttachmentsRepository: InMemoryAnswerAttachmentAttachmentRepository
let answersRepository: InMemoryAnswerRepository
let sut: DeleteAnswerUseCase

describe('delete answer Use Case', async () => {
  beforeEach(() => {
    answerAttachmentsRepository =
      new InMemoryAnswerAttachmentAttachmentRepository()
    answersRepository = new InMemoryAnswerRepository(
      answerAttachmentsRepository,
    )
    sut = new DeleteAnswerUseCase(answersRepository)
  })

  afterAll(() => {})

  it('should be able to delete a answer', async () => {
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
    })

    const deleted = await answersRepository.getById(answer.id.value)

    expect(result.isRight()).toEqual(true)
    expect(deleted).toEqual(null)
    expect(answerAttachmentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a answer from a different author', async () => {
    const { answer } = await answersRepository.create(
      MakeAnswer({ authorId: '123' }),
    )

    const result = await sut.execute({
      authorId: 'other author',
      answerId: answer.id.value!,
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(UnauthorizedError)
  })
})
