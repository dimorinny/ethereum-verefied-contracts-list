class Version {
  constructor (full, first, second, third, suffix) {
    this.full = full
    this.first = first
    this.second = second
    this.third = third
    this.suffix = suffix
  }

  toNumber () {
    return this.first * 100 + this.second * 10 + this.third
  }
}

const VERSION_REGEX = /^v(\d*).(\d*).(\d*)(.*)$/

Version.parse = function (compiler) {
  const parsed = VERSION_REGEX.exec(compiler)
  return new Version(
    compiler,
    parseInt(parsed[1]),
    parseInt(parsed[2]),
    parseInt(parsed[3]),
    parsed[4]
  )
}

module.exports = Version
