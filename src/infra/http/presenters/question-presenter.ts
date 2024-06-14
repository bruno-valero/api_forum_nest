import Question from '@/domain/forum/enterprise/entities/question'

export interface QuestionPresenterToHTTPResponse {
  id: string
  title: string
  slug: string
  bestAnswerId: string | null
  createdAt: Date
  updatedAt: Date | null | undefined
}

export class QuestionPresenter {
  static toHTTP(question: Question): QuestionPresenterToHTTPResponse {
    return {
      id: question.id.value,
      title: question.title,
      slug: question.slug.value,
      bestAnswerId: question.bestAnsweredId?.value ?? null,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    }
  }
}
