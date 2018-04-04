const path = require('path')
const {readFileAsync, readDirectory} = require('../../util/file')

async function generateCompilationInput (configuration) {
  const entrypoint = path.join(configuration.sources, configuration.entrypoint)
  const entrypointSources = await readFileAsync(entrypoint)
  const sources = await getSources(configuration.sources, configuration.entrypoint)

  return JSON.stringify({
    language: 'Solidity',
    sources: {
      [configuration.contractName]: {
        content: entrypointSources
      },
      ...sources
    },
    settings: {
      ...optimizationRuns(configuration),
      outputSelection: {
        [configuration.contractName]: {
          '*': ['evm.deployedBytecode', 'abi']
        }
      }
    }
  })
}

const SOLIDITY_PATTERN = /.*\.sol$/

async function getSources (sourcesDirectory, entrypoint) {
  const files = readDirectory(sourcesDirectory, SOLIDITY_PATTERN)
    .filter(item => item !== entrypoint)

  const contents = await Promise.all(
    files.map(async item => await readFileAsync(
      path.join(sourcesDirectory, item)
    ))
  )

  return files.reduce(
    (object, key, index) => ({...object, [key]: {content: contents[index]}}), {}
  )
}

function optimizationRuns (configuration) {
  if (configuration.optimizationRuns) {
    return {
      optimizer: {
        enabled: true,
        runs: configuration.optimizationRuns
      }
    }
  }
}

module.exports = {
  generateCompilationInput
}
