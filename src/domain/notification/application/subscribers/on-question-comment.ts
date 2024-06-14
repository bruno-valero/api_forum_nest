import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import QuestionsRepository from '@/domain/forum/application/repositories/questions-repository'
import SendNotificationUseCase from '../use-cases/send-notification'
import { left } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import { QuestionCommentEvent } from '@/domain/forum/enterprise/events/question-comment-event'

export class OnQuestionCommentCreated implements EventHandler {
  constructor(
    private questionsRepository: QuestionsRepository,
    private sendNotificationUseCase: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendQuestionCommentNotification.bind(this),
      QuestionCommentEvent.name,
    )
  }

  private async sendQuestionCommentNotification({
    questionComment,
  }: QuestionCommentEvent) {
    const questionResp = await this.questionsRepository.getById(
      questionComment.questionId.value,
    )

    if (!questionResp) return left(new ResourceNotFoundError())

    const { question } = questionResp

    await this.sendNotificationUseCase.execute({
      recipientId: question.authorId.value,
      title: `Sua pergunta recebeu um comenário`,
      content: `Sua pergunta "${question.title.substring(0, 20).concat('...')}" acabou de receber um comentário`,
    })
  }
}
