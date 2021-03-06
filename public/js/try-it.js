(function($){
  window.tryIt = function() {
    $('.spec-runner').html($('.loading.template').html());
    $('#sandbox').remove();
    $($('.sandbox.template').html()).appendTo('body').load(function() {
      $('.spec-runner').html('');
      Sandbox().runSpecs();
    });
  };

  //Define the little iframe sandbox
  window.Sandbox = function(){
    var self = $('#sandbox').get(0).contentWindow;

    self.runSpecs = function() {
      hideErrors();
      self.jasmine.getEnv().addReporter(new self.jasmine.TrivialReporter({
        location: window.document.location,
        body: $('.spec-runner')[0]
      }));
      editors.each(function(editor) {
        self.execute(editor);
      });
      self.jasmine.getEnv().execute();
    };
    self.execute = function(editor) {
      var script = editor.getSession().getValue();
      localStorage[editor.name] = script;
      try {
        self.eval(script);
      } catch(javaScriptError) {
        //Well, maybe it's just coffeescript.
        try {
          self.eval(CoffeeScript.compile(script, { bare: true }));
          editors.setMode('coffee');
        } catch(coffeeError) {
          showError(editor.name);
          throw 'JavaScript Parse Error: '+javaScriptError+
                '\n\n'+
                'CoffeeScript Compile Error: '+coffeeError;
        }
      }
    };

    var hideErrors = function() {
      $('.flash').html('').hide();
      $('.error, .runner-wrap').removeClass('error');
    };

    var showError = function(name) {
      $('.flash').fadeIn().append("<li>Uh oh, it looks like your JavaScript "+(name === 'specs' ? 'specs have' : 'source has')+" a parse error!</li>");
      $('.runner-wrap, #'+name).addClass('error');
    };

    return self;
  };

  window.templates = {
    stillDefault: function(editor) {
      return this.getDefault(editor.name) === editor.getSession().getValue();
    },
    getDefault: function(name) {
      return $.trim($('#default-'+name).text());
    },
    renderDefault: function(name) {
      var script = this.getDefault(name);
      if((localStorage[name] && script !== localStorage[name])) {
        $('.clear-saved').show().css('display','inline-block');
      }
      editors.get(name).getSession().setValue(localStorage[name] || script);
    },
    init: function() {
      _(editors.names).each(function(name) {
        templates.renderDefault(name);
      });
    },
    goCoffee: function() {
      if(editors.all(function(e) { return templates.stillDefault(e); })
        || confirm('overwrite your code with a sampling of CoffeeScript?')) {
        editors.each(function(editor) {
          editors.setMode('coffee')  ;
          editor.getSession().setValue(templates.getDefault('coffee-'+editor.name));
        });
      }
    }
  };

  $.fn.codeBox = function() {
    var $this = $(this);
    var editor = ace.edit($this.attr('id'));
    editor.name = $this.attr('id');
    editor.setTheme("ace/theme/textmate");
    editor.getSession().setTabSize(2)
    editor.getSession().setUseSoftTabs(true);
    editor.switchMode = function(name) {
      var mode = require("ace/mode/"+name).Mode;
      editor.getSession().setMode(new mode());
    };
    editor.switchMode('javascript');
    $this.data('editor',editor);
    return $this;
  };

  var editors = {
    names: ['specs','src'],
    get: function(name) {
      return $('#'+name).data('editor');
    },
    setMode: function(name) {
      $('#mode-select').val(name).trigger('change');
    },
    each: function(f) {
      return _(editors.names).each(function(name,i) {
        f(editors.get(name),i);
      });
    },
    all: function(f) {
      return _(editors.names).all(function(name,i) {
        return f(editors.get(name),i);
      });
    }
  };

  //Eventy stuff
  $('html, body').add(document.body).keydown(function(e){
    if(e.which == 13 && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      tryIt();
    }
  });
  $('#mode-select').live('change',function(e) {
    e.preventDefault();
    var $sel = $(this);
    editors.each(function(editor) {
      editor.switchMode($sel.val());
    });
  })
  var clicker = function(selector,action) {
    $(selector).live('click',function(e) {
      e.preventDefault();
      action.apply(this,[e])
    });
  };
  clicker('.try-it.button',function() {
    tryIt();
  });
  clicker('.button.insert',function() {
    editors.get('specs').insert($(this).data('snippet'));
  });
  clicker('.clear-saved',function() {
    _(editors.names).each(function(name) {
      delete localStorage[name];
    });
    $(this).hide();
    templates.init();
  });
  clicker('.coffee.button',function() {
    templates.goCoffee();
  });
})(jQuery);
