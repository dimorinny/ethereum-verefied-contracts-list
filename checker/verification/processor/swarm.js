/**
 * Processor for byte code compiled by solc 0.4.6 or higher.
 * After this version solc compiler started to adding swarm metadata to bytecode.
 * We should remove it before comparing, because this data specific for
 * local compilation environment.
 */
class SwarmMetadataStripper {
  process (byteCode) {
    return byteCode.replace(
      new RegExp(
        `${SwarmMetadataStripper.SWARM_PREFIX}.{${SwarmMetadataStripper.SWARM_LENGTH}}`,
        'g'
      ),
      ''
    )
  }
}

SwarmMetadataStripper.SWARM_LENGTH = 64
SwarmMetadataStripper.SWARM_PREFIX = 'a165627a7a72305820'

module.exports = {
  SwarmMetadataStripper
}
