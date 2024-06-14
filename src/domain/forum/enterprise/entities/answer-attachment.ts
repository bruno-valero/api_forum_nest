import Entity from '@/core/entities/entity'
import UniqueEntityId from '@/core/entities/unique-entity-id'

export interface AnswerAttachmentProps {
  answerId: UniqueEntityId
  attachmentId: UniqueEntityId
}

export type AnswerAttachmentCreateProps = Omit<
  AnswerAttachmentProps,
  'answerId' | 'attachmentId'
> & {
  answerId: string
  attachmentId: string
}

export class AnswerAttachment extends Entity<AnswerAttachmentProps> {
  static create(props: AnswerAttachmentCreateProps, id?: UniqueEntityId) {
    return new AnswerAttachment(
      {
        ...props,
        attachmentId: new UniqueEntityId(props.attachmentId),
        answerId: new UniqueEntityId(props.answerId),
      },
      id,
    )
  }

  get answerId() {
    return this.props.answerId
  }

  get attachmentId() {
    return this.props.attachmentId
  }
}
