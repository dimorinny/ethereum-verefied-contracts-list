const {checkAddress} = require('./checker/checks/address')
const {ProblemsRegistry} = require('./checker/problems')

const registry = new ProblemsRegistry()

console.log('Check Address step starting...')
checkAddress(registry, 'contracts/0x0b1225323ff8dafee69643068bedbb0e351b8271')
  .then(() => console.log('Check Address step completed'))
  .then(() => registry.exit())
