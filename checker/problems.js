class ProblemsRegistry {
  constructor () {
    this.problems = []
  }

  addProblem (problem) {
    this.problems.push(problem)
  }

  exit () {
    console.log()

    if (this.problems.length > 0) {
      console.log(`There were ${this.problems.length} problems`)
      this.problems.forEach((item) => console.log(item))
      process.exit(1)
    } else {
      console.log('All checks passed')
      process.exit(0)
    }
  }
}

module.exports = {
  ProblemsRegistry
}
