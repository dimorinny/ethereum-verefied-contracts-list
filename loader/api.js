const cheerio = require('cheerio')
const fetch = require('node-fetch')
const retry = require('async-retry')
const delay = require('delay')
const Parallel = require('async-parallel')
const {Contract} = require('./contract')

async function load (url) {
  return await retry(async () => {
    console.log(`Fetching data from ${url}`)
    const response = await fetch(url)
    return await response.text()
  }, {
    onRetry: (_, number) => {
      console.log(`Retrying request for ${url} (number : ${number})`)
    }
  })
}

async function loadAddressesForPage (page) {
  const html = await load(`https://etherscan.io/contractsVerified/${page}`)
  const $ = cheerio.load(html)
  return $('table tbody').first().find('tr').map((i, el) => $(el).find('a').text().toLowerCase()).get()
}

async function loadContractForAddress (address) {
  const html = await load(`https://etherscan.io/address/${address}`)
  return Contract.fromHtml(address, html)
}

async function loadAddresses (from, to) {
  let result = []
  let currentPage = from

  while (true) {
    console.log(`Fetching contracts for page: ${currentPage}`)
    const addresses = await loadAddressesForPage(currentPage)

    currentPage++

    if (addresses.length === 0 || (to && currentPage === to)) {
      break
    }

    result = result.concat(addresses)

    console.log(`Waiting for further fetching`)
    await delay(1000)
  }

  return result
}

const LOAD_CONTRACTS_PARALLEL_POOL_SIZE = 2

async function loadContracts (addresses) {
  const result = []

  await Parallel.invoke(addresses.map(address => async () => {
    console.log(`Starting loading contract for address: ${address}`)
    const loadedContract = await loadContractForAddress(address)
    result.push(loadedContract)
  }), LOAD_CONTRACTS_PARALLEL_POOL_SIZE)

  return result
}

module.exports = {
  loadAddresses,
  loadContracts
}
