import getEmit from './helpers/getEmit'

describe('Event registration for expected parameters', () => {
  const testCases = [['event1', () => 1], ['event1', arg => arg]]

  test.each(testCases)('Should return an eventEmitter`s instance', (eventName, callback) => {
    const emit = getEmit()
    expect(emit.once(eventName, callback)).toEqual(emit)
  })

  test('Should register callbacks', () => {
    const emit = getEmit()

    const cb1 = () => 1
    const cb2 = () => 2

    const expected = [cb1, cb2]
    emit.once('event2', cb1).once('event2', cb2)

    expect(emit.getEventCallbacks('event2')).toEqual(expected)
  })
})

describe('Event registration for unexpected eventName`s value', () => {
  const emit = getEmit()
  let testCases = [['', () => {}]]

  test.each(testCases)('Should throw a TypeError for empty event`s name', (eventName, callback) => {
    const expectedTypeError = 'An event`s name cannot be empty'
    expect(() => {
      emit.once(eventName, callback)
    }).toThrow(TypeError(expectedTypeError))
  })

  test('Should throw a TypeError for not passed parameters', () => {
    const expectedTypeError = 'An event`s name must be a string'
    expect(() => {
      emit.once()
    }).toThrow(TypeError(expectedTypeError))
  })

  testCases = [[null, () => {}], [1, () => {}], [() => {}, () => {}], [['event'], () => {}]]
  test.each(testCases)('Should throw a TypeError for incorrect event`s name', (eventName, callback) => {
    const expectedTypeError = 'An event`s name must be a string'
    expect(() => {
      emit.once(eventName, callback)
    }).toThrow(TypeError(expectedTypeError))
  })
})

describe('Event registration for unexpected callback`s value', () => {
  const emit = getEmit()

  test('Should throw a TypeError for no callback', () => {
    const expectedTypeError = 'A callback must be a function'
    expect(() => {
      emit.once('event_name')
    }).toThrow(TypeError(expectedTypeError))
  })

  const testCases = [['event_name', 'string'], ['event_name', null], ['event_name', {}]]
  test.each(testCases)('Should throw a TypeError for incorrect callback`s value', (eventName, callback) => {
    const expectedTypeError = 'A callback must be a function'

    expect(() => {
      emit.once(eventName, callback)
    }).toThrow(TypeError(expectedTypeError))
  })
})
