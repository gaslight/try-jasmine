var KoanEditor, KoanRunnerView;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
}, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
KoanRunnerView = (function() {
  __extends(KoanRunnerView, Backbone.View);
  function KoanRunnerView(options) {
    this.editor = options.editor;
    KoanRunnerView.__super__.constructor.apply(this, arguments);
  }
  KoanRunnerView.prototype.events = {
    "click .try-it": "run"
  };
  KoanRunnerView.prototype.reportSuccess = function(text) {
    return this.$(".spec-runner").append("" + text + " has expanded your awareness.<br/>");
  };
  KoanRunnerView.prototype.reportFailure = function(text) {
    this.$(".spec-runner").append("Consider the highlighted code. It has damaged your karma");
    return this.editor.find(text);
  };
  KoanRunnerView.prototype.report = function(stuff) {
    return this.$(".spec-runner").append(stuff);
  };
  KoanRunnerView.prototype.findInEditor = function(text) {
    return this.editor.find(text);
  };
  KoanRunnerView.prototype.run = function() {
    this.$(".spec-runner").empty();
    if (this.iframe != null) {
      this.iframe.remove;
    }
    return this.iframe = $("<iframe id='sandbox' src='sandbox.html?reload=" + (new Date()) + "'></iframe>").appendTo("body").load(__bind(function() {
      var iframeWin;
      iframeWin = this.iframe.get(0).contentWindow;
      iframeWin.jasmine.getEnv().addReporter(new iframeWin.CoffeeKoansReporter(this));
      iframeWin.eval(CoffeeScript.compile(this.editor.code(), {
        bare: true
      }));
      return iframeWin.jasmine.getEnv().execute();
    }, this));
  };
  return KoanRunnerView;
})();
KoanEditor = (function() {
  function KoanEditor() {
    var coffeeMode;
    this.editor = ace.edit("koan_editor");
    this.editor.name = "koan_editor";
    this.editor.setTheme("ace/theme/textmate");
    this.editor.getSession().setTabSize(2);
    this.editor.getSession().setUseSoftTabs(true);
    coffeeMode = require("ace/mode/coffee").Mode;
    this.editor.getSession().setMode(new coffeeMode());
  }
  KoanEditor.prototype.code = function() {
    return this.editor.getSession().getValue();
  };
  KoanEditor.prototype.setCode = function(code) {
    return this.editor.getSession().setValue(code);
  };
  KoanEditor.prototype.find = function(text) {
    return this.editor.find(text);
  };
  return KoanEditor;
})();
$(function() {
  window.koanEditor = new KoanEditor();
  window.koanRunnerView = new KoanRunnerView({
    el: $("#koan_runner"),
    editor: koanEditor
  });
  return $.get("/js/AboutExpects.coffee", function(data) {
    return koanEditor.setCode(data);
  });
});