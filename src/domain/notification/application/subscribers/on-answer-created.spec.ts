import InMemoryAnswerAttachmentAttachmentRepository from '@/domain/forum/application/repositories/in-memory-repositories/in-memory-answer-attachment-repository'
import InMemoryAnswersRepository from '@/domain/forum/application/repositories/in-memory-repositories/in-memory-answers-repository'
import AnswerQuestionUseCase from '@/domain/forum/application/use-cases/answer-questions'
import { OnAnswerCreated } from './on-answer-created'
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
import InMemoryStudentsRepository from '@/domain/forum/application/repositories/in-memory-repositories/in-memory-students-repository'
import { InMemoryAttachmentsRepository } from '@/domain/forum/application/repositories/in-memory-repositories/in-memory-attachments-repository'

let attachmentsRepository: InMemoryAttachmentsRepository
let studentsRepository: InMemoryStudentsRepository
let answerAttachmentsRepository: InMemoryAnswerAttachmentAttachmentRepository
let repository: InMemoryAnswersRepository
let answerQuestionUsecase: AnswerQuestionUseCase

let questionAttachmentsRepository: InMemoryQuestionAttachmentRepository
let questionsRepository: InMemoryQuestionRepository

let notificationsRepository: InMemoryNotificationsRepository
let sendNotificationUsecase: SendNotificationUseCase
let sut: OnAnswerCreated // eslint-disable-line

let sendNotificationSpy: MockInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>

describe('on answer created event', () => {
  beforeEach(() => {
    attachmentsRepository = new InMemoryAttachmentsRepository()
    studentsRepository = new InMemoryStudentsRepository()
    answerAttachmentsRepository =
      new InMemoryAnswerAttachmentAttachmentRepository()
    repository = new InMemoryAnswersRepository(answerAttachmentsRepository)
    answerQuestionUsecase = new AnswerQuestionUseCase(repository)

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

    sut = new OnAnswerCreated(questionsRepository, sendNotificationUsecase)
    sendNotificationSpy = vi.spyOn(sendNotificationUsecase, 'execute')
  })

  afterAll(() => {})

  it('shoud be able to send a notification on aswer creation', async () => {
    const { question } = await questionsRepository.create(MakeQuestion())

    await answerQuestionUsecase.execute({
      authorId: 'oio',
      questionId: question.id.value,
      content: 'iuiu',
      attachmentsIds: ['r', 't'],

      // await notificationsRepository.
    })

    await waitFor(() => {
      expect(sendNotificationSpy).toHaveBeenCalled()
    })
  })
})
