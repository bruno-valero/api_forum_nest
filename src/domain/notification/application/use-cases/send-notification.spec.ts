import UniqueEntityId from '@/core/entities/unique-entity-id'
import { InMemoryNotificationsRepository } from '../respositories/in-memory-repositories/in-memory-notification-repository'
import SendNotificationUseCase from './send-notification'
import { Notification } from '../../enterprise/entities/notification'

let notificationsRepository: InMemoryNotificationsRepository
let sut: SendNotificationUseCase

beforeAll(() => {
  notificationsRepository = new InMemoryNotificationsRepository()
  sut = new SendNotificationUseCase(notificationsRepository)
})

afterAll(() => {})

describe('send notification Use Case', async () => {
  it('should be able to send a notification', async () => {
    const result = await sut.execute({
      content: 'teste',
      recipientId: '123',
      title: 'oio',
    })

    expect(result.isRight()).toEqual(true)
    if (result.isRight()) {
      expect(result.value.notification).toBeInstanceOf(Notification)
      expect(result.value.notification.recipientId).toEqual(
        new UniqueEntityId('123'),
      )

      expect(notificationsRepository.items[0].recipientId).toEqual(
        new UniqueEntityId('123'),
      )
    }
  })
})
