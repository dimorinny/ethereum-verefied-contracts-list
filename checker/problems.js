class ProblemsRegistry {
  constructor () {
    this.problems = []
  }

  addProblem (problem) {
    this.problems.push(problem)
  }

  printAndGetResult () {
    console.log()

    if (this.problems.length > 0) {
      console.log(`There were ${this.problems.length} problems`)
      this.problems.forEach((item) => console.log(item))
    } else {
      console.log('All checks passed')
    }

    return this.problems.length === 0
  }
}

module.exports = {
  ProblemsRegistry
}
