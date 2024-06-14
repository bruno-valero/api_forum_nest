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
import { OnQuestionBestAnswerChosen } from './on-question-best-answer-chosen'
import InMemoryAnswerAttachmentRepository from '@/domain/forum/application/repositories/in-memory-repositories/in-memory-answer-attachment-repository'
import InMemoryStudentsRepository from '@/domain/forum/application/repositories/in-memory-repositories/in-memory-students-repository'
import { InMemoryAttachmentsRepository } from '@/domain/forum/application/repositories/in-memory-repositories/in-memory-attachments-repository'

let attachmentsRepository: InMemoryAttachmentsRepository
let studentsRepository: InMemoryStudentsRepository
let answerAttachmentsRepository: InMemoryAnswerAttachmentRepository
let answersRepository: InMemoryAnswersRepository
let answerQuestionUsecase: AnswerQuestionUseCase

let questionAttachmentsRepository: InMemoryQuestionAttachmentRepository
let questionsRepository: InMemoryQuestionRepository

let notificationsRepository: InMemoryNotificationsRepository
let sendNotificationUsecase: SendNotificationUseCase
let sut: OnQuestionBestAnswerChosen // eslint-disable-line

let sendNotificationSpy: MockInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>

describe('on question best answer chosen event', () => {
  beforeEach(() => {
    attachmentsRepository = new InMemoryAttachmentsRepository()
    studentsRepository = new InMemoryStudentsRepository()
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

    sut = new OnQuestionBestAnswerChosen(
      answersRepository,
      sendNotificationUsecase,
    )
    sendNotificationSpy = vi.spyOn(sendNotificationUsecase, 'execute')
  })

  afterAll(() => {})

  it('shoud be able to send a notification on question best answer chosen', async () => {
    const { question } = await questionsRepository.create(
      MakeQuestion({ authorId: 'io' }),
    )

    const answer = await answerQuestionUsecase.execute({
      authorId: 'oio',
      questionId: question.id.value,
      content: 'iuiu',
      attachmentsIds: ['r', 't'],

      // await notificationsRepository.
    })

    question.bestAnsweredId = answer.value?.answer.id

    await questionsRepository.update(question.id.value, 'io', question)

    await waitFor(() => {
      expect(sendNotificationSpy).toHaveBeenCalled()
    })
  })
})
