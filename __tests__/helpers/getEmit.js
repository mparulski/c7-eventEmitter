import emit from '../../src/eventEmitter/eventEmitter'

const cloneEmitFn = emit.bind({})

export default () => Object.assign(cloneEmitFn, emit)
