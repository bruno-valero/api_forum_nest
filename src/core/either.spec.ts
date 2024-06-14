import { Either, left, right } from './either'

function doSomething(shouldSucceed?: boolean): Either<string, number> {
  if (shouldSucceed) return right(2)
  return left('error')
}

describe('either (error handling) tests', () => {
  it('should return succes', () => {
    const success = doSomething(true)

    if (success.isRight()) {
      const data = success.value
      expect(data).toEqual(expect.any(Number))
    }

    expect(success.isRight()).toEqual(true)
    expect(success.isLeft()).toEqual(false)
  })

  it('should return error', () => {
    const error = doSomething()

    if (error.isLeft()) {
      const data = error.value
      expect(data).toEqual(expect.any(String))
    }

    expect(error.isRight()).toEqual(false)
    expect(error.isLeft()).toEqual(true)
  })
})
