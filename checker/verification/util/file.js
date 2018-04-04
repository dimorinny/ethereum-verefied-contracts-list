const util = require('util')
const path = require('path')
const fs = require('fs')

async function readFileAsync (path) {
  const readFile = util.promisify(fs.readFile)
  return readFile(path, 'utf8')
}

function readDirectory (directory, filter, baseDirectory = directory) {
  return _readDirectory(directory, baseDirectory).filter(item => item.match(filter))
}

function _readDirectory (directory, baseDirectory) {
  const isdir = fs.statSync(directory).isDirectory()

  if (!isdir) return path.relative(baseDirectory, directory)

  return fs.readdirSync(directory).reduce((files, file) =>
    files.concat(_readDirectory(path.join(directory, file), baseDirectory)),
    []
  )
}

module.exports = {
  readFileAsync,
  readDirectory
}
