import UniqueEntityId from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'
import AnswerComment from '../entities/answer-comments'

export class AnswerCommentEvent implements DomainEvent {
  ocurredAt: Date
  private _answerComment: AnswerComment

  constructor(answerComment: AnswerComment) {
    this._answerComment = answerComment
    this.ocurredAt = new Date()
  }

  get answerComment() {
    return this._answerComment
  }

  getAggregateId(): UniqueEntityId {
    return this.answerComment.id
  }
}
