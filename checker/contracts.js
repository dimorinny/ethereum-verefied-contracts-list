const fs = require('fs-extra')
const git = require('simple-git/promise')
const {join} = require('path')

const BASE_BRANCH_NAME = 'master'

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

  const currentBranchName = await getCurrentBranchName(baseDirectory)

  if (currentBranchName === BASE_BRANCH_NAME) {
    console.log(`Executing tests on base branch (${BASE_BRANCH_NAME}). For this reason we should check all contracts`)
    return allContracts
  } else {
    console.log(`Executing tests on not base branch (${BASE_BRANCH_NAME}). For this reason we should check only changed contracts`)
    return allContracts
      .filter(item => changedContracts.has(item))
  }
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

async function getCurrentBranchName (baseDirectory) {
  const branches = await git(baseDirectory).branch()
  return branches.current
}

module.exports = {
  provideContractsList
}
