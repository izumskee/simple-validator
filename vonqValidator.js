;(function(window, undefined) {
  'use strict';

  var VERSION = '0.0.1';
  var CLASS_MAIN = 'vonqValidator';
  var CLASS_ERROR = 'vonqValidatorErrorPopup';

  /**
   * Library's settings
   */
  var settings = {
    minPasswordLength: 6,
    requiredError: 'This field is required',
    passwordError: 'Password invalid',
    emailError: 'Please enter a valid email address. For example: you@domain.com'
  };

  /**
   * Checking object type
   * 
   * @param  {Element} obj
   * @param  {String} type
   */
  var _is = function(obj, type) {
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
  var _checkboxValidation = function(element) {
    return element.checked;
  }

  /**
   * Validate required input
   * 
   * @param  {String} value
   */
  var _requiredInputValidation = function(value) {
    return value.replace(/(^\s+|\s+$)/g,'') !== '';
  }

  /**
   * Validate email
   * 
   * @param  {String} value
   */
  var _emailValidation = function(value) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(value);
  }

  /**
   * Validate password
   * 
   * @param  {String} value
   */
  var _passwordValidation = function(value) {
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
  var _createTooltip = function(x, y, content) {
    var doc = window.document;
    var t = doc.createElement('div');

    t.className = CLASS_ERROR;
    t.style.position = 'absolute';
    t.style.left = x + 'px';
    t.style.bottom = y + 'px';
    t.innerHTML = content;

    doc.body.appendChild(t);

    return t;
  }

  /**
   * Remove all tooltips
   */
  var _removeAllTooltips = function() {
    var doc = window.document;
    var popups = doc.querySelectorAll('.' + CLASS_ERROR);
    for (var i = 0; i < popups.length; i++) {
      doc.body.removeChild(popups[i]);
    }
  }

  var vonqValidator = {};

  // PUBLIC

  /**
   * Set config
   * 
   * @param  {String} param
   * @param  {String|Number|Object} value
   */
  vonqValidator.config = function(param, value) {
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

    return vonqValidator;
  };

  /**
   * Validate method
   */
  vonqValidator.validate = function() {
    var doc = window.document;
    var fields = doc.querySelectorAll('.' + CLASS_MAIN);
    var result = false;

    _removeAllTooltips();

    for (var i = 0; i < fields.length; i++) {
      var element = fields[i];

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
  vonqValidator.setValidator = function(name, func) {
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
  };

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