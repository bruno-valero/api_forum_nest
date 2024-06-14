import { makeAttachment } from '@/factories/tests/make-attachments'
import { AppModule } from '@/infra/app.module'
import { PrismaAttachmentMapper } from '@/infra/database/prisma/mappers/prisma-attachments-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('fetch answer comments controller (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  it('GET - /answers/:answerId/comments', async () => {
    const createAccResp = await request(app.getHttpServer())
      .post('/accounts')
      .send({
        name: 'bruno5',
        email: 'bruno5@gmail.com',
        password: '123',
      })

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

    await request(app.getHttpServer())
      .post('/questions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Meu Title',
        content: 'esse e o content',
        attachments,
      })

    const questionResp = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${token}`)

    const questionId = questionResp.body.questions[0].id

    await request(app.getHttpServer())
      .post(`/questions/${questionId}/answers`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'esse e o content',
        attachmentsIds: [],
      })

    const answers = await prisma.answer.findMany()
    const answerId = answers[0].id

    await request(app.getHttpServer())
      .post(`/answers/${answerId}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'Meu answer comment 1',
      })

    await request(app.getHttpServer())
      .post(`/answers/${answerId}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'Meu answer comment 2',
      })

    const sutResp = await request(app.getHttpServer())
      .get(`/answers/${answerId}/comments`)
      .set('Authorization', `Bearer ${token}`)

    expect(createAccResp.statusCode).toEqual(201)
    expect(authRest.statusCode).toEqual(200)
    expect(authRest.body.access_token).toEqual(expect.any(String))

    // sut
    expect(sutResp.statusCode).toEqual(200)
    expect(sutResp.body.answerComments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          content: 'Meu answer comment 1',
          authorName: 'bruno5',
        }),
        expect.objectContaining({
          content: 'Meu answer comment 2',
          authorName: 'bruno5',
        }),
      ]),
    )
  })
})
