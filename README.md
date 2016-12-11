Simple Validator
=======

### Usage :

1. Add css file to <head>
```
<link rel="stylesheet" href="vonqValidator.css">
```

2. Include main script before usage
```
<script type="text/javascript" src="vonqValidator.js"></script>
```

3. Create validator with classname. All element with assigned classname will be 'attached' to validation
```
new vonqValidator(className)
```

4. Extend config with config() function
```
var validator = new vonqValidator('vonqValidator')
  .config({
    minPasswordLength: 4,
    passwordError: 'Passwords must contain lower and upper case letters'
  })
```

Default settings

```
var settings = {
  minPasswordLength: 6,
  tooltipPosition: 'top',
  requiredError: 'This field is required',
  passwordError: 'Password invalid',
  emailError: 'Please enter a valid email address. For example: you@domain.com'
};
```

5. Extend default validators
```
var validator = new vonqValidator('vonqValidator')
  .setValidator('password', function(value) {
    var lCase = value.search(/[a-z]/) !== -1;
    var hCase = value.search(/[A-Z]/) !== -1;
    return lCase && hCase;
  });
```