'use strict';

var remove = require('..');

var it = require('tape'),
    u = require('unist-builder');


it('should compare nodes by partial properties', function (t) {
  var ast = u('node', [
    u('node', 'foo'),
    u('node', 'bar')
  ]);
  var children = ast.children;
  var firstChild = ast.children[0];

  var newAst = remove(ast, {value: 'bar'});

  t.equal(newAst, ast);
  t.deepEqual(ast, u('node', [firstChild]));
  t.equal(ast.children, children);
  t.equal(ast.children[0], firstChild);
  t.end();
});


it('should remove nodes with children', function (t) {
  var ast = u('root', [
    u('node', [
      u('leaf', 1)
    ]),
    u('leaf', 2)
  ]);
  var children = ast.children;
  var secondLeaf = ast.children[1];

  var newAst = remove(ast, function (node) {
    return node === ast.children[0];
  });

  t.equal(newAst, ast);
  t.deepEqual(ast, u('root', [secondLeaf]));
  t.equal(ast.children, children);
  t.equal(ast.children[0], secondLeaf);
  t.end();
});


it('should return `null` if root node is removed', function (t) {
  var ast = u('root', [
    u('node', [
      u('leaf', 1)
    ]),
    u('leaf', 2)
  ]);

  t.equal(remove(ast, ast), null);
  t.end();
});


it('should cascade remove parent nodes', function (t) {
  t.test(function (t) {
    var ast = u('root', [
      u('node', [
        u('leaf', 1)
      ]),
      u('leaf', 2)
    ]);
    var children = ast.children;
    var secondLeaf = ast.children[1];

    var newAst = remove(ast, ast.children[0].children[0]);

    t.equal(newAst, ast);
    t.deepEqual(ast, u('root', [secondLeaf]));
    t.equal(ast.children, children);
    t.equal(ast.children[0], secondLeaf);
    t.end();
  });

  t.test(function (t) {
    var ast = u('root', [
      u('node', [
        u('leaf', 1)
      ]),
      u('leaf', 2)
    ]);

    var newAst = remove(ast, function (node) {
      return node === ast.children[0].children[0] || node === ast.children[1];
    });

    t.equal(newAst, null);
    t.end();
  });
});


it('should not cascade-remove nodes that were empty initially', function (t) {
  var ast = u('node', [
    u('node', []),
    u('node', [
      u('leaf')
    ])
  ]);

  ast = remove(ast, 'leaf');

  t.deepEqual(ast, u('node', [
    u('node', [])
  ]));
  t.end();
});


it('should support type tests and predicate functions', function (t) {
  t.test(function (t) {
    var ast = u('node', [
      u('node', [
        u('leaf', 1)
      ]),
      u('leaf', 2)
    ]);

    ast = remove(ast, { cascade: false }, 'leaf');

    t.deepEqual(ast, u('node', [
      u('node', [])
    ]));
    t.end();
  });

  t.test(function (t) {
    var ast = u('node', [
      u('node', [
        u('leaf', 1)
      ]),
      u('leaf', 2)
    ]);

    ast = remove(ast, { cascade: false }, function (node) {
      return node.value == 1;
    });

    t.deepEqual(ast, u('node', [
      u('node', []),
      u('leaf', 2)
    ]));
    t.end();
  });

  t.test(function (t) {
    var ast = u('node', [
      u('node', [
        u('leaf', 1)
      ]),
      u('leaf', 2)
    ]);

    ast = remove(ast, { cascade: false }, function (node, index, parent) {
      return index == 0 && parent.children.length == 1;
    });

    t.deepEqual(ast, u('node', [
      u('node', []),
      u('leaf', 2)
    ]));
    t.end();
  });
});
