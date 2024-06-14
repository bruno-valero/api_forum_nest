import { AggregateRoot } from '@/core/entities/aggregate-root'
import UniqueEntityId from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface CommentProps {
  authorId: UniqueEntityId
  content: string
  createdAt: Date
  updatedAt?: Date | null
}

export type CommentCreateProps = Omit<
  Optional<CommentProps, 'createdAt'>,
  'authorId' | 'answerId'
> & { authorId: string; answerId: string }

export default abstract class Comment<
  Props extends CommentProps,
> extends AggregateRoot<Props> {
  get authorId() {
    return this.props.authorId
  }

  get content() {
    return this.props.content
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get excerpt() {
    return this.content.substring(0, 120).trimEnd().concat('...')
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  set content(text: string) {
    this.props.content = text
    this.touch()
  }
}
