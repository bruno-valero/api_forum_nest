import InMemoryQuestionRepository from '../repositories/in-memory-repositories/in-memory-questions-repository'
import MakeQuestion from '@/factories/tests/make-question'
import GetQuestionBySlugUseCase from './get-question-by-slug-use-case'
import InMemoryQuestionAttachmentAttachmentRepository from '../repositories/in-memory-repositories/in-memory-question-attachment-repository'
import { InMemoryAttachmentsRepository } from '../repositories/in-memory-repositories/in-memory-attachments-repository'
import InMemoryStudentsRepository from '../repositories/in-memory-repositories/in-memory-students-repository'
import MakeStudent from '@/factories/tests/make-student'
import Slug from '../../enterprise/entities/value-objects.ts/slug'
import { makeAttachment } from '@/factories/tests/make-attachments'
import MakeQuestionAttachment from '@/factories/tests/make-question-attachment'
import { QuestionDetails } from '../../enterprise/entities/value-objects.ts/question-details'

let attachmentsRepository: InMemoryAttachmentsRepository
let studentsRepository: InMemoryStudentsRepository

let questionAttachmentsRepository: InMemoryQuestionAttachmentAttachmentRepository
let questionsRepository: InMemoryQuestionRepository
let sut: GetQuestionBySlugUseCase

describe('Get Question by slug Use Case', async () => {
  beforeEach(() => {
    attachmentsRepository = new InMemoryAttachmentsRepository()
    studentsRepository = new InMemoryStudentsRepository()

    questionAttachmentsRepository =
      new InMemoryQuestionAttachmentAttachmentRepository()
    questionsRepository = new InMemoryQuestionRepository(
      questionAttachmentsRepository,
      attachmentsRepository,
      studentsRepository,
    )
    sut = new GetQuestionBySlugUseCase(questionsRepository)
  })

  afterAll(() => {})

  it('should be able to get a question by slug', async () => {
    const student = MakeStudent({ name: 'John Doe' })

    await studentsRepository.create(student)

    const newQuestion = MakeQuestion({
      authorId: student.id.value,
      slug: new Slug('example-question'),
    })

    const { question } = await questionsRepository.create(newQuestion)

    const attachment = makeAttachment({
      title: 'Some attachment',
    })

    attachmentsRepository.items.push(attachment)

    questionAttachmentsRepository.items.push(
      MakeQuestionAttachment({
        attachmentId: attachment.id.value,
        questionId: newQuestion.id.value,
      }),
    )

    const result = await sut.execute({
      slug: question.slug.value!,
    })

    console.log('result.value', result.value)
    expect(result.isRight()).toEqual(true)
    if (result.isRight()) {
      expect(result.value.question).toBeInstanceOf(QuestionDetails)

      expect(result.value).toMatchObject({
        question: expect.objectContaining({
          title: newQuestion.title,
          author: 'John Doe',
          attachments: [
            expect.objectContaining({
              title: attachment.title,
            }),
          ],
        }),
      })
    }
  })
})
