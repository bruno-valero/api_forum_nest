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
import { OnQuestionCommentCreated } from './on-question-comment'
import MakeQuestionComment from '@/factories/tests/make-question-comment'
import InMemoryQuestionCommentsRepository from '@/domain/forum/application/repositories/in-memory-repositories/in-memory-question-comments-repository'
import InMemoryStudentsRepository from '@/domain/forum/application/repositories/in-memory-repositories/in-memory-students-repository'
import { InMemoryAttachmentsRepository } from '@/domain/forum/application/repositories/in-memory-repositories/in-memory-attachments-repository'

let attachmentsRepository: InMemoryAttachmentsRepository
let studentsRepository: InMemoryStudentsRepository
let questionsCommentRepository: InMemoryQuestionCommentsRepository

let questionAttachmentsRepository: InMemoryQuestionAttachmentRepository
let questionsRepository: InMemoryQuestionRepository

let notificationsRepository: InMemoryNotificationsRepository
let sendNotificationUsecase: SendNotificationUseCase
let sut: OnQuestionCommentCreated // eslint-disable-line

let sendNotificationSpy: MockInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>

describe('on answer comment event', () => {
  beforeEach(() => {
    attachmentsRepository = new InMemoryAttachmentsRepository()
    studentsRepository = new InMemoryStudentsRepository()
    questionsCommentRepository = new InMemoryQuestionCommentsRepository(
      studentsRepository,
    )

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

    sut = new OnQuestionCommentCreated(
      questionsRepository,
      sendNotificationUsecase,
    )
    sendNotificationSpy = vi.spyOn(sendNotificationUsecase, 'execute')
  })

  afterAll(() => {})

  it('shoud be able to send a notification on answer comment', async () => {
    const { question } = await questionsRepository.create(MakeQuestion())

    const questionId = question.id.value

    await questionsCommentRepository.create(MakeQuestionComment({ questionId }))

    await waitFor(() => {
      expect(sendNotificationSpy).toHaveBeenCalled()
    })
  })
})
