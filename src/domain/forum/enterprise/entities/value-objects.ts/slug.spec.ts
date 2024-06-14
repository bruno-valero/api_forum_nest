import Slug from './slug'

beforeAll(() => {})

afterAll(() => {})

describe('Slug Value Object', () => {
  it('should be able to create a slug from a text', async () => {
    const slug = new Slug('teste-de-slug')

    expect(slug).toBeInstanceOf(Slug)
    console.log('slug.value', slug.value)
    expect(slug.value).toEqual('teste-de-slug')
  })
})
