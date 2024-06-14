import { PaginationParams } from '@/core/respositories/pagination-params'
import Question from '../../enterprise/entities/question'
import { QuestionDetails } from '../../enterprise/entities/value-objects.ts/question-details'

export default abstract class QuestionsRepository {
  abstract create(question: Question): Promise<{ question: Question }>
  abstract getById(id: string): Promise<{ question: Question } | null>
  abstract findDetailsBySlug(slug: string): Promise<QuestionDetails | null>
  abstract getBySlug(slug: string): Promise<{ question: Question } | null>
  abstract delete(questionId: string, authorId: string): Promise<void>
  abstract update(
    questionId: string,
    authorId: string,
    data: Question,
  ): Promise<{ question: Question }>

  abstract findManyRecent(
    params: PaginationParams,
  ): Promise<{ questions: Question[] }>
}
