'use strict';

var remove = require('..');

var test = require('tape'),
    u = require('unist-builder');


test('opts.cascade', function (t) {
  t.test('opts.cascade = true', function (t) {
    var ast = u('root', [
      u('node', [
        u('leaf', 1)
      ]),
      u('leaf', 2)
    ]);

    var newAst = remove(ast, [
      ast.children[0].children[0],
      ast.children[1]
    ], {
      cascade: true
    });

    t.equal(newAst, null);
    t.end();
  });

  t.test('opts.cascade = false', function (t) {
    var ast = u('root', [
      u('node', [
        u('leaf', 1)
      ]),
      u('leaf', 2)
    ]);
    var innerNode = ast.children[0];

    var newAst = remove(ast, [
      ast.children[0].children[0],
      ast.children[1]
    ], {
      cascade: false
    });

    t.equal(newAst, ast);
    t.deepEqual(ast, u('root', [
      u('node', [])
    ]));
    t.equal(ast.children[0], innerNode);
    t.end();
  });
});
