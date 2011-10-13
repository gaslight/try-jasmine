class KoanRunnerView extends Backbone.View
  
  constructor: (options)->
    @editor = options.editor
    super
    
  events: 
    "click .try-it": "run"
  
  reportSuccess: (text) ->
    @$(".spec-runner").append "#{text} has expanded your awareness.<br/>"
    
  reportFailure: (text) ->
    @$(".spec-runner").append("Consider the highlighted code. It has damaged your karma")
    @editor.find text
    
  report: (stuff)->
    @$(".spec-runner").append(stuff)
    
  findInEditor: (text) ->
    @editor.find text
    
  run: ->
    @$(".spec-runner").empty()
    @iframe.remove if @iframe?
    @iframe = $("<iframe id='sandbox' src='sandbox.html?reload=#{new Date()}'></iframe>").appendTo("body").load =>
      iframeWin = @iframe.get(0).contentWindow
      iframeWin.jasmine.getEnv().addReporter new iframeWin.CoffeeKoansReporter @
      iframeWin.eval CoffeeScript.compile(@editor.code(), { bare: true })
      iframeWin.jasmine.getEnv().execute()
    
  

class KoanEditor
  
  constructor: ->
    @editor = ace.edit("koan_editor")
    @editor.name = "koan_editor"
    @editor.setTheme("ace/theme/textmate");
    @editor.getSession().setTabSize(2)
    @editor.getSession().setUseSoftTabs(true);
    coffeeMode = require("ace/mode/coffee").Mode;
    @editor.getSession().setMode new coffeeMode()
    
  code: ->
    @editor.getSession().getValue()
    
  setCode: (code)->
    @editor.getSession().setValue code
  
  find: (text) -> @editor.find(text)
  
$ ->
  window.koanEditor = new KoanEditor()
  window.koanRunnerView = new KoanRunnerView(el: $("#koan_runner"), editor: koanEditor)
  $.get "/js/AboutExpects.coffee", (data)->
    koanEditor.setCode data
  

