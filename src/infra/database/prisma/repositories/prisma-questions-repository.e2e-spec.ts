import { makeAttachment } from '@/factories/tests/make-attachments'
import { AppModule } from '@/infra/app.module'
import { CacheRepository } from '@/infra/cache/cache-repository'
import { CacheModule } from '@/infra/cache/cache.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { PrismaService } from '../prisma.service'
import { PrismaAttachmentMapper } from '../mappers/prisma-attachments-mapper'
import QuestionsRepository from '@/domain/forum/application/repositories/questions-repository'
// import { QuestionPresenterToHTTPResponse } from '@/infra/http/presenters/question-presenter'
// import MakeQuestion from '@/factories/tests/make-question'
// import Slug from '@/domain/forum/enterprise/entities/value-objects.ts/slug'

describe('Prisma Questions Repository (E2E)', () => {
  let app: INestApplication
  let cacheRepository: CacheRepository
  let prisma: PrismaService
  let questionsRepository: QuestionsRepository

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CacheModule],
      providers: [],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    questionsRepository = moduleRef.get(QuestionsRepository)

    cacheRepository = moduleRef.get(CacheRepository)

    await app.init()
  })

  it('should cache question details', async () => {
    // createAccResp
    await request(app.getHttpServer()).post('/accounts').send({
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

    const question = listQuestionsResp.body.questions[0]

    // const questionId = question.id

    const slug = question.slug.value

    const questionDetails = await questionsRepository.findDetailsBySlug(slug)

    const cached = await cacheRepository.get(`question:${slug}:details`)

    expect(cached).toEqual(JSON.stringify(questionDetails))
  })

  //   it('should return cached question details on subsequent calls', async () => {
  //     // createAccResp
  //     await request(app.getHttpServer()).post('/accounts').send({
  //       name: 'bruno5',
  //       email: 'bruno5@gmail.com',
  //       password: '123',
  //     })

  //     // const user = (await prisma.user.findMany())[0]

  //     const authRest = await request(app.getHttpServer()).post('/sessions').send({
  //       email: 'bruno5@gmail.com',
  //       password: '123',
  //     })

  //     const token = authRest.body.access_token as string

  //     const attachment1 = makeAttachment()
  //     const attachment2 = makeAttachment()

  //     const attachmentObjects = await Promise.all(
  //       [attachment1, attachment2].map(
  //         async (item) =>
  //           await prisma.attachment.create({
  //             data: PrismaAttachmentMapper.toPrisma(item),
  //           }),
  //       ),
  //     )

  //     const attachments = attachmentObjects.map((item) => item.id)

  //     // createQuestionResp
  //     await request(app.getHttpServer())
  //       .post('/questions')
  //       .set('Authorization', `Bearer ${token}`)
  //       .send({
  //         title: 'Meu Title',
  //         content: 'esse e o content',
  //         attachments,
  //       })

  //     const listQuestionsResp = await request(app.getHttpServer())
  //       .get(`/questions`)
  //       .set('Authorization', `Bearer ${token}`)

  //     const question = listQuestionsResp.body
  //       .questions[0] as QuestionPresenterToHTTPResponse

  //     const slug = question.slug

  //     await cacheRepository.set(
  //       `question:${slug}:details`,
  //       JSON.stringify({ empty: true }),
  //     )

  //     const questionDetails = await questionsRepository.findDetailsBySlug(slug)

  //     expect(questionDetails).toEqual({ empty: true })
  //   })

  //   it('should reset question details cache when saving the question', async () => {
  //     // createAccResp
  //     await request(app.getHttpServer()).post('/accounts').send({
  //       name: 'bruno5',
  //       email: 'bruno5@gmail.com',
  //       password: '123',
  //     })

  //     const user = (await prisma.user.findMany())[0]

  //     const authRest = await request(app.getHttpServer()).post('/sessions').send({
  //       email: 'bruno5@gmail.com',
  //       password: '123',
  //     })

  //     const token = authRest.body.access_token as string

  //     const attachment1 = makeAttachment()
  //     const attachment2 = makeAttachment()

  //     const attachmentObjects = await Promise.all(
  //       [attachment1, attachment2].map(
  //         async (item) =>
  //           await prisma.attachment.create({
  //             data: PrismaAttachmentMapper.toPrisma(item),
  //           }),
  //       ),
  //     )

  //     const attachments = attachmentObjects.map((item) => item.id)

  //     // createQuestionResp
  //     await request(app.getHttpServer())
  //       .post('/questions')
  //       .set('Authorization', `Bearer ${token}`)
  //       .send({
  //         title: 'Meu Title',
  //         content: 'esse e o content',
  //         attachments,
  //       })

  //     const listQuestionsResp = await request(app.getHttpServer())
  //       .get(`/questions`)
  //       .set('Authorization', `Bearer ${token}`)

  //     const question = listQuestionsResp.body
  //       .questions[0] as QuestionPresenterToHTTPResponse

  //     const slug = question.slug

  //     await cacheRepository.set(
  //       `question:${slug}:details`,
  //       JSON.stringify({ empty: true }),
  //     )

  //     await questionsRepository.update(
  //       question.id,
  //       user.id,
  //       MakeQuestion({ ...question, slug: new Slug(question.slug) }, question.id),
  //     )

  //     const cached = await cacheRepository.get(`question:${slug}:details`)

  //     expect(cached).toBeNull()
  //   })
})
