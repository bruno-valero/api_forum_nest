import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { StudentAlreadyExistsError } from '@/core/errors/errors/student-already-exists-error'
import { Attachment } from '../../enterprise/entities/attachment'
import { AttachmentsRepository } from '../repositories/attachments-repository'
import { InvalidAttachmentTypeError } from '@/core/errors/errors/invalid-attatchment-type-error'
import { Uploader } from '../storage/uploader'

export interface UploadAndCreateAttachmentUseCaseRequest {
  fileName: string
  fileType: string
  body: Buffer
}

export type UploadAndCreateAttachmentUseCaseResponse = Either<
  StudentAlreadyExistsError,
  {
    attachment: Attachment
  }
>

@Injectable()
export default class UploadAndCreateAttachmentUseCase {
  constructor(
    private attachmentsRepository: AttachmentsRepository,
    private uploader: Uploader,
  ) {}

  async execute({
    body,
    fileName,
    fileType,
  }: UploadAndCreateAttachmentUseCaseRequest): Promise<UploadAndCreateAttachmentUseCaseResponse> {
    if (!/^(image\/(jpeg|png))$|^application\/pdf$/.test(fileType)) {
      return left(new InvalidAttachmentTypeError(fileType))
    }

    const { url } = await this.uploader.upload({ fileName, fileType, body })

    const attachment = Attachment.create({
      title: fileName,
      link: url,
    })

    await this.attachmentsRepository.create(attachment)

    return right({
      attachment,
    })
  }
}
