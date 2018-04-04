const {CompositeByteCodeProcessor} = require('./composite')
const {SwarmMetadataStripper} = require('./swarm')

const COMPILER_WITH_SWARM_METADATA_VERSION = 47

function addVersionSpecificProcessors (solcVersion, compositeProcessor) {
  if (solcVersion.toNumber() >= COMPILER_WITH_SWARM_METADATA_VERSION) {
    compositeProcessor.add(new SwarmMetadataStripper())
  }
}

function resolveProcessor (solcVersion) {
  const compositeProcessor = new CompositeByteCodeProcessor()
  addVersionSpecificProcessors(solcVersion, compositeProcessor)
  return compositeProcessor
}

module.exports = {
  resolveProcessor
}
