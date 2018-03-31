const cheerio = require('cheerio')

class Contract {
  constructor (address, name, sources, abi, compiler, optimizations) {
    this.address = address
    this.name = name
    this.sources = sources
    this.abi = abi
    this.compiler = compiler
    this.optimizations = optimizations
  }
}

const TABLE_SELECTOR = 'div#ContentPlaceHolder1_contractCodeDiv table'
const OPTIMIZATION_FLAG_SELECTOR = '#ContentPlaceHolder1_contractCodeDiv > div:nth-child(3) > ' +
  'table > tbody > tr:nth-child(1) > td:nth-child(2)'

const CODE_SELECTOR = 'div#dividcode'
const SOURCES_SELECTOR = 'pre#editor'
const ABI_SELECTOR = 'pre#js-copytextarea2'

Contract.fromHtml = function (address, html) {
  const $ = cheerio.load(html)

  const table = $(TABLE_SELECTOR)

  const name = $($(table[0]).find('td')[1]).text().trim()
  const compiler = $($(table[0]).find('td')[3]).text().trim()
  const optimizations = parseInt($($(table[1]).find('td')[3]).text().trim())

  const isOptimize = $(OPTIMIZATION_FLAG_SELECTOR).text().trim() === 'Yes'

  const code = $(CODE_SELECTOR)
  const sources = code.find(SOURCES_SELECTOR).text().trim()
  const abi = code.find(ABI_SELECTOR).text().trim()

  return new Contract(
    address,
    name,
    sources,
    abi,
    compiler,
    isOptimize ? optimizations : undefined
  )
}

module.exports = {
  Contract
}
