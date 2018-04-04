const util = require('util')
const solc = require('solc')

async function loadSolcCompiler (version) {
  const loadCompiler = util.promisify(solc.loadRemoteVersion)
  return loadCompiler(version)
}

module.exports = {
  loadSolcCompiler
}
