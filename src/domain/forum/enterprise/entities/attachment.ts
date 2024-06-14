import Entity from '@/core/entities/entity'
import UniqueEntityId from '@/core/entities/unique-entity-id'

export interface AttachmentProps {
  title: string
  link: string
}

export type AttachmentCreateProps = AttachmentProps

export class Attachment extends Entity<AttachmentCreateProps> {
  static create(props: AttachmentCreateProps, id?: UniqueEntityId) {
    return new Attachment(
      {
        ...props,
      },
      id,
    )
  }

  get title() {
    return this.props.title
  }

  get link() {
    return this.props.link
  }
}
