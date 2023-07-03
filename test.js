/**
 * @typedef {import('unist').Literal<string>} Literal
 * @typedef {import('unist').Node} Node
 */

import assert from 'node:assert/strict'
import test from 'node:test'
import {u} from 'unist-builder'
import {remove} from 'unist-util-remove'

test('remove', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(Object.keys(await import('unist-util-remove')).sort(), [
      'remove'
    ])
  })

  await t.test('should compare nodes by partial properties', function () {
    const leaf1 = u('leaf', '1')
    const leaf2 = u('leaf', '2')
    const children = [leaf1, leaf2]
    const tree = u('node', children)

    const next = remove(tree, {value: '2'})

    assert.deepEqual(tree, u('node', [leaf1]))
    assert.equal(next, tree)
    assert.equal(next.children, children)
    assert.equal(next.children[0], leaf1)
  })

  await t.test('should remove parent nodes', function () {
    const leaf1 = u('leaf', '1')
    const leaf2 = u('leaf', '2')
    const parent = u('parent', [leaf1])
    const children = [parent, leaf2]
    const tree = u('root', children)

    const next = remove(tree, test)

    assert.deepEqual(tree, u('root', [leaf2]))
    assert.equal(next, tree)
    assert.equal(next.children, children)
    assert.equal(next.children[0], leaf2)

    /**
     * @param {Node} node
     * @returns {boolean}
     */
    function test(node) {
      return node === parent
    }
  })

  await t.test(
    'should return `undefined` if root node is removed',
    function () {
      const tree = u('root', [u('node', [u('leaf', '1')]), u('leaf', '2')])
      const next = remove(tree, 'root')

      assert.equal(next, undefined)
    }
  )

  await t.test('should cascade (remove) root nodes', function () {
    const tree = u('root', [u('node', [u('leaf', '1')]), u('leaf', '2')])
    const next = remove(tree, 'leaf')

    assert.equal(next, undefined)
  })

  await t.test(
    'should not cascade (remove) nodes that were empty initially',
    function () {
      const tree = u('node', [u('node', []), u('node', [u('leaf')])])

      remove(tree, 'leaf')

      assert.deepEqual(tree, u('node', [u('node', [])]))
    }
  )

  await t.test('should support type tests', function () {
    const tree = u('node', [u('node', [u('leaf', '1')]), u('leaf', '2')])

    remove(tree, {cascade: false}, 'leaf')

    assert.deepEqual(tree, u('node', [u('node', [])]))
  })

  await t.test('should support function tests', function () {
    const tree = u('node', [u('node', [u('leaf', '1')]), u('leaf', '2')])

    remove(tree, {cascade: false}, test)

    assert.deepEqual(tree, u('node', [u('node', []), u('leaf', '2')]))

    /**
     * @param {Node} node
     * @returns {boolean}
     */
    function test(node) {
      return literal(node) && node.value === '1'
    }
  })

  await t.test('should support `cascade = true`', function () {
    const tree = u('root', [u('node', [u('leaf', '1')]), u('leaf', '2')])
    const next = remove(tree, {cascade: true}, 'leaf')

    assert.equal(next, undefined)
  })

  await t.test('should support `cascade = false`', function () {
    const leaf1 = u('leaf', '1')
    const leaf2 = u('leaf', '2')
    const nodeChildren = [leaf1]
    const node = u('node', nodeChildren)
    const siblings = [node, leaf2]
    const tree = u('root', siblings)

    const next = remove(tree, {cascade: false}, 'leaf')

    assert.deepEqual(tree, u('root', [u('node', [])]))
    assert.equal(next, tree)
    assert.equal(next.children, siblings)
    assert.equal(next.children[0], node)
    assert.equal(next.children[0].children, nodeChildren)
  })

  await t.test('should support the example from readme', function () {
    const tree = u('root', [
      u('leaf', '1'),
      u('node', [
        u('leaf', '2'),
        u('node', [u('leaf', '3'), u('other', '4')]),
        u('node', [u('leaf', '5')])
      ]),
      u('leaf', '6')
    ])

    remove(tree, 'leaf')

    assert.deepEqual(
      tree,
      u('root', [u('node', [u('node', [u('other', '4')])])])
    )
  })
})

/**
 * @param {Node} node
 * @returns {node is Literal}
 */
function literal(node) {
  return 'value' in node
}
