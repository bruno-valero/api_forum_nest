import { Encrypter } from '../encrypter'

export class FakeEncrypter extends Encrypter {
  async encrypt(payload: Record<string, unknown>): Promise<string> {
    return payload.sub as string
  }
}
