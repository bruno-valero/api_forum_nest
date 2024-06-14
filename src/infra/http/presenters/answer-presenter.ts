import Answer from '@/domain/forum/enterprise/entities/answer'

export class AnswerPresenter {
  static toHTTP(answer: Answer) {
    return {
      content: answer.content,
      excerpt: answer.excerpt,
      createdAt: answer.createdAt,
      updatedAt: answer.updatedAt,
    }
  }
}
