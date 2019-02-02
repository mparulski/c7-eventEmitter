const _isFunction = value => typeof value === 'function'

const _events = new Map()
let _queue = []
let _isFire = false

const _checkEventName = eventName => {
  if (typeof eventName !== 'string') {
    throw new TypeError('An event`s name must be a string')
  }

  if (eventName === '') {
    throw new TypeError('An event`s name cannot be empty')
  }
}

const _checkEventNameExists = eventName => {
  if (!_events.has(eventName)) {
    throw new TypeError('An event does not exist')
  }
}

const _checkCallback = callback => {
  if (!_isFunction(callback)) {
    throw new TypeError('A callback must be a function')
  }
}

const _registerEventWithCallback = ({eventName, callback, isOnce}) => {
  _checkEventName(eventName)
  _checkCallback(callback)

  const callbackDefinition = {
    callback,
    isOnce
  }

  const eventCallbacks = new Set(_events.get(eventName))
  eventCallbacks.add(callbackDefinition)

  _events.set(eventName, eventCallbacks)
}

const _isNotSpecyfiedCallback = value => value === void 0

const _removeCallback = (eventName, callback) => {
  const eventCallbacksDefinitions = _events.get(eventName)
  const definitionToDelete = Array.from(eventCallbacksDefinitions).find(definition => definition.callback === callback)

  if (_isNotSpecyfiedCallback(definitionToDelete)) {
    throw new TypeError('A callback does not exist')
  }

  eventCallbacksDefinitions.delete(definitionToDelete)
}

const _call = () => {
  const queue = _queue.slice()
  _queue = []
  _isFire = false

  queue.forEach(event => {
    const eventCallbacksDefinitions = _events.get(event.eventName)

    eventCallbacksDefinitions.forEach(definition => {
      definition.callback(...event.args)

      if (definition.isOnce) {
        _removeCallback(event.eventName, definition.callback)
      }
    })
  })
}

const emit = (eventName, ...args) => {
  _checkEventName(eventName)
  _checkEventNameExists(eventName)

  _queue.push({
    eventName: eventName,
    args: args
  })

  if (!_isFire) {
    _isFire = true
    Promise.resolve().then(() => _call())
  }
}

const eventManager = {
  on(eventName, callback) {
    _registerEventWithCallback({eventName, callback, isOnce: false})

    return this
  },

  once(eventName, callback) {
    _registerEventWithCallback({eventName, callback, isOnce: true})

    return this
  },

  off(eventName, callback) {
    _checkEventName(eventName)
    _checkEventNameExists(eventName)

    if (_isNotSpecyfiedCallback(callback)) {
      _events.set(eventName, new Set())

      return this
    }

    _checkCallback(callback)

    _removeCallback(eventName, callback)

    return this
  },

  getEventCallbacks(eventName) {
    _checkEventName(eventName)
    _checkEventNameExists(eventName)

    const callbacksDefinitions = Array.from(_events.get(eventName))

    return callbacksDefinitions.map(definition => definition.callback)
  }
}

export default Object.assign(emit, eventManager)
