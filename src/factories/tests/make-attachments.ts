import { faker } from '@faker-js/faker'

import {
  Attachment,
  AttachmentProps,
} from '@/domain/forum/enterprise/entities/attachment'
import UniqueEntityId from '@/core/entities/unique-entity-id'

export function makeAttachment(
  override: Partial<AttachmentProps> = {},
  id?: UniqueEntityId,
) {
  const attachment = Attachment.create(
    {
      title: faker.lorem.slug(),
      link: faker.lorem.slug(),
      ...override,
    },
    id,
  )

  return attachment
}
