import UniqueEntityId from '@/core/entities/unique-entity-id'
import InMemoryQuestionRepository from '../repositories/in-memory-repositories/in-memory-questions-repository'
import CommentOnQuestionUseCase from './comment-on-question'
import InMemoryQuestionCommentsRepository from '../repositories/in-memory-repositories/in-memory-question-comments-repository'
import MakeQuestion from '@/factories/tests/make-question'
import QuestionComment from '../../enterprise/entities/question-comments'
import InMemoryQuestionAttachmentAttachmentRepository from '../repositories/in-memory-repositories/in-memory-question-attachment-repository'
import { InMemoryAttachmentsRepository } from '../repositories/in-memory-repositories/in-memory-attachments-repository'
import InMemoryStudentsRepository from '../repositories/in-memory-repositories/in-memory-students-repository'

let attachmentsRepository: InMemoryAttachmentsRepository
let studentsRepository: InMemoryStudentsRepository

let questionAttachmentsRepository: InMemoryQuestionAttachmentAttachmentRepository
let questionsRepository: InMemoryQuestionRepository
let questionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: CommentOnQuestionUseCase

beforeAll(() => {
  attachmentsRepository = new InMemoryAttachmentsRepository()
  studentsRepository = new InMemoryStudentsRepository()

  questionAttachmentsRepository =
    new InMemoryQuestionAttachmentAttachmentRepository()
  questionsRepository = new InMemoryQuestionRepository(
    questionAttachmentsRepository,
    attachmentsRepository,
    studentsRepository,
  )
  questionCommentsRepository = new InMemoryQuestionCommentsRepository(
    studentsRepository,
  )
  sut = new CommentOnQuestionUseCase(
    questionsRepository,
    questionCommentsRepository,
  )
})

afterAll(() => {})

describe('comment on question Use Case', async () => {
  it('should be able to comment on a question', async () => {
    const { question } = await questionsRepository.create(MakeQuestion())

    const result = await sut.execute({
      authorId: '13246',
      content: 'teste',
      questionId: question.id.value,
    })

    expect(result.isRight()).toEqual(true)
    if (result.isRight()) {
      expect(result.value.questionComment).toBeInstanceOf(QuestionComment)
      expect(result.value.questionComment.authorId).toEqual(
        new UniqueEntityId('13246'),
      )
    }
  })
})
