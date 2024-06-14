import UniqueEntityId from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import Comment, { CommentProps } from './comments'
import { QuestionCommentEvent } from '../events/question-comment-event'

export interface QuestionCommentProps extends CommentProps {
  questionId: UniqueEntityId
}

export type QuestionCommentCreateProps = Omit<
  Optional<QuestionCommentProps, 'createdAt'>,
  'authorId' | 'questionId'
> & { authorId: string; questionId: string }

export default class QuestionComment extends Comment<QuestionCommentProps> {
  static create(props: QuestionCommentCreateProps, id?: UniqueEntityId) {
    const questionComment = new QuestionComment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        authorId: new UniqueEntityId(props.authorId),
        questionId: new UniqueEntityId(props.questionId),
      },
      id,
    )

    const isNewAnswer = !id

    if (isNewAnswer) {
      questionComment.addDomainEvent(new QuestionCommentEvent(questionComment))
    }

    return questionComment
  }

  get questionId() {
    return this.props.questionId
  }
}
