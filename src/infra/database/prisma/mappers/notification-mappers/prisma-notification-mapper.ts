import { Notification as PrismaNotification, Prisma } from '@prisma/client'
import { Notification } from '@/domain/notification/enterprise/entities/notification'
import UniqueEntityId from '@/core/entities/unique-entity-id'

export class PrismaNotificationMapper {
  static toDomain(raw: PrismaNotification): Notification {
    return Notification.create(
      {
        title: raw.title,
        content: raw.content,
        recipientId: raw.recipientId,
        readAt: raw.readAt,
        createdAt: raw.createdAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(
    notification: Notification,
  ): Prisma.NotificationUncheckedCreateInput {
    return {
      id: notification.id.value,
      recipientId: notification.recipientId.value,
      title: notification.title,
      content: notification.content,
      readAt: notification.readAt,
      createdAt: notification.createdAt,
    }
  }
}