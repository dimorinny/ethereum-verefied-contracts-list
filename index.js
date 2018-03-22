const {checkAddress} = require('./checker/checks/address')
const {provideChangedContractsList} = require('./checker/contracts')
const {ProblemsRegistry} = require('./checker/problems')

async function check (registry, contracts) {
  for (const contract of contracts) {
    console.log(`Starting analyzing contract: ${contract}...`)

    console.log('Check Address step starting...')
    await checkAddress(registry, contract)
    console.log('Check Address step completed')
  }
}

const registry = new ProblemsRegistry()
const contracts = provideChangedContractsList('contracts')

console.log(`Found ${contracts.length} changed (or added) contracts`)

check(registry, contracts)
  .then(() => registry.exit())
