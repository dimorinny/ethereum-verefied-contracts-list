const path = require('path')
const fs = require('fs-extra')
const {verify} = require('../verification/verify')

async function checkContract (registry, folder) {
  try {
    const verificationResult = await verify(folder)

    if (verificationResult.localByteCode !== verificationResult.remoteByteCode) {
      registry.addProblem(
        createProblem(
          `contract ${folder} not verified with their remote version.
Local byte code: ${verificationResult.localByteCode}
Remote byte code: ${verificationResult.remoteByteCode}`
        )
      )
      return
    }

    await checkAbi(registry, folder, verificationResult)

  } catch (e) {
    registry.addProblem(
      createProblem(`something went wrong during verifying contract ${folder}. Error: ${e}`)
    )
  }
}

const ABI_FILE_NAME = 'abi.json'

async function checkAbi (registry, folder, verificationResult) {
  try {
    const abiPath = path.join(folder, ABI_FILE_NAME)

    if (!fs.existsSync(abiPath)) {
      registry.addProblem(
        createProblem(
          `abi file ${abiPath} is not exist`
        )
      )
      return
    }

    const abiContent = await fs.readFile(abiPath)
    const abi = JSON.parse(abiContent)
    const compiledAbi = JSON.parse(verificationResult.abi)

    if (JSON.stringify(abi) !== JSON.stringify(compiledAbi)) {
      registry.addProblem(
        createProblem(
          `Failed to match local abi: ${abiContent} and generated abi: ${verificationResult.abi}`
        )
      )
    }
  } catch (e) {
    registry.addProblem(
      createProblem(`something went wrong during verifying abi for contract ${folder}. Error: ${e}`)
    )
  }
}

function createProblem (message) {
  return `There were problem on Check contract step: ${message}`
}

module.exports = {
  checkContract
}
