const {join} = require('path')
const cheerio = require('cheerio')
const yaml = require('js-yaml')
const fs = require('fs-extra')
const {directoryExists} = require('./util/file')

class Contract {
  constructor (address, name, sources, abi, compiler, optimizations) {
    this.address = address
    this.name = name
    this.sources = sources
    this.abi = abi
    this.compiler = compiler
    this.optimizations = optimizations
  }

  async save (output) {
    const contractPath = join(output, this.address)
    const sources = 'sources.sol'

    if (directoryExists(contractPath)) {
      console.log(`${this.address} directory already exists. Doing nothing...`)
    } else {
      const sourcesPath = join(contractPath, 'src')
      const sourcesFilePath = join(sourcesPath, sources)
      const abiPath = join(contractPath, 'abi.json')
      const configurationPath = join(contractPath, 'contract.yaml')

      await fs.mkdir(contractPath)
      await fs.mkdir(sourcesPath)
      await fs.writeFile(sourcesFilePath, this.sources)
      await fs.writeFile(abiPath, this.abi)

      const configuration = yaml.dump({
        'contract-name': this.name,
        'entrypoint': sources,
        'contract-address': this.address,
        'network': 'mainnet',
        'compiler': this.compiler,
        ...this.optimizations && {'optimization-runs': this.optimizations}
      })

      await fs.writeFile(configurationPath, configuration)
    }
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
