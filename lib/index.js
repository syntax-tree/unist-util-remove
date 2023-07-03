/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('unist').Parent} Parent
 * @typedef {import('unist-util-is').Test} Test
 */

/**
 * @typedef Options
 *   Configuration.
 * @property {boolean | null | undefined} [cascade=true]
 *   Whether to drop parent nodes if they had children, but all their children
 *   were filtered out (default: `true`).
 */

import {convert} from 'unist-util-is'

/**
 * Change the given `tree` by removing all nodes that pass `test`.
 *
 * The tree is walked in preorder (NLR), visiting the node itself, then its
 * head, etc.
 *
 * @template {Node} Tree
 *   Node kind.
 *
 * @overload
 * @param {Tree} node
 * @param {Test} [test]
 * @returns {Tree | undefined}
 *
 * @overload
 * @param {Tree} node
 * @param {Options | null | undefined} options
 * @param {Test} [test]
 * @returns {Tree | undefined}
 *
 * @param {Tree} tree
 *   Tree to change.
 * @param {Options | Test} options
 *   Configuration (optional).
 * @param {Test} [test]
 *   `unist-util-is` compatible test.
 * @returns {Tree | undefined}
 *   The given `tree` without nodes that pass `test`.
 *
 *   `undefined` is returned if `tree` itself didn’t pass the test or is
 *   cascaded away.
 */
// To do: next major: don’t return `tree`.
export function remove(tree, options, test) {
  const is = convert(test || options)
  let cascade = true

  if (
    options &&
    typeof options === 'object' &&
    'cascade' in options &&
    typeof options.cascade === 'boolean'
  ) {
    cascade = options.cascade
  }

  return preorder(tree)

  /**
   * Check and remove nodes recursively in preorder.
   * For each composite node, modify its children array in-place.
   *
   * @template {Node} Kind
   * @param {Kind} node
   * @param {number | undefined} [index]
   * @param {Parent | undefined} [parent]
   * @returns {Kind | undefined}
   */
  function preorder(node, index, parent) {
    if (is(node, index, parent)) {
      return undefined
    }

    if ('children' in node && Array.isArray(node.children)) {
      const nodeAsParent = /** @type {Parent} */ (node)
      const children = nodeAsParent.children
      let oldChildIndex = -1
      let newChildIndex = 0

      if (children.length > 0) {
        // Move all living children to the beginning of the children array.
        while (++oldChildIndex < children.length) {
          if (preorder(children[oldChildIndex], oldChildIndex, nodeAsParent)) {
            children[newChildIndex++] = children[oldChildIndex]
          }
        }

        // Cascade delete.
        if (cascade && !newChildIndex) {
          return undefined
        }

        // Drop other nodes.
        children.length = newChildIndex
      }
    }

    return node
  }
}
