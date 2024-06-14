import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import SendNotificationUseCase from '../use-cases/send-notification'
import { left } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import AnswersRepository from '@/domain/forum/application/repositories/answers-repository'
import { QuestionBestQuestionChosenEvent } from '@/domain/forum/enterprise/events/question-best-answer-chosen-event'
import { Injectable } from '@nestjs/common'

@Injectable()
export class OnQuestionBestAnswerChosen implements EventHandler {
  constructor(
    private answersRepository: AnswersRepository,
    private sendNotificationUseCase: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendQuestionBestAnswerChosenNotification.bind(this),
      QuestionBestQuestionChosenEvent.name,
    )
  }

  private async sendQuestionBestAnswerChosenNotification({
    question,
    bestAnswerId,
  }: QuestionBestQuestionChosenEvent) {
    const resp = await this.answersRepository.getById(bestAnswerId.value)

    if (!resp) return left(new ResourceNotFoundError())

    const { answer } = resp

    await this.sendNotificationUseCase.execute({
      recipientId: answer.authorId.value,
      title: `Sua resposta foi escolhida`,
      content: `A resposta que você criou em ${question.title.substring(0, 20).concat('...')} foi escolhida pelo autor da pergunta como a melhor resposta`,
    })
  }
}
