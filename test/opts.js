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

    var newAst = remove(ast, { cascade: true }, function (node) {
      return node === ast.children[0].children[0] || node === ast.children[1];
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
    var children = ast.children;
    var innerNode = ast.children[0];
    var grandChildren = ast.children[0].children;

    var newAst = remove(ast, { cascade: false }, function (node) {
      return node === ast.children[0].children[0] || node === ast.children[1];
    });

    t.equal(newAst, ast);
    t.deepEqual(ast, u('root', [
      u('node', [])
    ]));
    t.equal(ast.children, children);
    t.equal(ast.children[0], innerNode);
    t.equal(ast.children[0].children, grandChildren);
    t.end();
  });
});
