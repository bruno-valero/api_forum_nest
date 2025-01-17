import { randomUUID } from 'node:crypto'

import {
  UploadParams,
  Uploader,
} from '@/domain/forum/application/storage/uploader'
import { Injectable } from '@nestjs/common'
import { EnvService } from '../env/env.service'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

@Injectable()
export class R2Storage implements Uploader {
  private client: S3Client

  constructor(private envService: EnvService) {
    const accountId = envService.get('CLOUDFARE_R2_ACCOUNT_ID')

    this.client = new S3Client({
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      region: 'auto',
      credentials: {
        accessKeyId: envService.get('AWS_STORAGE_API_KEY'),
        secretAccessKey: envService.get('AWS_STORAGE_SECRET_API_KEY'),
      },
    })
  }

  async upload({
    fileName,
    fileType,
    body,
  }: UploadParams): Promise<{ url: string }> {
    const uploadId = randomUUID()
    const uniqueFileName = `${uploadId}-${fileName}`

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.envService.get('AWS_BUCKET_NAME'),
        Key: uniqueFileName,
        ContentType: fileType,
        Body: body,
      }),
    )

    return {
      url: uniqueFileName,
    }
  }
}
