'use strict'

var test = require('tape')
var u = require('unist-builder')
var remove = require('.')

test('should compare nodes by partial properties', function(t) {
  var tree = u('node', [u('leaf', '1'), u('leaf', '2')])
  var children = tree.children
  var first = tree.children[0]

  var next = remove(tree, {value: '2'})

  t.equal(next, tree)
  t.deepEqual(tree, u('node', [first]))
  t.equal(tree.children, children)
  t.equal(tree.children[0], first)

  t.end()
})

test('should remove nodes with children', function(t) {
  var tree = u('root', [u('node', [u('leaf', '1')]), u('leaf', '2')])
  var children = tree.children
  var first = tree.children[0]
  var last = tree.children[1]

  var next = remove(tree, test)

  t.equal(next, tree)
  t.deepEqual(tree, u('root', [last]))
  t.equal(tree.children, children)
  t.equal(tree.children[0], last)

  t.end()

  function test(node) {
    return node === first
  }
})

test('should return `null` if root node is removed', function(t) {
  var tree = u('root', [u('node', [u('leaf', '1')]), u('leaf', '2')])

  t.equal(remove(tree, 'root'), null)

  t.end()
})

test('should cascade-remove parent nodes', function(t) {
  var tree = u('root', [u('node', [u('leaf', '1')]), u('leaf', '2')])
  var children = tree.children
  var first = children[0].children[0]
  var last = children[1]

  var next = remove(tree, test)

  t.equal(next, tree)
  t.deepEqual(tree, u('root', [last]))
  t.equal(tree.children, children)
  t.equal(tree.children[0], last)

  t.end()

  function test(node) {
    return node === first
  }
})

test('should cascade-remove root nodes', function(t) {
  var tree = u('root', [u('node', [u('leaf', '1')]), u('leaf', '2')])

  var next = remove(tree, 'leaf')

  t.equal(next, null)

  t.end()
})

test('should not cascade-remove nodes that were empty initially', function(t) {
  var tree = u('node', [u('node', []), u('node', [u('leaf')])])

  remove(tree, 'leaf')

  t.deepEqual(tree, u('node', [u('node', [])]))

  t.end()
})

test('should support type tests', function(t) {
  var tree = u('node', [u('node', [u('leaf', '1')]), u('leaf', '2')])

  remove(tree, {cascade: false}, 'leaf')

  t.deepEqual(tree, u('node', [u('node', [])]))

  t.end()
})

test('should support function tests', function(t) {
  var tree = u('node', [u('node', [u('leaf', '1')]), u('leaf', '2')])

  remove(tree, {cascade: false}, test)

  t.deepEqual(tree, u('node', [u('node', []), u('leaf', '2')]))

  t.end()

  function test(node) {
    return node.value === '1'
  }
})

test('opts.cascade = true', function(t) {
  var tree = u('root', [u('node', [u('leaf', '1')]), u('leaf', '2')])

  var next = remove(tree, {cascade: true}, 'leaf')

  t.equal(next, null)

  t.end()
})

test('opts.cascade = false', function(t) {
  var tree = u('root', [u('node', [u('leaf', '1')]), u('leaf', '2')])
  var siblings = tree.children
  var node = siblings[0]
  var children = node.children

  var next = remove(tree, {cascade: false}, 'leaf')

  t.equal(next, tree)
  t.deepEqual(tree, u('root', [u('node', [])]))
  t.equal(tree.children, siblings)
  t.equal(tree.children[0], node)
  t.equal(tree.children[0].children, children)

  t.end()
})

test('example from readme', function(t) {
  var tree = u('root', [
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
