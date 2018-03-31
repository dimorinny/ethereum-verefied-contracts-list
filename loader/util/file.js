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

module.exports = {
  writeFileAsync,
  readFileAsync
}
