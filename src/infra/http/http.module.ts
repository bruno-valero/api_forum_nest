import { Module } from '@nestjs/common'
import { ListQuestionsController } from './controllers/question-controllers/list-questions.controller'
import { CreateAccountController } from './controllers/account-controllers/create-account.controller'
import { AuthenticateController } from './controllers/account-controllers/authenticate.controller'
import { CreateQuestionController } from './controllers/question-controllers/create-question.controller'
import { DatabaseModule } from '../database/database.module'
import CreateQuestionUseCase from '@/domain/forum/application/use-cases/create-question-use-case'
import FetchRecentQuestionsUseCase from '@/domain/forum/application/use-cases/fetch-recent-questions-use-case'
import AuthenticateStudentUseCase from '@/domain/forum/application/use-cases/authenticate-student-use-case'
import { CryptographyModule } from '../cryptography/cryptography.module'
import RegisterStudentUseCase from '@/domain/forum/application/use-cases/register-student-use-case'
import { GetQuestionBySlugController } from './controllers/question-controllers/get-question-by-slug.controller'
import GetQuestionBySlugUseCase from '@/domain/forum/application/use-cases/get-question-by-slug-use-case'
import EditQuestionUseCase from '@/domain/forum/application/use-cases/edit-question-use-case'
import { EditQuestionController } from './controllers/question-controllers/edit-question.controller'
import DeleteQuestionUseCase from '@/domain/forum/application/use-cases/delete-question-use-case'
import { DeleteQuestionController } from './controllers/question-controllers/delete-question.controller'
import AnswerQuestionUseCase from '@/domain/forum/application/use-cases/answer-questions'
import DeleteAnswerUseCase from '@/domain/forum/application/use-cases/delete-answer-use-case'
import EditAnswerUseCase from '@/domain/forum/application/use-cases/edit-answer-use-case'
import { AnswerQuestionController } from './controllers/answer-controllers/answer-question.controller'
import { DeleteAnswerController } from './controllers/answer-controllers/delete-answer.controller'
import { EditAnswerController } from './controllers/answer-controllers/edit-answer.controller'
import { ListAnswersController } from './controllers/answer-controllers/list-answer.controller'
import FetchQuestionAnswerUseCase from '@/domain/forum/application/use-cases/fetch-question-answers-use-case'
import ChooseBestAnswerUseCase from '@/domain/forum/application/use-cases/choose-best-answer-use-case'
import { ChooseBestAnswerController } from './controllers/answer-controllers/choose-best-answer.controller'
import { CommentOnAnswerController } from './controllers/answer-controllers/answer-comments-controllers/comment-on-answer.controller'
import CommentOnAnswerUseCase from '@/domain/forum/application/use-cases/comment-on-answer'
import { DeleteCommentOnAnswerController } from './controllers/answer-controllers/answer-comments-controllers/delete-comment-on-answer.controller'
import DeleteCommentOnAnswerUseCase from '@/domain/forum/application/use-cases/delete-comment-on-answer'
import { FetchAnswerCommentsController } from './controllers/answer-controllers/answer-comments-controllers/fetch-answer-comments.controller'
import FetchAnswerCommentsUseCase from '@/domain/forum/application/use-cases/fetch-answer-comments'
import { CommentOnQuestionController } from './controllers/question-controllers/question-comments-controllers/comment-on-question.controller'
import CommentOnQuestionUseCase from '@/domain/forum/application/use-cases/comment-on-question'
import { DeleteCommentOnQuestionController } from './controllers/question-controllers/question-comments-controllers/delete-comment-on-question.controller'
import DeleteCommentOnQuestionUseCase from '@/domain/forum/application/use-cases/delete-comment-on-question'
import { FetchQuestionCommentsController } from './controllers/question-controllers/question-comments-controllers/fetch-question-comments.controller'
import FetchQuestionCommentsUseCase from '@/domain/forum/application/use-cases/fetch-question-comments'
import { StorageModule } from '../storage/storage.module'
import { UploadAndCreateAttachmentController } from './controllers/upload-controllers/upload-attachment.controller'
import UploadAndCreateAttachmentUseCase from '@/domain/forum/application/use-cases/upload-and-create-attachments'
import { ReadNotificationController } from './controllers/notification-controllers/read-notification.controller'
import ReadNotificationUseCase from '@/domain/notification/application/use-cases/read-notification'

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,

    // questions - controllers
    ListQuestionsController,
    GetQuestionBySlugController,
    EditQuestionController,
    DeleteQuestionController,
    CommentOnQuestionController,
    DeleteCommentOnQuestionController,
    FetchQuestionCommentsController,

    // answers - controllers
    AnswerQuestionController,
    DeleteAnswerController,
    EditAnswerController,
    ListAnswersController,
    ChooseBestAnswerController,
    CommentOnAnswerController,
    DeleteCommentOnAnswerController,
    FetchAnswerCommentsController,

    // upload
    UploadAndCreateAttachmentController,

    // notification
    ReadNotificationController,
  ],
  providers: [
    AuthenticateStudentUseCase,
    RegisterStudentUseCase,
    GetQuestionBySlugUseCase,

    // questions - use cases
    CreateQuestionUseCase,
    EditQuestionUseCase,
    DeleteQuestionUseCase,
    FetchRecentQuestionsUseCase,
    CommentOnQuestionUseCase,
    DeleteCommentOnQuestionUseCase,
    FetchQuestionCommentsUseCase,

    // answers - use cases
    AnswerQuestionUseCase,
    DeleteAnswerUseCase,
    EditAnswerUseCase,
    FetchQuestionAnswerUseCase,
    ChooseBestAnswerUseCase,
    CommentOnAnswerUseCase,
    DeleteCommentOnAnswerUseCase,
    FetchAnswerCommentsUseCase,

    // upload
    UploadAndCreateAttachmentUseCase,

    // notification
    ReadNotificationUseCase,
  ],
})
export class HttpModule {}
