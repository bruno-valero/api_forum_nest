import UniqueEntityId from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'
import Answer from '../entities/answer'

export class AnswerCreatedEvent implements DomainEvent {
  ocurredAt: Date
  private _answer: Answer

  constructor(answer: Answer) {
    this._answer = answer
    this.ocurredAt = new Date()
  }

  get answer() {
    return this._answer
  }

  getAggregateId(): UniqueEntityId {
    return this.answer.id
  }
}
