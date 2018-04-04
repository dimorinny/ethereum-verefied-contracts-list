const {generateCompilationInput} = require('./input')
const {parseCompilationOutput} = require('./output')

class LocalByteCodeResolver {
  constructor (configuration, compilerRegistry) {
    this.data = configuration
    this.compilerRegistry = compilerRegistry
  }

  async resolve () {
    const compiler = await this.compilerRegistry.provide(this.data.compiler.full)
    const compilationInput = await generateCompilationInput(this.data)

    const compilationResult = compiler.compileStandardWrapper(
      compilationInput
    )

    return parseCompilationOutput(this.data, compilationResult)
  }
}

module.exports = {
  LocalByteCodeResolver
}
