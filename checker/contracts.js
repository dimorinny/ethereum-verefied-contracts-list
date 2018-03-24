const {readDirectory} = require('./util/file')

function provideContractsList (contractsFolder) {
  return readDirectory(contractsFolder)
}

module.exports = {
  provideContractsList
}
