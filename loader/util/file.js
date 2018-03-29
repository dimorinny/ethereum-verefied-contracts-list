const fs = require('fs')
const {promisify} = require('util')

async function writeFileAsync (path, content) {
  const writeFile = promisify(fs.writeFile)
  return await writeFile(path, content)
}

module.exports = {
  writeFileAsync
}
