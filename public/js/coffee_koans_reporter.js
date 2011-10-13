var CoffeeKoansReporter;
CoffeeKoansReporter = (function() {
  function CoffeeKoansReporter(koanRunner) {
    this.koanRunner = koanRunner;
  }
  CoffeeKoansReporter.prototype.reportRunnerStarting = function(runner) {
    this.runner = runner;
    return this.koanRunner.report(runner.suites()[0].description);
  };
  CoffeeKoansReporter.prototype.reportSpecResults = function(spec) {
    if (this.failed) {
      return;
    }
    if (spec.results().failedCount > 0) {
      this.koanRunner.reportFailure(spec.description);
      return this.failed = true;
    } else {
      return this.koanRunner.reportSuccess(spec.description);
    }
  };
  CoffeeKoansReporter.prototype.reportRunnerResults = function(runner) {
    if (!this.failed) {
      return this.koanRunner.koanCompleted(runner.suites()[0].description);
    }
  };
  return CoffeeKoansReporter;
})();