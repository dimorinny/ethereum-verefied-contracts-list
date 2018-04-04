const path = require('path')
const yaml = require('js-yaml')
const schema = require('./configuration-schema.json')
const Ajv = require('ajv')
const Version = require('../solc/version')
const {readFileAsync} = require('../../../util/file')

class ContractData {
  constructor (contractName, entrypoint, contractAddress, network, sources, compiler, optimizationRuns) {
    this.contractName = contractName
    this.entrypoint = entrypoint
    this.contractAddress = contractAddress
    this.network = network
    this.sources = sources
    this.compiler = compiler
    this.optimizationRuns = optimizationRuns
  }
}

ContractData.load = async function (contractPath) {
  const content = await readFileAsync(path.join(contractPath, 'contract.yaml'))
  const configuration = yaml.safeLoad(content)

  validateConfiguration(configuration)

  return new ContractData(
    configuration['contract-name'],
    configuration['entrypoint'],
    configuration['contract-address'],
    configuration['network'],
    path.join(contractPath, 'src'),
    Version.parse(configuration['compiler']),
    configuration['optimization-runs']
  )
}

function validateConfiguration (configuration) {
  const ajv = new Ajv()
  const validate = ajv.compile(schema)

  if (!validate(configuration)) {
    throw Error(ajv.errorsText(validate.errors))
  }
}

module.exports = {
  ContractData
}
