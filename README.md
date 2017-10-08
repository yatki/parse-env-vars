# read-env
> Convert environment variables into JSON object with parsed values.

[![NPM version](https://badge.fury.io/js/read-env.svg)](https://www.npmjs.com/package/read-env)
[![Build Status](https://travis-ci.org/yatki/read-env.svg?branch=master)](https://travis-ci.org/yatki/read-env)
[![Coverage Status](https://coveralls.io/repos/github/yatki/read-env/badge.svg?branch=master&)](https://coveralls.io/github/yatki/read-env?branch=master)

## Install

```
npm install --save read-env
```

## Basic Example

Let's say you have some environment variables starting with prefix "**EXAMPLE_**" like below:
```
EXAMPLE_OBJECT_KEY= '{"prop": "value"}',
EXAMPLE_ARRAY_KEY= '[1,2,3, "string", {"prop": "value"}, 5.2]',
EXAMPLE_TRUE_KEY= 'true',
EXAMPLE_FALSE_KEY= 'false',
EXAMPLE_INT_KEY= '5',
EXAMPLE_FLOAT_KEY= '5.2',
EXAMPLE_STRING_KEY= 'example',
```

your-app.js
```javascript
import readEnv from 'read-env';

const options = readEnv('EXAMPLE');
console.log(options);
```

Output:
```javascript
{ 
  arrayKey: [ 1, 2, 3, 'string', { prop: 'value' }, 5.2 ],
  falseKey: false,
  floatKey: 5.2,
  intKey: 5,
  objectKey: { prop: 'value' },
  stringKey: 'example',
  trueKey: true 
}

```

## Usage

### `readEnv(prefix = null, transformKey = 'camelcase')`
You can pass a string prefix as first paremeter like below:

```javascript
const options = readEnv('EXAMPLE');
const optionsLower = readEnv('EXAMPLE', 'lowercase');

function ucfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
const optionsUcfirst = readEnv('EXAMPLE', ucfirst);

```

### `readEnv(config)`
You can pass whole config object:

```javascript
function ucfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

const options = readEnv({
  prefix: 'EXAMPLE',
  removePrefix: true,
  transformKey: ucfirst,
  parse: {
    array: false, //not gonna parse arrays
  }, //still gonna parse object, int, float and boolean
});
```

## Config

Available Config Options:
- `prefix` (type: *string*, default: *null*): filters environment variables by prefix
- `removePrefix` (type: *bool*, default: *true*): set false if you want to keep prefix in property names.
- `transformKey` (type: *null*|*string*|*function*, default: *'camelcase'*): transform environment variable name.
  1. `null`, doesn't transform the environment variable name.
  1. `camelcase`, transforms variable name to camelCase.
  1. `lowercase`, transforms variable name to lowercase.
  1. `uppercase`, transforms variable name to UPPERCASE.
  1. `fn(varName)`, you can write your own transformer function (*varName* will be provided without prefix, if *removePrefix* is *true*)
- `parse` (type: *bool*|*object*, default: *object*):
  1. `false`: returns raw environment variable value
  1. `{}`: allows you to define which value types are going to be parsed.
      - `object` (type: *bool*, default: *true*): parse string as object (value must be valid JSON input, see: [JSON.parse](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse#Using_JSON.parse())).
      - `array` (type: *bool*, default: *true*): parse stringified array (value must be valid JSON input, see: [JSON.parse](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse#Using_JSON.parse())).
      - `int` (type: *bool*, default: *true*): parse digits into integer (value consists of only numbers).
      - `float` (type: *bool*, default: *true*): parse decimals into integer (value consists of only numbers with decimal point).
      - `bool` (type: *bool*, default: *true*): parse if string equals to *'true'* or *'false'*.
- `filter` (type: *null*|*function*, default: *null*): filters environment variables (overrides prefix rule).
  1. `null`, don't filter varaibles.
  1. `fn(envVarName, index)`, custom filter function (*envVarName* will be provided without any transformation).
  
## Use Case Example
Recently, I used [Nightmare](https://github.com/segmentio/nightmare) for *acceptance testing* and had several environments which have different configurations.
 
Instead of doing something like below:

```javascript
import Nightmare from 'nightmare';

const nightmare = Nightmare({
  show: process.env.X_NIGHTMARE_SHOW || false,
  width:  process.env.X_NIGHTMARE_WIDTH || 1280,
  height:  process.env.X_NIGHTMARE_HEIGHT || 720,
  typeInterval:  process.env.X_NIGHTMARE_TYPE_INTERVAL || 50,
  //... other properties goes forever
});
```

I'm doing this:
```javascript
import Nightmare from 'nightmare';
import readEnv from 'read-env';

const nightmareConfig = readEnv('X_NIGHTMARE');
const nightmare = Nightmare(nightmareConfig);
```
        
## LICENCE

MIT (c) 2017 Mehmet Yatkı