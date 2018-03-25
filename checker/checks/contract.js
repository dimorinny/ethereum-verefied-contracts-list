const path = require('path')
const {verify} = require('ethereum-contract-verifier/lib/verify')
const {writeFileAsync} = require('../util/file')

const ABI = 'abi.json'

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
    await saveAbi(folder, verificationResult)
  } catch (e) {
    registry.addProblem(
      createProblem(`something went wrong during verifying contract ${folder}. Error: ${e}`)
    )
  }
}

async function saveAbi (folder, verificationResult) {
  await writeFileAsync(
    path.join(folder, ABI),
    verificationResult.abi
  )
}

function createProblem (message) {
  return `There were problem on Check contract step: ${message}`
}

module.exports = {
  checkContract
}
