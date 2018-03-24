const {verify} = require('ethereum-contract-verifier/lib/verify')

async function checkContract (registry, folder) {
  try {
    const verified = await verify(folder)

    if (!verified) {
      registry.addProblem(
        createProblem(`contract ${folder} not verified with their remote version`)
      )
    }
  } catch (e) {
    registry.addProblem(
      createProblem(`something went wrong during verifying contract ${folder}`)
    )
  }
}

function createProblem (message) {
  return `There were problem on Check contract step: ${message}`
}

module.exports = {
  checkContract
}
