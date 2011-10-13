class CoffeeKoansReporter
  constructor: (@koanRunner)->
    
  reportRunnerStarting: (runner) ->
    @runner = runner
    @koanRunner.report(runner.suites()[0].description)
    
  reportSpecResults: (spec) ->
    return if @failed
    if spec.results().failedCount > 0
      @koanRunner.reportFailure spec.description
      @failed = true
    else 
      @koanRunner.reportSuccess spec.description
  
  reportRunnerResults: (runner) ->
    if !@failed
      @koanRunner.koanCompleted(runner.suites()[0].description)
      #empty the box
      #load the next koan
      #fill the box
    
