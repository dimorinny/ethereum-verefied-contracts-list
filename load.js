#!/usr/bin/env node

const {loadAddresses, loadContracts} = require('./loader/api')
const {writeFileAsync, readFileAsync} = require('./loader/util/file')

const args = require('yargs')
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
    async ({output, from, to}) => {
      console.log(`Start loading addresses from etherscan for pages from ${from} to ${to}...`)

      loadAddresses(from, to)
        .then(addresses => {
          console.log(`Save ${addresses.length} addresses to ${output}...`)
          writeFileAsync(output, JSON.stringify(addresses, null, 4))
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
      }
    },
    ({input}) => {
      readFileAsync(input)
        .then(addresses => JSON.parse(addresses))
        .then(addresses => {
          console.log(`Start loading ${addresses.length} contracts from etherscan...`)
          return loadContracts(addresses)
        })
        .then(contracts => console.log(contracts))
        .catch(e => {
          console.error(e)
          process.exit(1)
        })
    }
  )
  .argv
