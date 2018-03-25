const fs = require('fs')
const {promisify} = require('util')
const {join} = require('path')

async function readFileAsync (path) {
  const readFile = promisify(fs.readFile)
  return await readFile(path, 'utf8')
}

async function writeFileAsync (path, content) {
  const writeFile = promisify(fs.writeFile)
  return await writeFile(path, content)
}

function readDirectory (path) {
  return fs.readdirSync(path)
    .filter(currentFile => fs.statSync(join(path, currentFile)).isDirectory())
    .map(item => join(path, item))
}

module.exports = {
  writeFileAsync,
  readFileAsync,
  readDirectory
}
