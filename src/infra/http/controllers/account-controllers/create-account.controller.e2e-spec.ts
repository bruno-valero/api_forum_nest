import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('create account controller (e2e)', () => {
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

  it('POST - /accounts', async () => {
    const createAccResp = await request(app.getHttpServer())
      .post('/accounts')
      .send({
        name: 'bruno5',
        email: 'bruno5@gmail.com',
        password: '123',
      })

    const user = await prisma.user.findUnique({
      where: {
        email: 'bruno5@gmail.com',
      },
    })

    expect(createAccResp.statusCode).toEqual(201)
    expect(user).toBeTruthy()
  })
})
