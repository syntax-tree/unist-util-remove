'use strict';


module.exports = function (ast, nodes, opts) {
  if (!Array.isArray(nodes)) {
    nodes = [nodes];
  }

  opts = opts || {};
  opts.cascade = opts.cascade || opts.cascade === undefined;

  // Check and remove nodes recursively in preorder.
  // For each composite node, modify its children array in-place.
  return (function preorder (node) {
    if (nodes.indexOf(node) >= 0) {
      return null;
    }
    if (!node.children) {
      return node;
    }

    // Move all living children to the beginning of the children array.

    var length = 0;

    for (var index = 0; index < node.children.length; ++index) {
      var child = preorder(node.children[index]);

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
  }(ast));
};
