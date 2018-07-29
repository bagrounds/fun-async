;(function () {
  'use strict'

  /* imports */
  var scalar = require('fun-scalar')
  var fn = require('fun-function')
  var object = require('fun-object')
  var arrange = require('fun-arrange')
  var predicate = require('fun-predicate')
  var array = require('fun-array')
  var funTest = require('fun-test')

  function asyncError (a, callback) {
    callback(Error('!!'))
  }

  function asyncDouble (a, callback) {
    callback(null, a * 2)
  }

  function asyncAdd1 (a, callback) {
    callback(null, a + 1)
  }

  /* exports */
  module.exports = [
    [
      [asyncDouble, [1, 2, 3].map(array.of)],
      fn.composeAll([
        predicate.equalDeep([2, 4, 6]),
        array.map(array.get(1)),
        array.get(1)
      ]),
      object.get('traverse')
    ],
    [
      [3],
      fn.compose(predicate.type('Error'), array.get(0)),
      fn.compose(
        fn.apply([scalar.add(1), scalar.add(1), asyncError]),
        object.get('dimap')
      )
    ],
    [
      [3],
      fn.compose(predicate.equal(9), array.get(1)),
      fn.compose(
        fn.apply([scalar.add(1), scalar.add(1), asyncDouble]),
        object.get('dimap')
      )
    ],
    [
      [3],
      fn.compose(predicate.type('Error'), array.get(0)),
      fn.compose(fn.apply([scalar.add(1), asyncError]), object.get('contramap'))
    ],
    [
      [3],
      fn.compose(predicate.equal(8), array.get(1)),
      fn.compose(
        fn.apply([scalar.add(1), asyncDouble]),
        object.get('contramap')
      )
    ],
    [
      [3],
      fn.compose(predicate.type('Error'), array.get(0)),
      fn.compose(fn.apply([scalar.add(1), asyncError]), object.get('map'))
    ],
    [
      [3],
      fn.compose(predicate.equal(7), array.get(1)),
      fn.compose(fn.apply([scalar.add(1), asyncDouble]), object.get('map'))
    ],
    [
      [3],
      fn.compose(predicate.type('Error'), array.get(0)),
      fn.compose(fn.apply([[asyncError, asyncDouble]]), object.get('pipeAll'))
    ],
    [
      [3],
      fn.compose(predicate.type('Error'), array.get(0)),
      fn.compose(fn.apply([[asyncAdd1, asyncError]]), object.get('pipeAll'))
    ],
    [
      [3],
      fn.compose(predicate.equal(8), array.get(1)),
      fn.compose(fn.apply([[asyncAdd1, asyncDouble]]), object.get('pipeAll'))
    ],
    [
      [3],
      fn.compose(predicate.type('Error'), array.get(0)),
      fn.compose(fn.apply([asyncError, asyncDouble]), object.get('pipe'))
    ],
    [
      [3],
      fn.compose(predicate.type('Error'), array.get(0)),
      fn.compose(fn.apply([asyncAdd1, asyncError]), object.get('pipe'))
    ],
    [
      [3],
      fn.compose(predicate.equal(8), array.get(1)),
      fn.compose(fn.apply([asyncAdd1, asyncDouble]), object.get('pipe'))
    ],
    [
      [3],
      fn.compose(predicate.type('Error'), array.get(0)),
      fn.compose(
        fn.apply([[asyncError, asyncDouble]]),
        object.get('composeAll')
      )
    ],
    [
      [3],
      fn.compose(predicate.type('Error'), array.get(0)),
      fn.compose(fn.apply([[asyncAdd1, asyncError]]), object.get('composeAll'))
    ],
    [
      [3],
      fn.compose(predicate.equal(7), array.get(1)),
      fn.compose(fn.apply([[asyncAdd1, asyncDouble]]), object.get('composeAll'))
    ],
    [
      [3],
      fn.compose(predicate.type('Error'), array.get(0)),
      fn.compose(fn.apply([asyncError, asyncDouble]), object.get('compose'))
    ],
    [
      [3],
      fn.compose(predicate.type('Error'), array.get(0)),
      fn.compose(fn.apply([asyncAdd1, asyncError]), object.get('compose'))
    ],
    [
      [3],
      fn.compose(predicate.equal(7), array.get(1)),
      fn.compose(fn.apply([asyncAdd1, asyncDouble]), object.get('compose'))
    ],
    [
      [3],
      fn.compose(predicate.equal(4), array.get(1)),
      fn.compose(fn.apply([scalar.add(1)]), object.get('of'))
    ],
    [
      [null],
      fn.compose(predicate.equal(3), array.get(1)),
      fn.compose(fn.apply([3]), object.get('k'))
    ],
    [
      [6],
      fn.compose(predicate.equal(6), array.get(1)),
      object.get('id')
    ]
  ].map(arrange({ inputs: 0, predicate: 1, contra: 2 })).map(funTest.async)
})()

