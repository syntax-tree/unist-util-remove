/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('unist').Literal<string>} Literal
 */

import assert from 'node:assert/strict'
import test from 'node:test'
import {u} from 'unist-builder'
import {remove} from './index.js'

test('should compare nodes by partial properties', () => {
  const tree = u('node', [u('leaf', '1'), u('leaf', '2')])
  const children = tree.children
  const first = tree.children[0]

  const next = remove(tree, {value: '2'})

  assert.equal(next, tree)
  assert.deepEqual(tree, u('node', [first]))
  assert.equal(tree.children, children)
  assert.equal(tree.children[0], first)
})

test('should remove nodes with children', () => {
  const tree = u('root', [u('node', [u('leaf', '1')]), u('leaf', '2')])
  const children = tree.children
  const first = tree.children[0]
  const last = tree.children[1]

  const next = remove(tree, test)

  assert.equal(next, tree)
  assert.deepEqual(tree, u('root', [last]))
  assert.equal(tree.children, children)
  assert.equal(tree.children[0], last)

  /**
   * @param {Node} node
   * @returns {boolean}
   */
  function test(node) {
    return node === first
  }
})

test('should return `null` if root node is removed', () => {
  const tree = u('root', [u('node', [u('leaf', '1')]), u('leaf', '2')])

  assert.equal(remove(tree, 'root'), null)
})

test('should cascade-remove parent nodes', () => {
  const tree = u('root', [u('node', [u('leaf', '1')]), u('leaf', '2')])
  const children = tree.children
  // @ts-expect-error it exists!
  const first = children[0].children[0]
  const last = children[1]

  const next = remove(tree, test)

  assert.equal(next, tree)
  assert.deepEqual(tree, u('root', [last]))
  assert.equal(tree.children, children)
  assert.equal(tree.children[0], last)

  /**
   * @param {Node} node
   * @returns {boolean}
   */
  function test(node) {
    return node === first
  }
})

test('should cascade-remove root nodes', () => {
  const tree = u('root', [u('node', [u('leaf', '1')]), u('leaf', '2')])

  const next = remove(tree, 'leaf')

  assert.equal(next, null)
})

test('should not cascade-remove nodes that were empty initially', () => {
  const tree = u('node', [u('node', []), u('node', [u('leaf')])])

  remove(tree, 'leaf')

  assert.deepEqual(tree, u('node', [u('node', [])]))
})

test('should support type tests', () => {
  const tree = u('node', [u('node', [u('leaf', '1')]), u('leaf', '2')])

  remove(tree, {cascade: false}, 'leaf')

  assert.deepEqual(tree, u('node', [u('node', [])]))
})

test('should support function tests', () => {
  const tree = u('node', [u('node', [u('leaf', '1')]), u('leaf', '2')])

  remove(tree, {cascade: false}, (node) => literal(node) && node.value === '1')

  assert.deepEqual(tree, u('node', [u('node', []), u('leaf', '2')]))
})

test('opts.cascade = true', () => {
  const tree = u('root', [u('node', [u('leaf', '1')]), u('leaf', '2')])

  const next = remove(tree, {cascade: true}, 'leaf')

  assert.equal(next, null)
})

test('opts.cascade = false', () => {
  const tree = u('root', [u('node', [u('leaf', '1')]), u('leaf', '2')])
  const siblings = tree.children
  const node = siblings[0]
  // @ts-expect-error it exists!
  const children = node.children

  const next = remove(tree, {cascade: false}, 'leaf')

  assert.equal(next, tree)
  assert.deepEqual(tree, u('root', [u('node', [])]))
  assert.equal(tree.children, siblings)
  assert.equal(tree.children[0], node)
  assert.equal(tree.children[0].children, children)
})

test('example from readme', () => {
  const tree = u('root', [
    u('leaf', '1'),
    u('node', [
      u('leaf', '2'),
      u('node', [u('leaf', '3'), u('other', '4')]),
      u('node', [u('leaf', '5')])
    ]),
    u('leaf', '6')
  ])

  assert.deepEqual(
    remove(tree, 'leaf'),
    u('root', [u('node', [u('node', [u('other', '4')])])])
  )
})

/**
 * @param {Node} node
 * @returns {node is Literal}
 */
function literal(node) {
  return 'value' in node
}
