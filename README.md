[![npm](https://nodei.co/npm/unist-util-remove.png)](https://npmjs.com/package/unist-util-remove)

# unist-util-remove

[![Build Status][travis-badge]][travis] [![Dependency Status][david-badge]][david]

Remove one or more nodes from [Unist] tree, mutating it.

[unist]: https://github.com/wooorm/unist
[is]: https://github.com/syntax-tree/unist-util-is#api

[travis]: https://travis-ci.org/eush77/unist-util-remove
[travis-badge]: https://travis-ci.org/eush77/unist-util-remove.svg?branch=master
[david]: https://david-dm.org/eush77/unist-util-remove
[david-badge]: https://david-dm.org/eush77/unist-util-remove.png

## Example

```js
var u = require('unist-builder');
var remove = require('unist-util-remove');
var inspect = require('unist-util-inspect');

var ast = u('root', [
  u('leaf', 1),
  u('node', [
    u('leaf', 2),
    u('node', [
      u('leaf', 3),
      u('other', 4)
    ]),
    // this node will be removed as well because of `opts.cascade`.
    u('node', [
      u('leaf', 5),
    ])
  ]),
  u('leaf', 6)
]);

// Remove all nodes of type `leaf`.
remove(ast, 'leaf')
//=> root[1]
//   └─ node[1]
//      └─ node[1]
//         └─ other: "4"
```

If the root node gets removed, the entire tree is destroyed and `remove` returns `null`. That's the only case in which `remove` doesn't return the original root node.

```js
remove(ast, ast)
//=> null
```

## API

### `remove(ast, [opts], predicate)`

- `ast` — [Unist] tree.
- `predicate` — any `test` as given to [`unist-util-is`][is].

Iterates over `ast` in preorder traversal and removes all nodes matching `predicate` from `ast`. Returns a modified [Unist] tree.

##### `opts.cascade`

Type: `Boolean`<br>
Default: `true`

If `true`, removing of the last child triggers removal of its parent node.

## Install

```
npm install unist-util-remove
```

## License

MIT
