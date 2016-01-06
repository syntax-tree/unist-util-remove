[![npm](https://nodei.co/npm/unist-util-remove.png)](https://npmjs.com/package/unist-util-remove)

# unist-util-remove

[![Build Status][travis-badge]][travis] [![Dependency Status][david-badge]][david]

Remove one or more nodes from [Unist] tree, mutating it.

[unist]: https://github.com/wooorm/unist

[travis]: https://travis-ci.org/eush77/unist-util-remove
[travis-badge]: https://travis-ci.org/eush77/unist-util-remove.svg?branch=master
[david]: https://david-dm.org/eush77/unist-util-remove
[david-badge]: https://david-dm.org/eush77/unist-util-remove.png

## Example

```js
var remove = require('unist-util-remove');

ast
//=> {
//     "type": "root",
//     "children": [
//       {
//         "type": "leaf",
//         "value": "1"
//       },
//       {
//         "type": "node",
//         "children": [
//           {
//             "type": "leaf",
//             "value": "2"
//           },
//           {
//             "type": "node",
//             "children": [
//               {
//                 "type": "leaf",
//                 "value": "3"
//               }
//             ]
//           }
//         ]
//       },
//       {
//         "type": "leaf",
//         "value": "4"
//       }
//     ]
//   }

// Remove node 2 and its sibling.
remove(ast, [ast.children[1].children[0], ast.children[1].children[1]])
//=> {
//     "type": "root",
//     "children": [
//       {
//         "type": "leaf",
//         "value": "1"
//       },
//       {
//         "type": "leaf",
//         "value": "4"
//       }
//     ]
//   }
```

If the root node gets removed, the entire tree is destroyed and `remove` returns `null`. That's the only case in which `remove` doesn't return the original root node.

```js
remove(ast, ast)
//=> null
```

## API

### `remove(ast, nodes, [opts])`

- `ast` — [Unist] tree.
- `nodes` — [Unist] node or array of nodes.

Removes `nodes` from `ast`. Returns a modified [Unist] tree.

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
