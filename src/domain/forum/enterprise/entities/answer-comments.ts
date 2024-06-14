import UniqueEntityId from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import Comment, { CommentProps } from './comments'
import { AnswerCommentEvent } from '../events/answer-comment-event'

export interface AnswerCommentProps extends CommentProps {
  answerId: UniqueEntityId
}

export type AnswerCommentCreateProps = Omit<
  Optional<AnswerCommentProps, 'createdAt'>,
  'authorId' | 'answerId'
> & { authorId: string; answerId: string }

export default class AnswerComment extends Comment<AnswerCommentProps> {
  static create(props: AnswerCommentCreateProps, id?: UniqueEntityId) {
    const answerComment = new AnswerComment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        authorId: new UniqueEntityId(props.authorId),
        answerId: new UniqueEntityId(props.answerId),
      },
      id,
    )

    const isNewAnswer = !id

    if (isNewAnswer) {
      answerComment.addDomainEvent(new AnswerCommentEvent(answerComment))
    }

    return answerComment
  }

  get answerId() {
    return this.props.answerId
  }
}
