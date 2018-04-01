#!/usr/bin/env node

const Parallel = require('async-parallel')
const {checkAddress} = require('./checker/checks/address')
const {checkContract} = require('./checker/checks/contract')
const {provideContractsList} = require('./checker/contracts')
const {ProblemsRegistry} = require('./checker/problems')

const PARALLEL_POOL_SIZE = 5

async function check (registry, contracts) {
  await Parallel.invoke(
    contracts.map(contract => async () => {
      console.log(`Starting analyzing contract: ${contract}...`)

      console.log('Check Address step starting...')
      await checkAddress(registry, contract)
      console.log('Check Address step completed')

      console.log('Check Contract step starting...')
      await checkContract(registry, contract)
      console.log('Check Contract step completed')
    }),
    PARALLEL_POOL_SIZE
  )
}

const registry = new ProblemsRegistry()
const contracts = provideContractsList('contracts')

console.log(`Found ${contracts.length} changed (or added) contracts`)

check(registry, contracts)
  .then(() => {
    const passed = registry.printAndGetResult()

    if (passed) {
      process.exit(0)
    } else {
      process.exit(1)
    }
  })
