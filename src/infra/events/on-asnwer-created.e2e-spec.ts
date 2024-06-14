import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { PrismaAttachmentMapper } from '../database/prisma/mappers/prisma-attachments-mapper'
import { makeAttachment } from '@/factories/tests/make-attachments'
import { waitFor } from '@/tests/await-for'
import { DomainEvents } from '@/core/events/domain-events'

describe('On answer created (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    DomainEvents.shouldRun = true

    await app.init()
  })

  it('should send a notification when answer is created', async () => {
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

    const attachment1 = makeAttachment()
    const attachment2 = makeAttachment()

    const attachmentObjects = await Promise.all(
      [attachment1, attachment2].map(
        async (item) =>
          await prisma.attachment.create({
            data: PrismaAttachmentMapper.toPrisma(item),
          }),
      ),
    )

    const attachments = attachmentObjects.map((item) => item.id)

    // createQuestionResp
    await request(app.getHttpServer())
      .post('/questions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Meu Title',
        content: 'esse e o content',
        attachments,
      })

    const listQuestionsResp = await request(app.getHttpServer())
      .get(`/questions`)
      .set('Authorization', `Bearer ${token}`)

    const questionId = listQuestionsResp.body.questions[0].id

    await request(app.getHttpServer())
      .post(`/questions/${questionId}/answers`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'esse e o content answer content',
        attachmentsIds: [],
      })

    await waitFor(async () => {
      const notificationOnDatabase = await prisma.notification.findFirst({
        where: {
          recipientId: user.id,
        },
      })

      expect(notificationOnDatabase).not.toBeNull()
    })
  })
})
