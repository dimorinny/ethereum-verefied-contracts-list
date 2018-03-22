const {readDirectory} = require('./util/file')

// TODO dimorinny: return only changed contract directories
function provideChangedContractsList (contractsFolder) {
  return readDirectory(contractsFolder)
}

module.exports = {
  provideChangedContractsList
}
