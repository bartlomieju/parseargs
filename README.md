# parseargs [![Build Status](https://travis-ci.org/bartlomieju/parseargs.svg?branch=master)](https://travis-ci.org/bartlomieju/parseargs)

Command line arguments parser for Deno based on minimist

# Installation
`parseargs` is available via Deno registry.
```ts
import parseArgs from "https://deno.land/x/parseargs/index.ts";
```

# Example

``` ts
import { args } from "deno";
import parseArgs from "https://deno.land/x/parseargs/index.ts";

console.dir(parseArgs(args));
```

```
$ deno example.ts -a beep -b boop
{ _: [], a: 'beep', b: 'boop' }
```

```
$ deno example.ts -x 3 -y 4 -n5 -abc --beep=boop foo bar baz
{ _: [ 'foo', 'bar', 'baz' ],
  x: 3,
  y: 4,
  n: 5,
  a: true,
  b: true,
  c: true,
  beep: 'boop' }
```

# API

## const parsedArgs = parseArgs(args, options = {});

`parsedArgs._` contains all the arguments that didn't have an option associated with
them.

Numeric-looking arguments will be returned as numbers unless `options.string` or
`options.boolean` is set for that argument name.

Any arguments after `'--'` will not be parsed and will end up in `parsedArgs._`.

options can be:

* `options.string` - a string or array of strings argument names to always treat as
strings
* `options.boolean` - a boolean, string or array of strings to always treat as
booleans. if `true` will treat all double hyphenated arguments without equal signs
as boolean (e.g. affects `--foo`, not `-f` or `--foo=bar`)
* `options.alias` - an object mapping string names to strings or arrays of string
argument names to use as aliases
* `options.default` - an object mapping string argument names to default values
* `options.stopEarly` - when true, populate `parsedArgs._` with everything after the
first non-option
* `options['--']` - when true, populate `parsedArgs._` with everything before the `--`
and `parsedArgs['--']` with everything after the `--`. Here's an example:
* `options.unknown` - a function which is invoked with a command line parameter not
defined in the `options` configuration object. If the function returns `false`, the
unknown option is not added to `parsedArgs`.

# Contributing

Feel free to open PRs with suggestions.

# License

MIT
