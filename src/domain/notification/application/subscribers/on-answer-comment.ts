import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import QuestionsRepository from '@/domain/forum/application/repositories/questions-repository'
import SendNotificationUseCase from '../use-cases/send-notification'
import { left } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import AnswersRepository from '@/domain/forum/application/repositories/answers-repository'
import { AnswerCommentEvent } from '@/domain/forum/enterprise/events/answer-comment-event'

export class OnAnswerCommentCreated implements EventHandler {
  constructor(
    private questionsRepository: QuestionsRepository,
    private answersRepository: AnswersRepository,
    private sendNotificationUseCase: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendAnswerCommentNotification.bind(this),
      AnswerCommentEvent.name,
    )
  }

  private async sendAnswerCommentNotification({
    answerComment,
  }: AnswerCommentEvent) {
    const answerResp = await this.answersRepository.getById(
      answerComment.answerId.value,
    )
    if (!answerResp) return left(new ResourceNotFoundError())
    const { answer } = answerResp

    const questionResp = await this.questionsRepository.getById(
      answer.questionId.value,
    )

    if (!questionResp) return left(new ResourceNotFoundError())

    const { question } = questionResp

    await this.sendNotificationUseCase.execute({
      recipientId: answer.authorId.value,
      title: `Sua resposta recebeu um comenário`,
      content: `Sua resposta em ${question.title.substring(0, 20).concat('...')} acabou de receber um comentário`,
    })
  }
}
