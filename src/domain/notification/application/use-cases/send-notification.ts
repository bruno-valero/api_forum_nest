import { Either, right } from '@/core/either'

import { Notification } from '../../enterprise/entities/notification'
import { NotificationsRepository } from '../respositories/notifications-repository'
import { Injectable } from '@nestjs/common'

export interface SendNotificationUseCaseRequest {
  recipientId: string
  title: string
  content: string
}

export type SendNotificationUseCaseResponse = Either<null, null>

@Injectable()
export default class SendNotificationUseCase {
  constructor(protected notificationsRepository: NotificationsRepository) {}

  async execute({
    ...props
  }: SendNotificationUseCaseRequest): Promise<SendNotificationUseCaseResponse> {
    const newNotification = Notification.create(props)

    await this.notificationsRepository.create(newNotification)

    return right(null)
  }
}
