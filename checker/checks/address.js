const path = require('path')
const yaml = require('js-yaml')
const fs = require('fs-extra')

const CONFIGURATION_FILE_NAME = 'contract.yaml'
const CONFIGURATION_CONTRACT_ADDRESS_FIELD = 'contract-address'

async function checkAddress (registry, folder) {
  const configurationPath = path.join(folder, CONFIGURATION_FILE_NAME)

  if (!fs.existsSync(configurationPath)) {
    registry.addProblem(
      createProblem(
        `configuration file ${configurationPath} is not exist`
      )
    )
    return
  }

  const configurationContent = await fs.readFile(configurationPath)
  const configuration = yaml.safeLoad(configurationContent)

  const folderName = path.basename(folder)
  const configurationContractAddressValue = configuration[CONFIGURATION_CONTRACT_ADDRESS_FIELD]

  if (configurationContractAddressValue !== folderName) {
    registry.addProblem(
      createProblem(
        `Failed to match folder name: ${folderName} and contract address: ${configurationContractAddressValue}`
      )
    )
  }
}

function createProblem (message) {
  return `There were problem on Check Address step: ${message}`
}

module.exports = {
  checkAddress
}
