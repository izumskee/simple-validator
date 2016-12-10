;(function(window, undefined) {
  'use strict';

  // Library's version
  var VERSION = '0.0.1';
  
  var CLASS_SELECTOR = '.vonqValidator';

  // PRIVATE

  // Library's settings
  var settings = {
    locale: 'en',
    minPasswordLength: 6,

    requiredError: 'This field is required',
    passwordError: 'Password must be more than 6 symbols',
    emailError: 'Please enter a valid email address. For example: you@domain.com'
  };

  // Checking type
  function is(obj, type) {
    var c = Object.prototype.toString.call(obj).slice(8, -1);
    return obj !== undefined && 
           obj !== null && 
           c.toLowerCase() === type.toLowerCase();
  }

  // Validate required checkbox
  function requiredCheckboxValidation(checkbox) {}

  // Validate required input
  function requiredInputValidation(value) {
    return value.replace(/(^\s+|\s+$)/g,'') !== '';
  }

  // Validate email
  function emailValidation(value) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(value);
  }

  // Validate password
  function passwordValidation(value) {
    var passLength = value.length;
    return passLength >= settings.minPasswordLength;
  }

  function createPopup(x, y, pos, content) {
    var doc = window.document;
    var popup = doc.createElement('div');

    popup.className = 'vonqValidatorErrorPopup'
    popup.style.position = 'fixed';
    popup.style.left = x + 20 + 'px';
    popup.style.top = y - 4 + 'px';
    popup.style.backgroundColor = '#f00';
    popup.style.color = '#fff';
    popup.style.padding = '4px 10px';
    popup.innerHTML = content;

    doc.body.appendChild(popup);
  }

  function removeAllPopups() {
    var doc = window.document;
    var popups = doc.querySelectorAll('.vonqValidatorErrorPopup');
    for (var i = 0; i < popups.length; i++) {
      doc.body.removeChild(popups[i]);
    }
  }

  var vonqValidator = {};

  // PUBLIC

  // Set config
  vonqValidator.config = function(param, value) {
    var argsLength = arguments.length;

    if (!argsLength) {
      throw new TypeError('Missing required parameters');
    }

    if (is(param, 'Object')) {
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

    return vonqValidator;
  };

  vonqValidator.validate = function() {
    var doc = window.document;
    var fields = doc.querySelectorAll(CLASS_SELECTOR);
    var result = false;

    removeAllPopups();

    for (var i = 0; i < fields.length; i++) {
      var element = fields[i];

      switch (element.type) {
        case 'text':
          result = requiredInputValidation(element.value);
          if (!result) {
            var rect = element.getBoundingClientRect();
            createPopup(rect.right, rect.top, null, settings.requiredError);
          }
          break;
        case 'email':
          result = emailValidation(element.value);
          if (!result) {
            var rect = element.getBoundingClientRect();
            createPopup(rect.right, rect.top, null, settings.emailError);
          }
          break;
        case 'password':
          result = passwordValidation(element.value);
          if (!result) {
            var rect = element.getBoundingClientRect();
            createPopup(rect.right, rect.top, null, settings.passwordError);
          }
          break;
        default:
          break;
      }
    }

    return result;
  };




  // Set custom validator
  vonqValidator.setValidator = function(name, func) {};

  // Set custom styles
  vonqValidator.setCustomStyle = function(name, func) {};


  // Avoid conflicts with other namespaces
  var cachedValidator = window.vonqValidator;

  vonqValidator.noConflict = function() {
    if (window.vonqValidator === vonqValidator) {
      window.vonqValidator = cachedValidator;
    }
    return vonqValidator;
  };

  window.vonqValidator = vonqValidator;
})(window);