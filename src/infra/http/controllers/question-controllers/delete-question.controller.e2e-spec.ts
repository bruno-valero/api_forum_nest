import { makeAttachment } from '@/factories/tests/make-attachments'
import { AppModule } from '@/infra/app.module'
import { PrismaAttachmentMapper } from '@/infra/database/prisma/mappers/prisma-attachments-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('delete question controller (e2e)', () => {
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

  it('DELETE - /questions/:questionId', async () => {
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

    const createQuestionResp = await request(app.getHttpServer())
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

    const sutResp = await request(app.getHttpServer())
      .delete(`/questions/${questionId}`)
      .set('Authorization', `Bearer ${token}`)

    const listQuestions2Resp = await request(app.getHttpServer())
      .get(`/questions`)
      .set('Authorization', `Bearer ${token}`)

    expect(createAccResp.statusCode).toEqual(201)
    expect(authRest.statusCode).toEqual(200)
    expect(authRest.body.access_token).toEqual(expect.any(String))
    expect(createQuestionResp.statusCode).toEqual(201)

    // sut
    expect(sutResp.statusCode).toEqual(204)
    expect(listQuestions2Resp.body.questions).toHaveLength(0)
  })
})
