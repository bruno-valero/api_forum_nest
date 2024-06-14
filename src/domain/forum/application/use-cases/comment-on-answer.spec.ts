import UniqueEntityId from '@/core/entities/unique-entity-id'
import CommentOnAnswerUseCase from './comment-on-answer'
import InMemoryAnswersRepository from '../repositories/in-memory-repositories/in-memory-answers-repository'
import InMemoryAnswerCommentsRepository from '../repositories/in-memory-repositories/in-memory-answer-comments-repository'
import MakeAnswer from '@/factories/tests/make-answer'
import AnswerComment from '../../enterprise/entities/answer-comments'
import InMemoryAnswerAttachmentAttachmentRepository from '../repositories/in-memory-repositories/in-memory-answer-attachment-repository'
import InMemoryStudentsRepository from '../repositories/in-memory-repositories/in-memory-students-repository'

let studentsRepository: InMemoryStudentsRepository
let answerAttachmentsRepository: InMemoryAnswerAttachmentAttachmentRepository
let answersRepository: InMemoryAnswersRepository
let answerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: CommentOnAnswerUseCase

beforeAll(() => {
  studentsRepository = new InMemoryStudentsRepository()
  answerAttachmentsRepository =
    new InMemoryAnswerAttachmentAttachmentRepository()
  answersRepository = new InMemoryAnswersRepository(answerAttachmentsRepository)
  answerCommentsRepository = new InMemoryAnswerCommentsRepository(
    studentsRepository,
  )
  sut = new CommentOnAnswerUseCase(answersRepository, answerCommentsRepository)
})

afterAll(() => {})

describe('comment on question Use Case', async () => {
  it('should be able to comment on a question', async () => {
    const { answer } = await answersRepository.create(MakeAnswer())

    const result = await sut.execute({
      authorId: '13246',
      content: 'teste',
      answerId: answer.id.value,
    })

    expect(result.isRight()).toEqual(true)
    if (result.isRight()) {
      expect(result.value.answerComment).toBeInstanceOf(AnswerComment)
      expect(result.value.answerComment.authorId).toEqual(
        new UniqueEntityId('13246'),
      )
    }
  })
})
