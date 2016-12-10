;(function(window, undefined) {
  'use strict';

  // Library's version
  var VERSION = '0.0.1';
  
  var CLASS_MAIN = 'vonqValidator';
  var CLASS_ERROR = 'vonqValidatorErrorPopup';

  // PRIVATE

  // Library's settings
  var settings = {
    locale: 'en',
    minPasswordLength: 6,

    requiredError: 'This field is required',
    passwordError: 'Password must be more than 6 symbols',
    emailError: 'Please enter a valid email address. For example: you@domain.com'
  };

  
  /**
   * Checking object type
   * 
   * @param  {Element} obj
   * @param  {String} type
   */
  function is(obj, type) {
    var c = Object.prototype.toString.call(obj).slice(8, -1);
    return obj !== undefined && 
           obj !== null && 
           c.toLowerCase() === type.toLowerCase();
  }

  /**
   * Validate required checkbox element
   * 
   * @param  {Element} element
   */
  function requiredCheckboxValidation(element) {}

  /**
   * Validate required input
   * 
   * @param  {String} value
   */
  function requiredInputValidation(value) {
    return value.replace(/(^\s+|\s+$)/g,'') !== '';
  }

  /**
   * Validate email
   * 
   * @param  {String} value
   */
  function emailValidation(value) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(value);
  }
  /**
   * Validate password
   * 
   * @param  {String} value
   */
  function passwordValidation(value) {
    var passLength = value.length;
    return passLength >= settings.minPasswordLength;
  }

  /**
   * Create tooltip
   * 
   * @param  {Number} x
   * @param  {Number} y
   * @param  {String} content
   */
  function createPopup(x, y, content) {
    var doc = window.document;
    var popup = doc.createElement('div');

    popup.className = CLASS_ERROR;
    popup.style.position = 'absolute';
    popup.style.left = x + 'px';
    popup.style.bottom = y + 'px';
    popup.innerHTML = content;

    doc.body.appendChild(popup);

    return popup;
  }

  /**
   * Remove all tooltips
   */
  function removeAllTooltips() {
    var doc = window.document;
    var popups = doc.querySelectorAll('.' + CLASS_ERROR);
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

  /**
   * Validate method
   */
  vonqValidator.validate = function() {
    var doc = window.document;
    var fields = doc.querySelectorAll('.' + CLASS_MAIN);
    var result = false;

    removeAllTooltips();

    for (var i = 0; i < fields.length; i++) {
      var element = fields[i];

      var rect = element.getBoundingClientRect();
      var bottomPosition = doc.body.clientHeight - rect.top + 10;

      switch (element.type) {
        case 'text':
          result = requiredInputValidation(element.value);
          if (!result) {
            createPopup(rect.left, bottomPosition, settings.requiredError);
          }
          break;
        case 'email':
          result = emailValidation(element.value);
          if (!result) {
            createPopup(rect.left, bottomPosition, settings.emailError);
          }
          break;
        case 'password':
          result = passwordValidation(element.value);
          if (!result) {
            createPopup(rect.left, bottomPosition, settings.passwordError);
          }
          break;
        default:
          break;
      }
    }

    return result;
  };

  /**
   * Set custom validator
   * 
   * @param  {String} name
   * @param  {Function} func
   */
  vonqValidator.setValidator = function(name, func) {};


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