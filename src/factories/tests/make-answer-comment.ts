import UniqueEntityId from '@/core/entities/unique-entity-id'
import AnswerComment, {
  AnswerCommentCreateProps,
} from '@/domain/forum/enterprise/entities/answer-comments'
import { faker } from '@faker-js/faker'
import { randomUUID } from 'crypto'

export default function MakeAnswerComment(
  override: Partial<AnswerCommentCreateProps> = {},
  id?: string,
) {
  const answer = AnswerComment.create(
    {
      authorId: randomUUID(),
      content: faker.lorem.text(),
      answerId: randomUUID(),
      ...override,
    },
    id ? new UniqueEntityId(id) : undefined,
  )

  return answer
}
