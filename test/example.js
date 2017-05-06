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
        u('leaf', 3)
      ])
    ]),
    u('leaf', 4)
  ]);
  var one = ast.children[0];
  var four = ast.children[2];

  t.equal(remove(ast, ast), null);

  t.end();
});
