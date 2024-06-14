import UniqueEntityId from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'
import QuestionComment from '../entities/question-comments'

export class QuestionCommentEvent implements DomainEvent {
  ocurredAt: Date
  private _questionComment: QuestionComment

  constructor(questionComment: QuestionComment) {
    this._questionComment = questionComment
    this.ocurredAt = new Date()
  }

  get questionComment() {
    return this._questionComment
  }

  getAggregateId(): UniqueEntityId {
    return this.questionComment.id
  }
}
