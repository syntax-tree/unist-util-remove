'use strict';

var is = require('unist-util-is');


module.exports = function (ast, opts, predicate) {
  if (arguments.length == 2) {
    predicate = opts;
    opts = {};
  }

  if (Array.isArray(predicate)) {
    predicate = arrayPredicate(predicate);
  }
  opts.cascade = opts.cascade || opts.cascade === undefined;

  // Check and remove nodes recursively in preorder.
  // For each composite node, modify its children array in-place.
  return (function preorder (node, nodeIndex, parent) {
    if (is(predicate, node, nodeIndex, parent)) {
      return null;
    }
    if (!node.children || !node.children.length) {
      return node;
    }

    // Move all living children to the beginning of the children array.

    var length = 0;

    for (var index = 0; index < node.children.length; ++index) {
      var child = preorder(node.children[index], index, node);

      if (child) {
        node.children[length++] = child;
      }
    }

    if (!length && opts.cascade) {
      // Cascade delete.
      return null;
    }

    node.children.length = length;
    return node;
  }(ast, null, null));
};


function arrayPredicate (nodes) {
  return function (node) {
    return nodes.indexOf(node) >= 0;
  };
}
