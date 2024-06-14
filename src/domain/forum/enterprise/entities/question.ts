import UniqueEntityId from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import dayjs from 'dayjs'
import Slug from './value-objects.ts/slug'
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { QuestionAttachmentList } from './question-attachment-list'
import { QuestionBestQuestionChosenEvent } from '../events/question-best-answer-chosen-event'

export interface QuestionProps {
  title: string
  authorId: UniqueEntityId
  content: string
  attachments: QuestionAttachmentList
  slug: Slug
  createdAt: Date
  updatedAt?: Date | null
  bestAnsweredId?: UniqueEntityId | null
}

export type QuestionCreateProps = Omit<
  Optional<QuestionProps, 'createdAt' | 'slug' | 'attachments'>,
  'authorId'
> & { authorId: string }

export default class Question extends AggregateRoot<QuestionProps> {
  static create(props: QuestionCreateProps, id?: UniqueEntityId) {
    return new Question(
      {
        ...props,
        slug: props.slug ?? new Slug(props.title),
        createdAt: props.createdAt ?? new Date(),
        authorId: new UniqueEntityId(props.authorId),
        attachments: props.attachments ?? new QuestionAttachmentList([]),
      },
      id,
    )
  }

  get title() {
    return this.props.title
  }

  get authorId() {
    return this.props.authorId
  }

  get content() {
    return this.props.content
  }

  get attachments() {
    return this.props.attachments
  }

  set attachments(attachments: QuestionAttachmentList) {
    this.props.attachments = attachments
    this.touch()
  }

  get slug(): Slug {
    return this.props.slug
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get bestAnsweredId() {
    return this.props.bestAnsweredId
  }

  get isNew(): boolean {
    return dayjs().diff(this.createdAt, 'day') <= 3
  }

  get excerpt() {
    return this.content.substring(0, 120).trimEnd().concat('...')
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  set content(text: string) {
    this.props.content = text
    this.touch()
  }

  set title(text: string) {
    this.props.title = text
    this.props.slug = new Slug(text)
    this.touch()
  }

  set slug(text: string) {
    this.props.slug = new Slug(text)
    this.touch()
  }

  set bestAnsweredId(bestAnsweredId: UniqueEntityId | undefined | null) {
    if (bestAnsweredId === undefined) return
    if (bestAnsweredId === null) return

    if (
      this.props.bestAnsweredId === undefined ||
      !this.props.bestAnsweredId?.equals(bestAnsweredId)
    ) {
      this.addDomainEvent(
        new QuestionBestQuestionChosenEvent(this, bestAnsweredId.value),
      )
    }

    this.props.bestAnsweredId = bestAnsweredId
    this.touch()
  }
}
