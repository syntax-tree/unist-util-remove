/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('unist').Literal<string>} Literal
 * @typedef {import('unist').Parent} Parent
 *
 * @typedef {string} Type
 * @typedef {Record<string, unknown>} Props
 * @typedef {import('unist-util-is').TestFunctionAnything} TestFunctionAnything
 */

import test from 'tape'
import {u} from 'unist-builder'
import {remove} from './index.js'

test('should compare nodes by partial properties', (t) => {
  const tree = u('node', [u('leaf', '1'), u('leaf', '2')])
  const children = tree.children
  const first = tree.children[0]

  const next = remove(tree, {value: '2'})

  t.equal(next, tree)
  t.deepEqual(tree, u('node', [first]))
  t.equal(tree.children, children)
  t.equal(tree.children[0], first)

  t.end()
})

test('should remove nodes with children', (t) => {
  const tree = u('root', [u('node', [u('leaf', '1')]), u('leaf', '2')])
  const children = tree.children
  const first = tree.children[0]
  const last = tree.children[1]

  const next = remove(tree, test)

  t.equal(next, tree)
  t.deepEqual(tree, u('root', [last]))
  t.equal(tree.children, children)
  t.equal(tree.children[0], last)

  t.end()

  /**
   * @param {Node} node
   * @returns {boolean}
   */
  function test(node) {
    return node === first
  }
})

test('should return `null` if root node is removed', (t) => {
  const tree = u('root', [u('node', [u('leaf', '1')]), u('leaf', '2')])

  t.equal(remove(tree, 'root'), null)

  t.end()
})

test('should cascade-remove parent nodes', (t) => {
  const tree = u('root', [u('node', [u('leaf', '1')]), u('leaf', '2')])
  const children = tree.children
  // @ts-expect-error it exists!
  const first = children[0].children[0]
  const last = children[1]

  const next = remove(tree, test)

  t.equal(next, tree)
  t.deepEqual(tree, u('root', [last]))
  t.equal(tree.children, children)
  t.equal(tree.children[0], last)

  t.end()

  /**
   * @param {Node} node
   * @returns {boolean}
   */
  function test(node) {
    return node === first
  }
})

test('should cascade-remove root nodes', (t) => {
  const tree = u('root', [u('node', [u('leaf', '1')]), u('leaf', '2')])

  const next = remove(tree, 'leaf')

  t.equal(next, null)

  t.end()
})

test('should not cascade-remove nodes that were empty initially', (t) => {
  const tree = u('node', [u('node', []), u('node', [u('leaf')])])

  remove(tree, 'leaf')

  t.deepEqual(tree, u('node', [u('node', [])]))

  t.end()
})

test('should support type tests', (t) => {
  const tree = u('node', [u('node', [u('leaf', '1')]), u('leaf', '2')])

  remove(tree, {cascade: false}, 'leaf')

  t.deepEqual(tree, u('node', [u('node', [])]))

  t.end()
})

test('should support function tests', (t) => {
  const tree = u('node', [u('node', [u('leaf', '1')]), u('leaf', '2')])

  remove(tree, {cascade: false}, (node) => literal(node) && node.value === '1')

  t.deepEqual(tree, u('node', [u('node', []), u('leaf', '2')]))

  t.end()
})

test('opts.cascade = true', (t) => {
  const tree = u('root', [u('node', [u('leaf', '1')]), u('leaf', '2')])

  const next = remove(tree, {cascade: true}, 'leaf')

  t.equal(next, null)

  t.end()
})

test('opts.cascade = false', (t) => {
  const tree = u('root', [u('node', [u('leaf', '1')]), u('leaf', '2')])
  const siblings = tree.children
  const node = siblings[0]
  // @ts-expect-error it exists!
  const children = node.children

  const next = remove(tree, {cascade: false}, 'leaf')

  t.equal(next, tree)
  t.deepEqual(tree, u('root', [u('node', [])]))
  t.equal(tree.children, siblings)
  t.equal(tree.children[0], node)
  // @ts-expect-error it exists!
  t.equal(tree.children[0].children, children)

  t.end()
})

test('example from readme', (t) => {
  const tree = u('root', [
    u('leaf', '1'),
    u('node', [
      u('leaf', '2'),
      u('node', [u('leaf', '3'), u('other', '4')]),
      u('node', [u('leaf', '5')])
    ]),
    u('leaf', '6')
  ])

  t.deepEqual(
    remove(tree, 'leaf'),
    u('root', [u('node', [u('node', [u('other', '4')])])])
  )

  t.end()
})

/**
 * @param {Node} node
 * @returns {node is Literal}
 */
function literal(node) {
  return 'value' in node
}
