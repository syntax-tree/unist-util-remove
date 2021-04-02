// TypeScript Version: 3.5

import {Node} from 'unist'
import {Test} from 'unist-util-is'

declare namespace remove {
  interface RemoveOptions {
    /**
     * Whether to drop parent nodes if they had children, but all their children were filtered out test
     */
    cascade?: boolean
  }
}

/**
 *
 * Mutate the given tree by removing all nodes that pass test. The tree is walked in preorder (NLR), visiting the node itself, then its head, etc.
 *
 * @param tree      Tree to filter
 * @param test      is-compatible test (such as a type)
 */
export function remove(tree: Node, test?: Test<Node>): Node
/**
 *
 * Mutate the given tree by removing all nodes that pass test. The tree is walked in preorder (NLR), visiting the node itself, then its head, etc.
 *
 * @param tree      Tree to filter
 * @param options   Whether to drop parent nodes if they had children, but all their children were filtered out. Default is {cascade: true}
 * @param test      is-compatible test (such as a type)
 */
export function remove<T extends Node>(
  tree: T,
  options?: remove.RemoveOptions,
  test?: Test<Node>
): T | null
