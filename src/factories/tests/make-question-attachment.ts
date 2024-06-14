import UniqueEntityId from '@/core/entities/unique-entity-id'
import {
  QuestionAttachment,
  QuestionAttachmentCreateProps,
} from '@/domain/forum/enterprise/entities/question-attachment'
import { randomUUID } from 'crypto'

export default function MakeQuestionAttachment(
  override: Partial<QuestionAttachmentCreateProps> = {},
  id?: string,
) {
  const question = QuestionAttachment.create(
    {
      questionId: randomUUID(),
      attachmentId: randomUUID(),
      ...override,
    },
    id ? new UniqueEntityId(id) : undefined,
  )

  return question
}
