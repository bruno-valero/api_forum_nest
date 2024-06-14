import DeleteCommentOnQuestionUseCase from './delete-comment-on-question'
import InMemoryQuestionRepository from '../repositories/in-memory-repositories/in-memory-questions-repository'
import InMemoryQuestionCommentsRepository from '../repositories/in-memory-repositories/in-memory-question-comments-repository'
import MakeQuestion from '@/factories/tests/make-question'
import MakeQuestionComment from '@/factories/tests/make-question-comment'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import InMemoryQuestionAttachmentAttachmentRepository from '../repositories/in-memory-repositories/in-memory-question-attachment-repository'
import InMemoryStudentsRepository from '../repositories/in-memory-repositories/in-memory-students-repository'
import { InMemoryAttachmentsRepository } from '../repositories/in-memory-repositories/in-memory-attachments-repository'

let attachmentsRepository: InMemoryAttachmentsRepository
let studentsRepository: InMemoryStudentsRepository
let questionAttachmentsRepository: InMemoryQuestionAttachmentAttachmentRepository
let questionsRepository: InMemoryQuestionRepository
let questionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: DeleteCommentOnQuestionUseCase

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
  sut = new DeleteCommentOnQuestionUseCase(
    questionsRepository,
    questionCommentsRepository,
  )
})

afterAll(() => {})

describe('comment on question Use Case', async () => {
  it('should be able to comment on a question', async () => {
    const { question } = await questionsRepository.create(MakeQuestion())

    const { questionComment } = await questionCommentsRepository.create(
      MakeQuestionComment({ authorId: '123', questionId: question.id.value }),
    )

    const resp = await sut.execute({
      authorId: '123',
      questionId: question.id.value,
      questionCommentId: questionComment.id.value,
    })

    const answerAfterDel = await questionCommentsRepository.getById(
      question.id.value,
    )

    expect(resp.isRight()).toEqual(true)
    expect(answerAfterDel).toEqual(null)
  })

  it('should not be able to comment on a question from another author', async () => {
    const { question } = await questionsRepository.create(MakeQuestion())

    const { questionComment } = await questionCommentsRepository.create(
      MakeQuestionComment({ authorId: '123', questionId: question.id.value }),
    )

    const result = await sut.execute({
      authorId: 'other author',
      questionId: question.id.value,
      questionCommentId: questionComment.id.value,
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(UnauthorizedError)
  })
})
