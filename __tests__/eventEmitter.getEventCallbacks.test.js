import getEmit from './helpers/getEmit'

describe('Get event`s callbacks for expected parameters', () => {
  test('Should return a map of callbacks', () => {
    const emit = getEmit()

    const cb1 = () => 1
    const cb2 = () => 2
    const cb3 = () => 3

    const expected = [cb1, cb2]

    emit.on('event1', cb1).on('event1', cb2)
    emit.on('event2', cb3)

    expect(emit.getEventCallbacks('event1')).toEqual(expected)
  })
})

describe('Get event`s callbacks for unexpected event`s name value', () => {
  test('Should throw a TypeError for empty event`s name', () => {
    const emit = getEmit()
    const expectedTypeError = 'An event`s name cannot be empty'

    expect(() => {
      emit.getEventCallbacks('')
    }).toThrow(TypeError(expectedTypeError))
  })

  test('Should throw a TypeError for not passed parameters', () => {
    const emit = getEmit()
    const expectedTypeError = 'An event`s name must be a string'

    expect(() => {
      emit.getEventCallbacks()
    }).toThrow(TypeError(expectedTypeError))
  })

  let testCases = [[null], [1], [() => {}], [['event']]]
  test.each(testCases)('Should throw a TypeError for incorrect event`s name', eventName => {
    const emit = getEmit()
    const expectedTypeError = 'An event`s name must be a string'

    expect(() => {
      emit.getEventCallbacks(eventName)
    }).toThrow(TypeError(expectedTypeError))
  })

  testCases = [['eventToUnregister']]
  test.each(testCases)('Should throw a TypeError for not existing event', eventName => {
    const emit = getEmit()
    const expectedTypeError = 'An event does not exist'

    expect(() => {
      emit.getEventCallbacks(eventName)
    }).toThrow(TypeError(expectedTypeError))
  })
})
