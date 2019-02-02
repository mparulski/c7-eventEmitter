import getEmit from './helpers/getEmit'

describe('Turning off events', () => {
  const testCases = [['event1', () => 1]]
  test.each(testCases)('Should return an eventEmitter`s instance', (eventName, callback) => {
    const emit = getEmit()

    emit.on(eventName, callback)

    expect(emit.off(eventName)).toEqual(emit)
  })

  test('Should turn off all event`s callbacks', () => {
    const emit = getEmit()

    const cb1 = () => 1
    const cb2 = () => 2

    const expected = []
    emit.on('event1', cb1).on('event1', cb2)
    emit.off('event1')

    expect(emit.getEventCallbacks('event1')).toEqual(expected)
  })

  test('Should turn off event`s callbacks', () => {
    const emit = getEmit()

    const cb1 = () => 1
    const cb2 = () => 2

    const expected = [cb2]
    emit.on('event1', cb1).on('event1', cb2)
    emit.off('event1', cb1)

    expect(emit.getEventCallbacks('event1')).toEqual(expected)
  })
})

describe('Event unregistration for unexpected eventName`s value', () => {
  test('Should throw a TypeError for empty event`s name', () => {
    const emit = getEmit()
    const expectedTypeError = 'An event`s name cannot be empty'

    expect(() => {
      emit.off('')
    }).toThrow(TypeError(expectedTypeError))
  })

  test('Should throw a TypeError for not passed parameters', () => {
    const emit = getEmit()
    const expectedTypeError = 'An event`s name must be a string'

    expect(() => {
      emit.off()
    }).toThrow(TypeError(expectedTypeError))
  })

  let testCases = [[null], [1], [() => {}], [['event']]]
  test.each(testCases)('Should throw a TypeError for incorrect event`s name', eventName => {
    const emit = getEmit()
    const expectedTypeError = 'An event`s name must be a string'

    expect(() => {
      emit.off(eventName)
    }).toThrow(TypeError(expectedTypeError))
  })

  testCases = [['eventToUnregister']]
  test.each(testCases)('Should throw a TypeError for not existing event`s name', eventName => {
    const emit = getEmit()
    const expectedTypeError = 'An event does not exist'

    expect(() => {
      emit.off(eventName)
    }).toThrow(TypeError(expectedTypeError))
  })
})

describe('Event unregistration for unexpected callback`s value', () => {
  const testCases = [['eventToUnregister10', 'string'], ['eventToUnregister10', null], ['eventToUnregister10', {}]]
  test.each(testCases)('Should throw a TypeError for incorrect callback`s parameter', (eventName, callback) => {
    const emit = getEmit()
    const expectedTypeError = 'A callback must be a function'
    emit.on('eventToUnregister10', () => {})

    expect(() => {
      emit.off(eventName, callback)
    }).toThrow(TypeError(expectedTypeError))
  })

  test('Should throw a TypeError for not existing callback', () => {
    const emit = getEmit()
    const expectedTypeError = 'A callback does not exist'

    const cb1 = () => 1
    const cb2 = () => 2

    emit.on('event', cb1)

    expect(() => {
      emit.off('event', cb2)
    }).toThrow(TypeError(expectedTypeError))
  })
})
