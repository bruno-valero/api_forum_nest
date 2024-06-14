import UniqueEntityId from '@/core/entities/unique-entity-id'
import {
  AnswerAttachment,
  AnswerAttachmentCreateProps,
} from '@/domain/forum/enterprise/entities/answer-attachment'
import { randomUUID } from 'crypto'

export default function MakeAnswerAttachment(
  override: Partial<AnswerAttachmentCreateProps> = {},
  id?: string,
) {
  const answer = AnswerAttachment.create(
    {
      answerId: randomUUID(),
      attachmentId: randomUUID(),
      ...override,
    },
    id ? new UniqueEntityId(id) : undefined,
  )

  return answer
}
