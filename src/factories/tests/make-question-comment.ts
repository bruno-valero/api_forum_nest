import UniqueEntityId from '@/core/entities/unique-entity-id'
import QuestionComment, {
  QuestionCommentCreateProps,
} from '@/domain/forum/enterprise/entities/question-comments'
import { faker } from '@faker-js/faker'
import { randomUUID } from 'crypto'

export default function MakeQuestionComment(
  override: Partial<QuestionCommentCreateProps> = {},
  id?: string,
) {
  const question = QuestionComment.create(
    {
      questionId: randomUUID(),
      authorId: randomUUID(),
      content: faker.lorem.text(),
      ...override,
    },
    id ? new UniqueEntityId(id) : undefined,
  )

  return question
}
