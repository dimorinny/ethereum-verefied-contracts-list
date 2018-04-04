const jp = require('jsonpath')

function parseCompilationOutput (configuration, compilationResult) {
  const compilationResultJson = JSON.parse(compilationResult)

  const deployedByteCodeResult = jp.query(
    compilationResultJson,
    `$..${configuration.contractName}.evm.deployedBytecode.object`
  )
  const abiResult = jp.query(
    compilationResultJson,
    `$..${configuration.contractName}.abi`
  )

  if (!abiResult || !deployedByteCodeResult) {
    throw new Error(`Deployed bytecode or abi not found in compilation output. Output: ${compilationResult}`)
  }

  return new CompilationResult(
    deployedByteCodeResult[0],
    JSON.stringify(abiResult[0])
  )
}

class CompilationResult {
  constructor (bytecode, abi) {
    this.bytecode = bytecode
    this.abi = abi
  }
}

module.exports = {
  parseCompilationOutput
}
