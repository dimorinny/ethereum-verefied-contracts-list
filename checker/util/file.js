const {promisify} = require('util')
const {join} = require('path')
const fs = require('fs')

async function readFileAsync (path) {
  const readFile = promisify(fs.readFile)
  return readFile(path, 'utf8')
}

function readDirectory (path) {
  return fs.readdirSync(path)
    .filter(currentFile => fs.statSync(join(path, currentFile)).isDirectory())
    .map(item => join(path, item))
}

module.exports = {
  readFileAsync,
  readDirectory
}
