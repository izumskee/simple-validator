;(function(window) {
  'use strict';
  
  var tooltipCounter = 1 ;

  var vonqValidator = function(className) {
    var ELEMENTS = [];
    var TOOLTIPS = [];
    var CLASS_ERROR = 'vonqValidatorErrorPopup';

    var EMPTY_CLASS_ERROR = 'Class name not provided';
    var MISSING_PARAMETERS_ERROR = 'Missing required parameters';
    var MISSING_SECOND_PARAMETER_ERROR = 'Missing second parameter';

    /**
     * Basic settings
    */
    var settings = {
      minPasswordLength: 6,
      tooltipPosition: 'top',
      requiredError: 'This field is required',
      passwordError: 'Password invalid',
      emailError: 'Please enter a valid email address. For example: you@domain.com'
    };

    if (className) {
      ELEMENTS = window.document.querySelectorAll('.' + className);
    } else {
      throw new TypeError(EMPTY_CLASS_ERROR);
    }

    /**
     * Checking type
     * 
     * @param  {Object|String|Number} obj
     * @param  {String} type
     */
    var _is = function(obj, type) {
      var c = Object.prototype.toString.call(obj).slice(8, -1);
      return obj !== undefined && obj !== null &&  c.toLowerCase() === type.toLowerCase();
    }

    /**
     * Checkbox validation
     * 
     * @param  {Element} element
     */
    var _checkboxValidation = function(element) {
      return element.checked;
    }

    /**
     * Required input validation
     * 
     * @param  {String} value
     */
    var _requiredInputValidation = function(value) {
      return value.replace(/(^\s+|\s+$)/g,'') !== '';
    }

    /**
     * Email validation
     * 
     * @param  {String} value
     */
    var _emailValidation = function(value) {
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(value);
    }

    
    /**
     * Password validation
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
     * @param  {Number} posX
     * @param  {Number} posY
     * @param  {String} content
     */
    var _createTooltip = function(posX, posY, content) {
      var doc = window.document;
      var t = doc.createElement('div');
      var tooltipID = 'tooltip-' + tooltipCounter

      t.className = CLASS_ERROR + ' ' + settings.tooltipPosition;
      t.id = tooltipID;
      t.style.position = 'absolute';
      if (settings.tooltipPosition === 'left') {
        t.style.right = posX + 'px';
      } else {
        t.style.left = posX + 'px';
      }
      if (settings.tooltipPosition === 'top' || settings.tooltipPosition === 'right' || settings.tooltipPosition === 'left') {
        t.style.bottom = posY + 'px';
      } else {
        t.style.top = posY + 'px';
      }
      t.innerHTML = content;

      t.addEventListener('click', function(params) {
        doc.body.removeChild(this);
      });

      doc.body.appendChild(t);

      TOOLTIPS.push(tooltipID);

      return t;
    }

    
    /**
     * Remove tooltips
     */
    var _removeAllTooltips = function() {
      var doc = window.document;

      for (var i = 0; i < TOOLTIPS.length; i++) {
        var tooltip = doc.getElementById(TOOLTIPS[i]);
        if (tooltip) {
          doc.body.removeChild(tooltip);
        }
      }

      TOOLTIPS.length = 0;
    }

    /**
     * Calculate tooltip position
     * 
     * @param  {Element} element
     */
    var _getTooltipPosition = function(element) {
      var doc = window.document;
      var rect = element.getBoundingClientRect();
      var coords = { x: 0, y: 0 };

      switch (settings.tooltipPosition) {
        case 'top':
          coords.x = rect.left;
          coords.y = doc.body.clientHeight - rect.top + 10;
          break;
        case 'bottom':
          coords.x = rect.left;
          coords.y = rect.top + rect.height + 10;
          break;
        case 'right':
          coords.x = rect.left + rect.width + 20;
          coords.y = doc.body.clientHeight - rect.top - rect.height;
          break;
        case 'left':
          coords.x = doc.body.clientWidth - (rect.right - rect.width) + 10;
          coords.y = doc.body.clientHeight - rect.top - rect.height;
          break;
        default:
          break;
      }

      return coords;
    }
    
    /**
     * Set config
     * 
     * @param  {Object|String} param
     * @param  {Any} value
     */
    var config = function(param, value) {
      var argsLength = arguments.length;

      if (!argsLength) {
        throw new TypeError(MISSING_PARAMETERS_ERROR);
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
        throw new TypeError(MISSING_SECOND_PARAMETER_ERROR);
      }

      return this;
    }

    /**
     * Set custom validator
     * 
     * @param  {String} name
     * @param  {Function} func
     */
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

    /**
     * Validate method
     */
    var validate = function() {
      var doc = window.document;
      
      if (ELEMENTS.length > 0) {
        _removeAllTooltips();

        for (var i = 0; i < ELEMENTS.length; i++) {
          var element = ELEMENTS[i];
          var result = false;

          var pos = _getTooltipPosition(element);

          switch (element.type) {
            case 'text':
              result = _requiredInputValidation(element.value);
              if (!result) {
                _createTooltip(pos.x, pos.y, settings.requiredError);
              }
              break;
            case 'email':
              result = _emailValidation(element.value);
              if (!result) {
                _createTooltip(pos.x, pos.y, settings.emailError);
              }
              break;
            case 'checkbox':
              result = _checkboxValidation(element);
              if (!result) {
                _createTooltip(pos.x - 2, pos.y, settings.requiredError);
              }
              break;
            case 'password':
              result = _passwordValidation(element.value);
              if (!result) {
                _createTooltip(pos.x, pos.y, settings.passwordError);
              }
              break;
            default:
              result = _requiredInputValidation(element.value);
              if (!result) {
                _createTooltip(pos.x, pos.y, settings.requiredError);
              }
              break;
          }
          tooltipCounter++;
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