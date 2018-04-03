const fs = require('fs-extra')
const git = require('simple-git/promise')
const {join} = require('path')

async function provideContractsList (baseDirectory, contractsFolder) {
  const changedContracts = await getChangedContracts(baseDirectory, contractsFolder)

  if (changedContracts.length !== 0) {
    console.log(`Found changed contracts: ${changedContracts}`)
  } else {
    console.log(`There is no changed contracts`)
  }

  const allContracts = fs.readdirSync(contractsFolder)
    .filter(currentFile => fs.statSync(join(contractsFolder, currentFile)).isDirectory())
    .map(item => join(contractsFolder, item))
    .filter(item => changedContracts.has(item))
}

async function getChangedContracts (baseDirectory, contractsFolder) {
  const contractPathRegex = `^${contractsFolder}/0x[a-fA-F0-9]{40}`

  const diff = await git(baseDirectory).diff(['--name-only', 'origin/master'])

  const changedContractsDirectories = diff
    .split('\n')
    .map((change) => change.match(contractPathRegex))
    .filter((change) => change !== null)
    .map((change) => change[0])

  return new Set(changedContractsDirectories)
}

module.exports = {
  provideContractsList
}
