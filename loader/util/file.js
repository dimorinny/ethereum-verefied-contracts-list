const fs = require('fs')
const {promisify} = require('util')

async function writeFileAsync (path, content) {
  const writeFile = promisify(fs.writeFile)
  return await writeFile(path, content)
}

async function readFileAsync (path) {
  const readFile = promisify(fs.readFile)
  return await readFile(path, 'utf8')
}

async function createDirectory (path) {
  const makeDirectory = promisify(fs.mkdir)
  return await makeDirectory(path)
}

function directoryExists (path) {
  return fs.existsSync(path) && fs.statSync(path).isDirectory()
}

module.exports = {
  writeFileAsync,
  readFileAsync,
  directoryExists,
  createDirectory
}
