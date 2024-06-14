export default class Slug {
  public value: string = ''

  constructor(value?: string) {
    if (value) {
      this.createFromText(value)
    }
  }

  /**
   * Receives a String and normalize it as a slug
   *
   * Example: "An Example Title" => "an-example-title"
   *
   *
   * @param text string
   * @returns slug
   */
  createFromText(text: string) {
    const slug = text
      .normalize('NFKD')
      .toLocaleLowerCase()
      .trim()
      .replaceAll(/ +/g, '-')
      .replaceAll(/\s+/g, '-')
      .replaceAll(/[^-^\w]+/g, '')
      .replaceAll(/_/g, '-')
      .replaceAll(/--+/g, '')
      .replaceAll(/-$/g, '')
      .replaceAll(/^-/g, '')

    this.value = slug
    return this
  }
}
