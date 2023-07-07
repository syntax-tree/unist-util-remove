/**
 * @typedef {import('mdast').Text} Text
 * @typedef {import('mdast').Emphasis} Emphasis
 * @typedef {import('mdast').Root} Root
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
    const leaf1 = u('text', '1')
    const leaf2 = u('text', '2')
    const children = [leaf1, leaf2]
    /** @type {Emphasis} */
    const tree = u('emphasis', children)

    const next = remove(tree, {value: '2'})

    assert.deepEqual(tree, u('emphasis', [leaf1]))
    assert.equal(next, tree)
    assert.equal(next.children, children)
    assert.equal(next.children[0], leaf1)
  })

  await t.test('should remove parent nodes', function () {
    const leaf1 = u('text', '1')
    const leaf2 = u('text', '2')
    const parent = u('emphasis', [leaf1])
    const children = [parent, leaf2]
    /** @type {Root} */
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
      /** @type {Root} */
      const tree = u('root', [u('emphasis', [u('text', '1')]), u('text', '2')])
      const next = remove(tree, 'root')

      assert.equal(next, undefined)
    }
  )

  await t.test('should cascade (remove) root nodes', function () {
    /** @type {Root} */
    const tree = u('root', [u('emphasis', [u('text', '1')]), u('text', '2')])
    const next = remove(tree, 'text')

    assert.equal(next, undefined)
  })

  await t.test(
    'should not cascade (remove) nodes that were empty initially',
    function () {
      /** @type {Root} */
      const tree = u('root', [
        u('emphasis', []),
        u('emphasis', [u('text', 'x')])
      ])

      remove(tree, 'text')

      assert.deepEqual(tree, u('root', [u('emphasis', [])]))
    }
  )

  await t.test('should support type tests', function () {
    /** @type {Root} */
    const tree = u('root', [u('emphasis', [u('text', '1')]), u('text', '2')])

    remove(tree, {cascade: false}, 'text')

    assert.deepEqual(tree, u('root', [u('emphasis', [])]))
  })

  await t.test('should support function tests', function () {
    /** @type {Emphasis} */
    const tree = u('emphasis', [
      u('emphasis', [u('text', '1')]),
      u('text', '2')
    ])

    remove(tree, {cascade: false}, test)

    assert.deepEqual(tree, u('emphasis', [u('emphasis', []), u('text', '2')]))

    /**
     * @param {Node} node
     * @returns {boolean}
     */
    function test(node) {
      return node.type === 'text' && 'value' in node && node.value === '1'
    }
  })

  await t.test('should support `cascade = true`', function () {
    /** @type {Root} */
    const tree = u('root', [u('emphasis', [u('text', '1')]), u('text', '2')])
    const next = remove(tree, {cascade: true}, 'text')

    assert.equal(next, undefined)
  })

  await t.test('should support `cascade = false`', function () {
    const leaf1 = u('text', '1')
    const leaf2 = u('text', '2')
    const nodeChildren = [leaf1]
    const node = u('emphasis', nodeChildren)
    const siblings = [node, leaf2]
    /** @type {Root} */
    const tree = u('root', siblings)

    const next = remove(tree, {cascade: false}, 'text')

    assert.deepEqual(tree, u('root', [u('emphasis', [])]))
    assert.equal(next, tree)
    assert.equal(next.children, siblings)
    assert.equal(next.children[0], node)
    assert.equal(next.children[0].children, nodeChildren)
  })

  await t.test('should support the example from readme', function () {
    /** @type {Root} */
    const tree = u('root', [
      u('text', '1'),
      u('emphasis', [
        u('text', '2'),
        u('emphasis', [u('text', '3'), u('inlineCode', '4')]),
        u('emphasis', [u('text', '5')])
      ]),
      u('text', '6')
    ])

    remove(tree, 'text')

    assert.deepEqual(
      tree,
      u('root', [u('emphasis', [u('emphasis', [u('inlineCode', '4')])])])
    )
  })
})
