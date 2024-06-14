import { PaginationParams } from '@/core/respositories/pagination-params'
import Answer from '../../enterprise/entities/answer'

export default abstract class AnswersRepository {
  abstract create(answer: Answer): Promise<{ answer: Answer }>
  abstract getById(id: string): Promise<{ answer: Answer } | null>
  abstract delete(answerId: string, authorId: string): Promise<void>
  abstract update(
    answerId: string,
    authorId: string,
    data: Answer,
  ): Promise<{ answer: Answer }>

  abstract findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<{ answers: Answer[] }>
}
