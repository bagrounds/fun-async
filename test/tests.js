;(() => {
  'use strict'

  /* imports */
  const { add } = require('fun-scalar')
  const { apply, compose, composeAll } = require('fun-function')
  const arrange = require('fun-arrange')
  const { equal, equalDeep } = require('fun-predicate')
  const { map, of } = require('fun-array')
  const { async } = require('fun-test')
  const { get } = require('fun-lens')
  const { instanceOf } = require('fun-type')

  const get1 = x => get([x])

  const asyncError = (a, callback) => callback(Error('!!'))
  const asyncDouble = (a, callback) => callback(null, a * 2)
  const asyncAdd1 = (a, callback) => callback(null, a + 1)

  /* exports */
  module.exports = map(
    compose(
      async,
      arrange({ inputs: 0, predicate: 1, contra: 2 })
    ),
    [
      [
        [asyncDouble, map(of, [1, 2, 3])],
        composeAll([
          equalDeep([2, 4, 6]),
          map(get1(1)),
          get1(1)
        ]),
        get1('traverse')
      ],
      [
        [asyncDouble, map(of, [1, 2, 3])],
        composeAll([
          equalDeep([2, 4, 6]),
          map(get1(1)),
          get1(1)
        ]),
        get1('traverse')
      ],
      [
        [3],
        compose(instanceOf(Error), get1(0)),
        compose(
          apply([add(1), add(1), asyncError]),
          get1('dimap')
        )
      ],
      [
        [3],
        compose(equal(9), get1(1)),
        compose(
          apply([add(1), add(1), asyncDouble]),
          get1('dimap')
        )
      ],
      [
        [3],
        compose(instanceOf(Error), get1(0)),
        compose(apply([add(1), asyncError]), get1('contramap'))
      ],
      [
        [3],
        compose(equal(8), get1(1)),
        compose(
          apply([add(1), asyncDouble]),
          get1('contramap')
        )
      ],
      [
        [3],
        compose(instanceOf(Error), get1(0)),
        compose(apply([add(1), asyncError]), get1('map'))
      ],
      [
        [3],
        compose(equal(7), get1(1)),
        compose(apply([add(1), asyncDouble]), get1('map'))
      ],
      [
        [3],
        compose(instanceOf(Error), get1(0)),
        compose(apply([[asyncError, asyncDouble]]), get1('pipeAll'))
      ],
      [
        [3],
        compose(instanceOf(Error), get1(0)),
        compose(apply([[asyncAdd1, asyncError]]), get1('pipeAll'))
      ],
      [
        [3],
        compose(equal(8), get1(1)),
        compose(apply([[asyncAdd1, asyncDouble]]), get1('pipeAll'))
      ],
      [
        [3],
        compose(instanceOf(Error), get1(0)),
        compose(apply([asyncError, asyncDouble]), get1('pipe'))
      ],
      [
        [3],
        compose(instanceOf(Error), get1(0)),
        compose(apply([asyncAdd1, asyncError]), get1('pipe'))
      ],
      [
        [3],
        compose(equal(8), get1(1)),
        compose(apply([asyncAdd1, asyncDouble]), get1('pipe'))
      ],
      [
        [3],
        compose(instanceOf(Error), get1(0)),
        compose(
          apply([[asyncError, asyncDouble]]),
          get1('composeAll')
        )
      ],
      [
        [3],
        compose(instanceOf(Error), get1(0)),
        compose(apply([[asyncAdd1, asyncError]]), get1('composeAll'))
      ],
      [
        [3],
        compose(equal(7), get1(1)),
        compose(apply([[asyncAdd1, asyncDouble]]), get1('composeAll'))
      ],
      [
        [3],
        compose(instanceOf(Error), get1(0)),
        compose(apply([asyncError, asyncDouble]), get1('compose'))
      ],
      [
        [3],
        compose(instanceOf(Error), get1(0)),
        compose(apply([asyncAdd1, asyncError]), get1('compose'))
      ],
      [
        [3],
        compose(equal(7), get1(1)),
        compose(apply([asyncAdd1, asyncDouble]), get1('compose'))
      ],
      [
        [3],
        compose(equal(4), get1(1)),
        compose(apply([add(1)]), get1('of'))
      ],
      [
        [null],
        compose(equal(3), get1(1)),
        compose(apply([3]), get1('k'))
      ],
      [
        [6],
        compose(equal(6), get1(1)),
        get1('id')
      ]
    ])
})()

