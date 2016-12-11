;(function(window) {
  'use strict';
  
  var vonqValidator = function(className) {
    var ELEMENTS = [];
    var CLASS_ERROR = 'vonqValidatorErrorPopup';

    var settings = {
      minPasswordLength: 6,
      requiredError: 'This field is required',
      passwordError: 'Password invalid',
      emailError: 'Please enter a valid email address. For example: you@domain.com'
    };

    if (className) {
      ELEMENTS = window.document.querySelectorAll('.' + className);
    } else {
      throw new TypeError('Class name not provided');
    }

    var _is = function(obj, type) {
      var c = Object.prototype.toString.call(obj).slice(8, -1);
      return obj !== undefined && obj !== null &&  c.toLowerCase() === type.toLowerCase();
    }

    var _checkboxValidation = function(element) {
      return element.checked;
    }

    var _requiredInputValidation = function(value) {
      return value.replace(/(^\s+|\s+$)/g,'') !== '';
    }

    var _emailValidation = function(value) {
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(value);
    }

    var _passwordValidation = function(value) {
      var passLength = value.length;
      return passLength >= settings.minPasswordLength;
    }

    var _createTooltip = function(posX, posY, content) {
      var doc = window.document;
      var t = doc.createElement('div');

      t.className = CLASS_ERROR;
      t.style.position = 'absolute';
      t.style.left = posX + 'px';
      t.style.bottom = posY + 'px';
      t.innerHTML = content;

      doc.body.appendChild(t);

      return t;
    }

    var _removeAllTooltips = function(id) {
      var doc = window.document;
      var tooltips = doc.querySelectorAll('.' + CLASS_ERROR);
      for (var i = 0; i < tooltips.length; i++) {
        if (tooltips[i]) {
          doc.body.removeChild(tooltips[i]);
        }
      }
    }

    var config = function(param, value) {
      var argsLength = arguments.length;

      if (!argsLength) {
        throw new TypeError('Missing required parameters');
      }

      if (_is(param, 'Object')) {
        for (var p in param) {
          if (param.hasOwnProperty(p) && settings.hasOwnProperty(p)) {
            settings[p] = param[p];
          }
        }
      } else if (argsLength > 1) {
        if (settings.hasOwnProperty(param)) {
          settings[param] = value;
        }
      } else {
        throw new TypeError('Missing second parameter');
      }

      return this;
    }

    var setValidator = function(name, func) {
      switch (name) {
        case 'email':
          _emailValidation = func;
          break;
        case 'password':
          _passwordValidation = func;
          break;
        default:
          break;
      }

      return this;
    };

    var validate = function() {
      var doc = window.document;
      
      if (ELEMENTS.length > 0) {
        _removeAllTooltips();

        for (var i = 0; i < ELEMENTS.length; i++) {
          var element = ELEMENTS[i];
          var result = false;

          var rect = element.getBoundingClientRect();
          var bottomPosition = doc.body.clientHeight - rect.top + 10;

          switch (element.type) {
            case 'text':
              result = _requiredInputValidation(element.value);
              if (!result) {
                _createTooltip(rect.left, bottomPosition, settings.requiredError);
              }
              break;
            case 'email':
              result = _emailValidation(element.value);
              if (!result) {
                _createTooltip(rect.left, bottomPosition, settings.emailError);
              }
              break;
            case 'checkbox':
              result = _checkboxValidation(element);
              if (!result) {
                _createTooltip(rect.left - 2, bottomPosition, settings.requiredError);
              }
              break;
            case 'password':
              result = _passwordValidation(element.value);
              if (!result) {
                _createTooltip(rect.left, bottomPosition, settings.passwordError);
              }
              break;
            default:
              result = _requiredInputValidation(element.value);
              if (!result) {
                _createTooltip(rect.left, bottomPosition, settings.requiredError);
              }
              break;
          }
        }
      }
    };

    // Public methods
    return {
      elements: ELEMENTS,
      settings: settings,
      config: config,
      setValidator: setValidator,
      validate: validate
    };
  }

  window.vonqValidator = vonqValidator;
})(window);