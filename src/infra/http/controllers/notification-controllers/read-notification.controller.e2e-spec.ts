import MakeNotification from '@/factories/tests/make-notification'
import { AppModule } from '@/infra/app.module'
import { PrismaNotificationMapper } from '@/infra/database/prisma/mappers/notification-mappers/prisma-notification-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Read notification (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[PATCH] /notifications/:notificationId/read', async () => {
    await request(app.getHttpServer()).post('/accounts').send({
      name: 'bruno5',
      email: 'bruno5@gmail.com',
      password: '123',
    })

    const user = (await prisma.user.findMany())?.[0]

    const authRest = await request(app.getHttpServer()).post('/sessions').send({
      email: 'bruno5@gmail.com',
      password: '123',
    })

    const token = authRest.body.access_token as string

    const notificationCreated = MakeNotification()

    const notification = await prisma.notification.create({
      data: PrismaNotificationMapper.toPrisma(notificationCreated),
    })

    const notificationId = notification.id

    const response = await request(app.getHttpServer())
      .patch(`/notifications/${notificationId}/read`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toBe(204)

    const notificationOnDatabase = await prisma.notification.findFirst({
      where: {
        recipientId: user.id,
      },
    })

    expect(notificationOnDatabase?.readAt).not.toBeNull()
  })
})
