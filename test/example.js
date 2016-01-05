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

  var newAst = remove(ast, [
    ast.children[1].children[0],
    ast.children[1].children[1]
  ]);
  t.equal(ast, newAst);
  t.deepEqual(ast, u('root', [
    u('leaf', 1),
    u('leaf', 4)
  ]));
  t.equal(ast.children[0], one);
  t.equal(ast.children[1], four);

  t.equal(remove(ast, ast), null);

  t.end();
});
