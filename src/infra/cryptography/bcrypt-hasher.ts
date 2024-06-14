import { HashComparer } from '@/domain/forum/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/forum/cryptography/hash-generator'
import { Injectable } from '@nestjs/common'
import bcrypt from 'bcryptjs'

@Injectable()
export class BcryptHasher implements HashGenerator, HashComparer {
  private HASH_SALT_LENGTH = 8
  async hash(painText: string): Promise<string> {
    return await bcrypt.hash(painText, this.HASH_SALT_LENGTH)
  }

  async compare(painText: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(painText, hash)
  }
}
