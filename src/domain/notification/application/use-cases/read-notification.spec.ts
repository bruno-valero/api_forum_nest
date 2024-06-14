import { InMemoryNotificationsRepository } from '../respositories/in-memory-repositories/in-memory-notification-repository'
import ReadNotificationUseCase from './read-notification'
import { Notification } from '../../enterprise/entities/notification'
import MakeNotification from '@/factories/tests/make-notification'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'

let notificationsRepository: InMemoryNotificationsRepository
let sut: ReadNotificationUseCase

beforeAll(() => {
  notificationsRepository = new InMemoryNotificationsRepository()
  sut = new ReadNotificationUseCase(notificationsRepository)
})

afterAll(() => {})

describe('read notification Use Case', async () => {
  it('should be able to read a notification', async () => {
    const { notification } = await notificationsRepository.create(
      MakeNotification({ recipientId: '123' }),
    )

    const result = await sut.execute({
      notificationId: notification.id.value,
      recipientId: '123',
    })

    expect(result.isRight()).toEqual(true)
    if (result.isRight()) {
      expect(result.value.notification).toBeInstanceOf(Notification)
      expect(result.value.notification.readAt).toEqual(expect.any(Date))

      expect(notificationsRepository.items[0].readAt).toEqual(expect.any(Date))
    }
  })
  it('should not be able to read a notification from another recipient', async () => {
    const { notification } = await notificationsRepository.create(
      MakeNotification({ recipientId: '123' }),
    )

    const result = await sut.execute({
      notificationId: notification.id.value,
      recipientId: 'another recipient',
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(UnauthorizedError)
  })
})
