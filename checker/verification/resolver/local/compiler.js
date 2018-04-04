const {loadSolcCompiler} = require('../../util/solc')

class CompilerRegistry {
  constructor () {
    this.compilers = {}
  }

  async provide (version) {
    if (!(version in this.compilers)) {
      this.compilers[version] = await loadSolcCompiler(version)
    }

    return this.compilers[version]
  }
}

module.exports = {
  CompilerRegistry
}
