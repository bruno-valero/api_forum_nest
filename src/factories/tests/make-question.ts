import UniqueEntityId from '@/core/entities/unique-entity-id'
import Question, {
  QuestionCreateProps,
} from '@/domain/forum/enterprise/entities/question'
import { faker } from '@faker-js/faker'
import { randomUUID } from 'crypto'

export default function MakeQuestion(
  override: Partial<QuestionCreateProps> = {},
  id?: string,
) {
  const question = Question.create(
    {
      authorId: randomUUID(),
      content: faker.lorem.text(),
      title: faker.lorem.sentence(),
      ...override,
    },
    id ? new UniqueEntityId(id) : undefined,
  )

  return question
}
