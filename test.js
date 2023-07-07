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

    remove(tree, {value: '2'})

    assert.deepEqual(tree, u('emphasis', [leaf1]))
  })

  await t.test('should remove parent nodes', function () {
    const leaf1 = u('text', '1')
    const leaf2 = u('text', '2')
    const parent = u('emphasis', [leaf1])
    const children = [parent, leaf2]
    /** @type {Root} */
    const tree = u('root', children)

    remove(tree, test)

    assert.deepEqual(tree, u('root', [leaf2]))

    /**
     * @param {Node} node
     * @returns {boolean}
     */
    function test(node) {
      return node === parent
    }
  })

  await t.test('should not check root nodes', function () {
    /** @type {Root} */
    const tree = u('root', [u('emphasis', [u('text', '1')]), u('text', '2')])

    remove(tree, 'root')

    assert.deepEqual(
      tree,
      u('root', [u('emphasis', [u('text', '1')]), u('text', '2')])
    )
  })

  await t.test('should cascade (remove) root nodes', function () {
    /** @type {Root} */
    const tree = u('root', [u('emphasis', [u('text', '1')]), u('text', '2')])

    remove(tree, 'text')

    assert.deepEqual(tree, u('root', []))
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
    remove(tree, {cascade: true}, 'text')
    assert.deepEqual(tree, u('root', []))
  })

  await t.test('should support `cascade = false`', function () {
    const leaf1 = u('text', '1')
    const leaf2 = u('text', '2')
    const nodeChildren = [leaf1]
    const node = u('emphasis', nodeChildren)
    const siblings = [node, leaf2]
    /** @type {Root} */
    const tree = u('root', siblings)

    remove(tree, {cascade: false}, 'text')

    assert.deepEqual(tree, u('root', [u('emphasis', [])]))
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
