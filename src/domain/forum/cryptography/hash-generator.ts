export abstract class HashGenerator {
  abstract hash(painText: string): Promise<string>
}
