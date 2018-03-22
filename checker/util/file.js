const util = require('util')
const fs = require('fs')

async function readFileAsync (path) {
  const readFile = util.promisify(fs.readFile)
  return readFile(path, 'utf8')
}

module.exports = {
  readFileAsync
}
