import UniqueEntityId from '@/core/entities/unique-entity-id'
import Answer, {
  AnswerCreateProps,
} from '@/domain/forum/enterprise/entities/answer'
import { faker } from '@faker-js/faker'
import { randomUUID } from 'crypto'

export default function MakeAnswer(
  override: Partial<AnswerCreateProps> = {},
  id?: string,
) {
  const answer = Answer.create(
    {
      authorId: randomUUID(),
      content: faker.lorem.text(),
      questionId: randomUUID(),
      ...override,
    },
    id ? new UniqueEntityId(id) : undefined,
  )

  return answer
}
