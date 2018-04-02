#!/usr/bin/env node

const {join} = require('path')
const Parallel = require('async-parallel')
const fs = require('fs-extra')
const {loadAddresses, loadContracts} = require('./loader/api')
const {directoryExists} = require('./loader/util/file')

const SAVE_CONTRACTS_DATA_POOL_SIZE = 5

require('yargs')
  .usage('Usage: $0 <cmd> [options]')
  .help('help')
  .alias('help', 'h')
  .command(
    'fetch-addresses [options]',
    'Fetch addresses from etherscan',
    {
      output: {
        describe: 'Addresses output json path',
        default: 'output.json',
        type: 'string',
        required: true
      },
      from: {
        describe: 'Start etherscan page',
        default: 0,
        type: 'int',
        required: true
      },
      to: {
        describe: 'Last etherscan page',
        type: 'number',
        required: false
      }
    },
    ({output, from, to}) => {
      console.log(`Start loading addresses from etherscan for pages from ${from} to ${to}...`)

      loadAddresses(from, to)
        .then(addresses => {
          console.log(`Save ${addresses.length} addresses to ${output}...`)
          fs.writeJson(output, addresses)
        })
        .catch(e => {
          console.error(e)
          process.exit(1)
        })
    }
  )
  .command(
    'fetch-contracts [options]',
    'Fetch contracts from etherscan',
    {
      input: {
        describe: 'Json file with addresses, that fetched by fetch-addresses command',
        default: 'input.json',
        type: 'string',
        required: true
      },
      output: {
        describe: 'Directory with contracts',
        default: 'contracts',
        type: 'string',
        required: true
      }
    },
    ({input, output}) => {
      fs.readJson(input)
        .then(addresses => addresses.filter(address => !directoryExists(
          join(output, address)
        )))
        .then(addresses => {
          console.log(`Start loading ${addresses.length} contracts from etherscan...`)
          return loadContracts(addresses)
        })
        .then(contracts => {
          console.log(`Loaded ${contracts.length} contracts. Saving to ${output} directory...`)
          return Parallel.invoke(
            contracts.map(contract => async () => {
              console.log(`Saving contract ${contract.address}...`)
              contract.save(output)
            }),
            SAVE_CONTRACTS_DATA_POOL_SIZE
          )
        })
        .catch(e => {
          console.error(e)
          process.exit(1)
        })
    }
  )
  .argv
