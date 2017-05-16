'use strict';

var remove = require('..');

var test = require('tape'),
    u = require('unist-builder');


test('example from README', function (t) {
  var ast = u('root', [
    u('leaf', 1),
    u('node', [
      u('leaf', 2),
      u('node', [
        u('leaf', 3),
        u('other', 4)
      ]),
      u('node', [
        u('leaf', 5),
      ])
    ]),
    u('leaf', 6)
  ]);

  t.deepEqual(
    remove(ast, 'leaf'),
    u('root', [
      u('node', [
        u('node', [
          u('other', 4)
        ])
      ])
    ])
  );

  t.end();
});
