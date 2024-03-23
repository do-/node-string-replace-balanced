![workflow](https://github.com/do-/node-string-replace-balanced/actions/workflows/main.yml/badge.svg)
![Jest coverage](./badges/coverage-jest%20coverage.svg)

`string-replace-balanced` is a CommonJS module exporting one class that encapsulates
* a pair of `start` / `end` tokens,
* a `transform` function

and contains a method to replace each `${start}${_}${end}` fragment in a given string with the corresponding `this.transform(_)` value.

# Installation
```sh
npm install string-replace-balanced
```

# Usage
```js
const TagProcessor = require ('string-replace-balanced')

const 
  template = '<*~one*> and <*~two*> makes 3.',
  val = {one: 1, two: 2},

// (1) bag of options

const processor = new TagProcessor ({
  start     : '<*~',
  end       :  '*>',
  transform : name => val [name]
})

// (2.1) subclass, setting properties via constructor

const processor = new (class extends TagProcessor {
  constructor () {
    super ()
    this.start = '<*~'
    this.end   =  '*>'
  }
  transform (_) {return val [_]}
})

// (2.2) subclass, implementing getters

const processor = new (class extends TagProcessor {
  get start  () {return '<*~'}
  get end    () {return '*>'}
  transform (_) {return val [_]}
})

// ...anyway,

console.log (processor.process (template))

// result: '1 and 2 makes 3.'
```
# API
## Constructor
The constructor takes a bag of options and copies its `start`, `end` and `transform` properties into 'this' instance. Neither option is mandatory, the argument may me omitted at all.

## Properties
|Name | Type | Description
|-|-|-
|`start` | `String` | The opening bracket of tags to replace
|`end` | `String` | The closing bracket of tags to replace

**NOTE**: It's the caller' responsibility to set `start` and `end` as non empty strings, an infinite loop may occur otherwise.

## Methods
### `transform`
This method, not implemented by default (but settable at instantiation via the bag of options) is called for each `${start}${_}${end}` fragment with the `_` value and must return the replacement string.

### `process`
This method does the main job: takes a string and returns its copy with all `${start}${_}${end}` fragments replaced.

# Notes
The same functionality is available via the standard [String.prototype.replaceAll()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replaceAll) method, but only with [regular expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/RegExp) which cause a certain performance overhead, avoidable by using `string-replace-balanced` instead.

The original purpose of this module is to scan HTML for pictures given as [Data URLs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URLs) (`"data:image ... "`) and to store them separately overriding the corresponding links.

# Limitations
No character escaping is supported: `start` and `end` are always considered tag delimiters and cannot be isolated with `/*...*/`, `<![CDATA[...]]>` nor whatever alike.

Nested tags are not allowed: each `start` is expected to be closed with the nearest `end`.

The balance is not enforced though. For example, multiple `end` tokens may occur in a row — they will be copied into the result as is without reporting an error.