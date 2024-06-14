import { makeAttachment } from '@/factories/tests/make-attachments'
import { AppModule } from '@/infra/app.module'
import { PrismaAttachmentMapper } from '@/infra/database/prisma/mappers/prisma-attachments-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('create question controller (e2e)', () => {
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

  it('POST - /questions', async () => {
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

    const sutResp = await request(app.getHttpServer())
      .post('/questions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Meu Title',
        content: 'esse e o content',
        attachments,
      })

    const question = await prisma.question.findMany()

    const attachmentsOnDatabase = await prisma.attachment.findMany({
      where: {
        questionId: question[0]?.id,
      },
    })

    expect(attachmentsOnDatabase).toHaveLength(2)
    expect(createAccResp.statusCode).toEqual(201)
    expect(authRest.statusCode).toEqual(200)
    expect(authRest.body.access_token).toEqual(expect.any(String))
    expect(sutResp.statusCode).toEqual(201)
    expect(sutResp.body.question).toEqual(
      expect.objectContaining({
        title: 'Meu Title',
      }),
    )
    expect(question).toHaveLength(1)
    expect(question[0]).toEqual(
      expect.objectContaining({
        title: 'Meu Title',
      }),
    )
  })
})
