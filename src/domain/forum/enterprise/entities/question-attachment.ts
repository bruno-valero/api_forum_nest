import Entity from '@/core/entities/entity'
import UniqueEntityId from '@/core/entities/unique-entity-id'

export interface QuestionAttachmentProps {
  questionId: UniqueEntityId
  attachmentId: UniqueEntityId
}

export type QuestionAttachmentCreateProps = Omit<
  QuestionAttachmentProps,
  'questionId' | 'attachmentId'
> & {
  questionId: string
  attachmentId: string
}

export class QuestionAttachment extends Entity<QuestionAttachmentProps> {
  static create(props: QuestionAttachmentCreateProps, id?: UniqueEntityId) {
    return new QuestionAttachment(
      {
        ...props,
        attachmentId: new UniqueEntityId(props.attachmentId),
        questionId: new UniqueEntityId(props.questionId),
      },
      id,
    )
  }

  get questionId() {
    return this.props.questionId
  }

  get attachmentId() {
    return this.props.attachmentId
  }
}
