import { Module } from '@nestjs/common'
import { BcryptHasher } from './bcrypt-hasher'
import { JWLWncrypter } from './jwt-encrypter'
import { HashComparer } from '@/domain/forum/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/forum/cryptography/hash-generator'
import { Encrypter } from '@/domain/forum/cryptography/encrypter'

@Module({
  providers: [
    {
      provide: HashComparer,
      useClass: BcryptHasher,
    },
    {
      provide: HashGenerator,
      useClass: BcryptHasher,
    },
    {
      provide: Encrypter,
      useClass: JWLWncrypter,
    },
  ],
  exports: [HashComparer, HashGenerator, Encrypter],
})
export class CryptographyModule {}
