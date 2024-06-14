import InMemoryQuestionRepository from '../repositories/in-memory-repositories/in-memory-questions-repository'
import MakeQuestion from '@/factories/tests/make-question'
import ChooseBestAnswerUseCase from './choose-best-answer-use-case'
import InMemoryAnswersRepository from '../repositories/in-memory-repositories/in-memory-answers-repository'
import MakeAnswer from '@/factories/tests/make-answer'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import InMemoryQuestionAttachmentAttachmentRepository from '../repositories/in-memory-repositories/in-memory-question-attachment-repository'
import InMemoryAnswerAttachmentAttachmentRepository from '../repositories/in-memory-repositories/in-memory-answer-attachment-repository'
import { InMemoryAttachmentsRepository } from '../repositories/in-memory-repositories/in-memory-attachments-repository'
import InMemoryStudentsRepository from '../repositories/in-memory-repositories/in-memory-students-repository'

let attachmentsRepository: InMemoryAttachmentsRepository
let studentsRepository: InMemoryStudentsRepository

let answerAttachmentsRepository: InMemoryAnswerAttachmentAttachmentRepository
let questionAttachmentsRepository: InMemoryQuestionAttachmentAttachmentRepository
let answersRepository: InMemoryAnswersRepository
let questionsRepository: InMemoryQuestionRepository
let sut: ChooseBestAnswerUseCase

describe('choose best answer Use Case', async () => {
  beforeEach(() => {
    attachmentsRepository = new InMemoryAttachmentsRepository()
    studentsRepository = new InMemoryStudentsRepository()

    answerAttachmentsRepository =
      new InMemoryAnswerAttachmentAttachmentRepository()
    questionAttachmentsRepository =
      new InMemoryQuestionAttachmentAttachmentRepository()
    answersRepository = new InMemoryAnswersRepository(
      answerAttachmentsRepository,
    )
    questionsRepository = new InMemoryQuestionRepository(
      questionAttachmentsRepository,
      attachmentsRepository,
      studentsRepository,
    )
    sut = new ChooseBestAnswerUseCase(answersRepository, questionsRepository)
  })

  afterAll(() => {})

  it('should be able to choose best answer for a question', async () => {
    const { question } = await questionsRepository.create(
      MakeQuestion({ authorId: '123' }),
    )

    const { answer } = await answersRepository.create(
      MakeAnswer({ authorId: '123', questionId: question.id.value }),
    )
    const result = await sut.execute({
      authorId: question.authorId.value,
      answerId: answer.id.value,
    })

    const edit = await questionsRepository.getById(question.id.value)

    expect(result.isRight()).toEqual(true)
    expect(edit?.question.bestAnsweredId?.value).toEqual(answer.id.value)
    expect(edit?.question.updatedAt).toEqual(expect.any(Date))
  })

  it('should not be able to choose best answer for a question from a different author', async () => {
    const { question } = await questionsRepository.create(
      MakeQuestion({ authorId: '123' }),
    )

    const { answer } = await answersRepository.create(
      MakeAnswer({ authorId: '123', questionId: question.id.value }),
    )

    const result = await sut.execute({
      authorId: 'other author',
      answerId: answer.id.value,
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(UnauthorizedError)
  })
})
