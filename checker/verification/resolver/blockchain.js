const Web3 = require('web3')

const providers = {
  'mainnet': 'https://mainnet.infura.io/',
  'ropsten': 'https://ropsten.infura.io/',
  'kovan': 'https://kovan.infura.io/',
  'rinkeby': 'https://rinkeby.infura.io/'
}

function resolveProviderUrl (provider) {
  return providers[provider]
}

class BlockChainByteCodeResolver {
  constructor (network) {
    const url = resolveProviderUrl(network)
    const httpProvider = new Web3.providers.HttpProvider(url)
    this.provider = new Web3(httpProvider)
  }

  async resolve (address) {
    const byteCode = await this.provider.eth.getCode(address)
    return byteCode.trim().replace(/^0x/, '')
  }
}

BlockChainByteCodeResolver.MAIN_NET = 'mainnet'
BlockChainByteCodeResolver.ROPSTEN = 'ropsten'
BlockChainByteCodeResolver.KOVAN = 'kovan'
BlockChainByteCodeResolver.RINKEBY = 'rinkeby'

module.exports = {
  BlockChainByteCodeResolver
}
