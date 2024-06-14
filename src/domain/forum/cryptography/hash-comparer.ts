export abstract class HashComparer {
  abstract compare(painText: string, hash: string): Promise<boolean>
}
