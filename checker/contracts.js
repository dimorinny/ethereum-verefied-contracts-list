const fs = require('fs-extra')
const {join} = require('path')

function provideContractsList (contractsFolder) {
  return fs.readdirSync(contractsFolder)
    .filter(currentFile => fs.statSync(join(contractsFolder, currentFile)).isDirectory())
    .map(item => join(contractsFolder, item))
}

module.exports = {
  provideContractsList
}
