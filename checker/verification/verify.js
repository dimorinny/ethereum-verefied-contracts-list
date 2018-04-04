const {resolveProcessor} = require('./processor/resolver')
const {ContractData} = require('./resolver/local/configuration/configuration')
const {LocalByteCodeResolver} = require('./resolver/local/local')
const {BlockChainByteCodeResolver} = require('./resolver/blockchain')

async function verify (path) {
  const configuration = await ContractData.load(path)

  const localRemoteProcessor = resolveProcessor(configuration.compiler)

  const localResolver = new LocalByteCodeResolver(configuration)
  const remoteResolver = new BlockChainByteCodeResolver(configuration.network)

  const compilationResult = await localResolver.resolve()
  const abi = compilationResult.abi

  const localByteCode = compilationResult.bytecode
  const remoteByteCode = await remoteResolver.resolve(configuration.contractAddress)

  const processedLocal = localRemoteProcessor.process(localByteCode)
  const processedRemote = localRemoteProcessor.process(remoteByteCode)

  return new VerificationResult(
    processedLocal,
    processedRemote,
    abi
  )
}

class VerificationResult {
  constructor (localByteCode, remoteByteCode, abi) {
    this.localByteCode = localByteCode
    this.remoteByteCode = remoteByteCode
    this.abi = abi
  }
}

module.exports = {
  verify
}
