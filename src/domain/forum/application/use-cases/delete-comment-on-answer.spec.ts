import InMemoryAnswersRepository from '../repositories/in-memory-repositories/in-memory-answers-repository'
import InMemoryAnswerCommentsRepository from '../repositories/in-memory-repositories/in-memory-answer-comments-repository'
import MakeAnswer from '@/factories/tests/make-answer'
import DeleteCommentOnAnswerUseCase from './delete-comment-on-answer'
import MakeAnswerComment from '@/factories/tests/make-answer-comment'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import InMemoryAnswerAttachmentAttachmentRepository from '../repositories/in-memory-repositories/in-memory-answer-attachment-repository'
import InMemoryStudentsRepository from '../repositories/in-memory-repositories/in-memory-students-repository'

let studentsRepository: InMemoryStudentsRepository
let answerAttachmentsRepository: InMemoryAnswerAttachmentAttachmentRepository
let answersRepository: InMemoryAnswersRepository
let answerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: DeleteCommentOnAnswerUseCase

beforeAll(() => {
  studentsRepository = new InMemoryStudentsRepository()
  answerAttachmentsRepository =
    new InMemoryAnswerAttachmentAttachmentRepository()
  answersRepository = new InMemoryAnswersRepository(answerAttachmentsRepository)
  answerCommentsRepository = new InMemoryAnswerCommentsRepository(
    studentsRepository,
  )
  sut = new DeleteCommentOnAnswerUseCase(
    answersRepository,
    answerCommentsRepository,
  )
})

afterAll(() => {})

describe('comment on question Use Case', async () => {
  it('should be able to comment on a question', async () => {
    const { answer } = await answersRepository.create(MakeAnswer())

    const { answerComment } = await answerCommentsRepository.create(
      MakeAnswerComment({ authorId: '123', answerId: answer.id.value }),
    )

    const result = await sut.execute({
      authorId: '123',
      answerId: answer.id.value,
      answerCommentId: answerComment.id.value,
    })

    const answerAfterDel = await answerCommentsRepository.getById(
      answer.id.value,
    )
    expect(result.isRight()).toEqual(true)
    expect(answerAfterDel).toEqual(null)
  })

  it('should not be able to comment on a question from another author', async () => {
    const { answer } = await answersRepository.create(MakeAnswer())

    const { answerComment } = await answerCommentsRepository.create(
      MakeAnswerComment({ authorId: '123', answerId: answer.id.value }),
    )

    const result = await sut.execute({
      authorId: 'other author',
      answerId: answer.id.value,
      answerCommentId: answerComment.id.value,
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(UnauthorizedError)
  })
})
