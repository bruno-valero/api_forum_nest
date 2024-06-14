import { makeAttachment } from '@/factories/tests/make-attachments'
import { AppModule } from '@/infra/app.module'
import { PrismaAttachmentMapper } from '@/infra/database/prisma/mappers/prisma-attachments-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('get question by slug controller (e2e)', () => {
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

  it('GET - /questions/:slug', async () => {
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

    const attachment1 = makeAttachment({ title: 'att1' })
    const attachment2 = makeAttachment({ title: 'att2' })

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

    const slug = listQuestionsResp.body.questions[0].slug

    const sutResp = await request(app.getHttpServer())
      .get(`/questions/${slug}`)
      .set('Authorization', `Bearer ${token}`)

    expect(createAccResp.statusCode).toEqual(201)
    expect(authRest.statusCode).toEqual(200)
    expect(authRest.body.access_token).toEqual(expect.any(String))
    expect(createQuestionResp.statusCode).toEqual(201)

    // sut
    expect(sutResp.statusCode).toEqual(200)
    expect(sutResp.body.question).toBeTruthy()
    expect(sutResp.body.question).toEqual(
      expect.objectContaining({
        title: 'Meu Title',
        author: 'bruno5',
        attachments: expect.arrayContaining([
          expect.objectContaining({
            title: 'att1',
          }),
        ]),
      }),
    )
  })
})
