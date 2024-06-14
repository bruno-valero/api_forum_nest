import InMemoryAnswerAttachmentRepository from '@/domain/forum/application/repositories/in-memory-repositories/in-memory-answer-attachment-repository'
import InMemoryAnswersRepository from '@/domain/forum/application/repositories/in-memory-repositories/in-memory-answers-repository'
import AnswerQuestionUseCase from '@/domain/forum/application/use-cases/answer-questions'
import InMemoryQuestionRepository from '@/domain/forum/application/repositories/in-memory-repositories/in-memory-questions-repository'
import SendNotificationUseCase, {
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from '../use-cases/send-notification'
import { InMemoryNotificationsRepository } from '../respositories/in-memory-repositories/in-memory-notification-repository'
import InMemoryQuestionAttachmentRepository from '@/domain/forum/application/repositories/in-memory-repositories/in-memory-question-attachment-repository'
import MakeQuestion from '@/factories/tests/make-question'
import { MockInstance } from 'vitest'
import { waitFor } from '@/tests/await-for'
import { OnAnswerCommentCreated } from './on-answer-comment'
import InMemoryAnswerCommentsRepository from '@/domain/forum/application/repositories/in-memory-repositories/in-memory-answer-comments-repository'
import MakeAnswerComment from '@/factories/tests/make-answer-comment'
import { InMemoryAttachmentsRepository } from '@/domain/forum/application/repositories/in-memory-repositories/in-memory-attachments-repository'
import InMemoryStudentsRepository from '@/domain/forum/application/repositories/in-memory-repositories/in-memory-students-repository'

let answerCommentsRepository: InMemoryAnswerCommentsRepository
let answerAttachmentsRepository: InMemoryAnswerAttachmentRepository
let answersRepository: InMemoryAnswersRepository
let answerQuestionUsecase: AnswerQuestionUseCase

let attachmentsRepository: InMemoryAttachmentsRepository
let studentsRepository: InMemoryStudentsRepository
let questionAttachmentsRepository: InMemoryQuestionAttachmentRepository
let questionsRepository: InMemoryQuestionRepository

let notificationsRepository: InMemoryNotificationsRepository
let sendNotificationUsecase: SendNotificationUseCase
let sut: OnAnswerCommentCreated // eslint-disable-line

let sendNotificationSpy: MockInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>

describe('on answer comment event', () => {
  beforeEach(() => {
    attachmentsRepository = new InMemoryAttachmentsRepository()
    studentsRepository = new InMemoryStudentsRepository()

    answerCommentsRepository = new InMemoryAnswerCommentsRepository(
      studentsRepository,
    )

    answerAttachmentsRepository = new InMemoryAnswerAttachmentRepository()
    answersRepository = new InMemoryAnswersRepository(
      answerAttachmentsRepository,
    )
    answerQuestionUsecase = new AnswerQuestionUseCase(answersRepository)

    questionAttachmentsRepository = new InMemoryQuestionAttachmentRepository()
    questionsRepository = new InMemoryQuestionRepository(
      questionAttachmentsRepository,
      attachmentsRepository,
      studentsRepository,
    )

    notificationsRepository = new InMemoryNotificationsRepository()
    sendNotificationUsecase = new SendNotificationUseCase(
      notificationsRepository,
    )

    sut = new OnAnswerCommentCreated(
      questionsRepository,
      answersRepository,
      sendNotificationUsecase,
    )
    sendNotificationSpy = vi.spyOn(sendNotificationUsecase, 'execute')
  })

  afterAll(() => {})

  it('shoud be able to send a notification on answer comment', async () => {
    const { question } = await questionsRepository.create(MakeQuestion())

    const answerResp = await answerQuestionUsecase.execute({
      authorId: 'oio',
      questionId: question.id.value,
      content: 'iuiu',
      attachmentsIds: ['r', 't'],

      // await notificationsRepository.
    })

    const answerId = answerResp.value?.answer.id.value

    await answerCommentsRepository.create(MakeAnswerComment({ answerId }))

    await waitFor(() => {
      expect(sendNotificationSpy).toHaveBeenCalled()
    })
  })
})
