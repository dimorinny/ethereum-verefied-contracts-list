const fs = require('fs-extra')

function directoryExists (path) {
  return fs.existsSync(path) && fs.statSync(path).isDirectory()
}

module.exports = {
  directoryExists,
}
