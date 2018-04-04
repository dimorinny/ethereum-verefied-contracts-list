const {loadSolcCompiler} = require('../../util/solc')
const {generateCompilationInput} = require('./input')
const {parseCompilationOutput} = require('./output')

class LocalByteCodeResolver {
  constructor (configuration) {
    this.data = configuration
  }

  async resolve () {
    const compiler = await loadSolcCompiler(this.data.compiler.full)
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
