const cheerio = require('cheerio')
const fetch = require('node-fetch')
const retry = require('async-retry')

async function wait (timeout) {
  await new Promise((resolve) => setTimeout(resolve, timeout))
}

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
    await wait(1000)
  }

  return result
}

// async function getContractValues (address) {
//   const values = { address }
//
//   const html = await getHTML(`https://etherscan.io/address/${address}`)
//   const $ = cheerio.load(html)
//
//   const table = $('div#ContentPlaceHolder1_contractCodeDiv table')
//   values.name = $($(table[0]).find('td')[1]).text().trim()
//   values.compiler = $($(table[0]).find('td')[3]).text().trim()
//   values.optimizer = parseInt($($(table[1]).find('td')[3]).text().trim(), 10)
//
//   const code = $('div#dividcode')
//   values.source = code.find('pre#editor').text().trim()
//   values.abi = code.find('pre#js-copytextarea2').text().trim()
//   values.bin = code.find('div#verifiedbytecode2').text().trim()
//   values.bzzr = code.find('.wordwrap').last().text().trim()
//
//   return values
// }

module.exports = {
  loadAddresses
}
