#!/usr/bin/env node

const {loadAddresses} = require('./loader/api')
const {writeFileAsync} = require('./loader/util/file')

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
      const addresses = await loadAddresses(from, to)

      console.log(`Save ${addresses.length} addresses to ${output}...`)
      await writeFileAsync(output, JSON.stringify(addresses, null, 4))
    }
  )
  .argv
