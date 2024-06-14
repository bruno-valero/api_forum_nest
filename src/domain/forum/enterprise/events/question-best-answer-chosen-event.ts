import UniqueEntityId from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'
import Question from '../entities/question'

export class QuestionBestQuestionChosenEvent implements DomainEvent {
  ocurredAt: Date
  private _question: Question
  private _bestAnswerId: UniqueEntityId

  constructor(question: Question, bestAnswerId: string) {
    this._question = question
    this._bestAnswerId = new UniqueEntityId(bestAnswerId)
    this.ocurredAt = new Date()
  }

  get question() {
    return this._question
  }

  get bestAnswerId() {
    return this._bestAnswerId
  }

  getAggregateId(): UniqueEntityId {
    return this.question.id
  }
}
