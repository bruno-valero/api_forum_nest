import { HashComparer } from '../hash-comparer'
import { HashGenerator } from '../hash-generator'

export class FakeHasher implements HashComparer, HashGenerator {
  async hash(plainText: string): Promise<string> {
    return plainText.concat('-hashed')
  }

  async compare(plainText: string, hash: string): Promise<boolean> {
    return plainText.concat('-hashed') === hash
  }
}
