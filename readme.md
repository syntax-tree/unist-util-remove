# unist-util-remove [![Build Status][build-badge]][build-page] [![Coverage Status][coverage-badge]][coverage-page]

Modify the given [unist][] tree to remove all nodes that pass the given test.

## Install

```sh
npm install unist-util-remove
```

## Usage

```js
var u = require('unist-builder')
var remove = require('.')

var tree = u('root', [
  u('leaf', '1'),
  u('node', [
    u('leaf', '2'),
    u('node', [u('leaf', '3'), u('other', '4')]),
    u('node', [u('leaf', '5')])
  ]),
  u('leaf', '6')
])

// Remove all nodes of type `leaf`.
remove(tree, 'leaf')

console.log(tree)
```

Yields: (note the parent of `5` is also removed, due to `opts.cascade`)

```js
{
  type: 'root',
  children: [{
    type: 'node',
    children: [{
      type: 'node',
      children: [{
        type: 'other',
        value: '4'
      }]
    }]
  }]
}
```

## API

### `remove(tree, [opts], test)`

Mutate `tree` by removing all nodes that pass `test`.
The tree is filtered in [preorder][].

###### Parameters

*   `tree` ([`Node?`][node])
    — Tree to filter
*   `opts.cascade` (`boolean`, default: `true`)
    — Whether to drop parent nodes if they had children, but all their
    children were filtered out
*   `test`
    — See [`unist-util-is`][is] for details

###### Returns

The given `tree` ([`Node?`][node]) with nodes for which `test` returned `true`
removed.  `null` is returned if `tree` itself didn’t pass the test, or is
cascaded away.

## Contribute

See [`contributing.md` in `syntax-tree/unist`][contributing] for ways to get
started.

This organisation has a [Code of Conduct][coc].  By interacting with this
repository, organisation, or community you agree to abide by its terms.

## License

[MIT][] © Eugene Sharygin

[mit]: LICENSE

[unist]: https://github.com/syntax-tree/unist

[node]: https://github.com/syntax-tree/unist#node

[is]: https://github.com/syntax-tree/unist-util-is

[preorder]: https://en.wikipedia.org/wiki/Tree_traversal

[build-page]: https://travis-ci.org/syntax-tree/unist-util-remove

[build-badge]: https://travis-ci.org/syntax-tree/unist-util-remove.svg?branch=master

[coverage-page]: https://codecov.io/github/syntax-tree/unist-util-remove?branch=master

[coverage-badge]: https://img.shields.io/codecov/c/github/syntax-tree/unist-util-remove.svg?branch=master

[contributing]: https://github.com/syntax-tree/unist/blob/master/contributing.md

[coc]: https://github.com/syntax-tree/unist/blob/master/code-of-conduct.md
