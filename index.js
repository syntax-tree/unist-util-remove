/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('unist').Parent} Parent
 *
 * @typedef {import('unist-util-is').Type} Type
 * @typedef {import('unist-util-is').Props} Props
 * @typedef {import('unist-util-is').TestFunctionAnything} TestFunctionAnything
 */

/**
 * @typedef {Object} RemoveOptions
 * @property {boolean} [cascade] Whether to drop parent nodes if they had children, but all their children were filtered out test
 */

import {convert} from 'unist-util-is'

/** @type {Array.<Node>} */
var empty = []

export var remove =
  /**
   * @type {(
   *  (<T extends Node>(node: T, options: RemoveOptions, test: Type|Props|TestFunctionAnything|Array<Type|Props|TestFunctionAnything>) => T|null) &
   *  (<T extends Node>(node: T, test: Type|Props|TestFunctionAnything|Array<Type|Props|TestFunctionAnything>) => T|null)
   * )}
   */
  (
    /**
     * Mutate the given tree by removing all nodes that pass `test`.
     * The tree is walked in preorder (NLR), visiting the node itself, then its head, etc.
     *
     * @param {Node} tree Tree to filter
     * @param {RemoveOptions} options Whether to drop parent nodes if they had children, but all their children were filtered out. Default is `{cascade: true}`
     * @param {Type|Props|TestFunctionAnything|Array<Type|Props|TestFunctionAnything>} test is-compatible test (such as a type)
     * @returns {Node|null}
     */
    function (tree, options, test) {
      var is = convert(test || options)
      var cascade =
        options.cascade === undefined || options.cascade === null
          ? true
          : options.cascade

      return preorder(tree, null, null)

      /**
       * Check and remove nodes recursively in preorder.
       * For each composite node, modify its children array in-place.
       *
       * @param {Node} node
       * @param {number|null} index
       * @param {Parent|null} parent
       * @returns {Node|null}
       */
      function preorder(node, index, parent) {
        /** @type {Array.<Node>} */
        // @ts-ignore looks like a parent.
        var children = node.children || empty
        var childIndex = -1
        var position = 0

        if (is(node, index, parent)) {
          return null
        }

        if (children.length > 0) {
          // Move all living children to the beginning of the children array.
          while (++childIndex < children.length) {
            // @ts-ignore looks like a parent.
            if (preorder(children[childIndex], childIndex, node)) {
              children[position++] = children[childIndex]
            }
          }

          // Cascade delete.
          if (cascade && !position) {
            return null
          }

          // Drop other nodes.
          children.length = position
        }

        return node
      }
    }
  )
