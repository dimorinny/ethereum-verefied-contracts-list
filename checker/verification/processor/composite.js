/**
 * Combine multiple byte code processors.
 */
class CompositeByteCodeProcessor {
  constructor (processors) {
    this.processors = processors ? processors : []
  }

  add (processor) {
    this.processors.push(processor)
  }

  process (byteCode) {
    return this.processors.reduce((code, processor) => processor.process(code), byteCode)
  }
}

module.exports = {
  CompositeByteCodeProcessor
}
