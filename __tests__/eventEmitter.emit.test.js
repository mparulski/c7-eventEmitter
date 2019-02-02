import getEmit from './helpers/getEmit'

describe('Invoke emit() with expected parameters', () => {
  let testCases = [['event1', () => 1, getEmit()], ['event1', () => 2, getEmit()]]
  test.each(testCases)('Should return an eventEmitter`s instance', (eventName, callback, emit) => {
    emit.on(eventName, callback)
    expect(emit(eventName)).toBeUndefined()
  })
})

describe('Invoke emit() with unexpected parameters', () => {
  const emit = getEmit()

  let testCases = [['']]
  test.each(testCases)('Should throw a TypeError for empty event`s name', eventName => {
    const expectedTypeError = 'An event`s name cannot be empty'

    expect(() => {
      emit(eventName)
    }).toThrow(TypeError(expectedTypeError))
  })

  test('Should throw a TypeError for not passed parameters', () => {
    const expectedTypeError = 'An event`s name must be a string'
    expect(() => {
      emit()
    }).toThrow(TypeError(expectedTypeError))
  })

  testCases = [[null], [1], [() => {}], [['event']]]
  test.each(testCases)('Should throw a TypeError for incorrect value event`s name', eventName => {
    const expectedTypeError = 'An event`s name must be a string'

    expect(() => {
      emit(eventName)
    }).toThrow(TypeError(expectedTypeError))
  })

  testCases = [['noExistsEventName']]
  test.each(testCases)('Should throw a TypeError for not existing event', eventName => {
    const expectedTypeError = 'An event does not exist'

    expect(() => {
      emit(eventName)
    }).toThrow(TypeError(expectedTypeError))
  })
})
