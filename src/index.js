/**
 *
 * @module fun-async
 */
;(() => {
  'use strict'

  /* imports */
  const { append, take, from, last } = require('fun-array')
  const fn = require('fun-function')

  /**
   *
   * @function module:fun-async.traverse
   *
   * @param {Function} asyncF - inputs -> callback -> undefined
   * @param {Array<Array>} inputs - array of arrays of inputs to traverse
   * @param {Function} callback - handle results
   *
   * @return undefined
   */
  const traverse = (asyncF, inputs, callback) =>
    inputs.map(fn.id).forEach((args, i, results) =>
      fn.apply(
        append(
          (...args) => {
            results[i] = args
            if (i + 1 === inputs.length) {
              callback(null, results)
            }
          },
          args
        ),
        asyncF
      )
    )

  /**
   *
   * @function module:fun-async.dimap
   *
   * @param {Function} f - a -> b
   * @param {Function} g - c -> d
   * @param {Function} asyncF - inputs -> callback -> undefined
   *
   * @return {Function} inputs -> callback -> undefined
   */
  const dimap = (f, g, asyncF) => (input, cb) =>
    asyncF(
      f(input),
      (error, result) => error ? cb(error) : cb(null, g(result))
    )

  /**
   *
   * @function module:fun-async.contramap
   *
   * @param {Function} f - a -> b
   * @param {Function} asyncF - inputs -> callback -> undefined
   *
   * @return {Function} inputs -> callback -> undefined
   */
  const contramap = (f, asyncF) => (input, cb) =>
    asyncF(
      f(input),
      (error, result) => error ? cb(error) : cb(null, result)
    )

  /**
   *
   * @function module:fun-async.map
   *
   * @param {Function} f - a -> b
   * @param {Function} asyncF - inputs -> callback -> undefined
   *
   * @return {Function} inputs -> callback -> undefined
   */
  const map = (f, asyncF) => (...args) =>
    (cb => applyArgsWithCallback(
      args,
      (error, result) => error ? cb(error) : cb(null, f(result))
    )(asyncF))(last(args))

  /**
   *
   * @function module:fun-async.of
   *
   * @param {Function} f - a -> b
   *
   * @return {Function} inputs -> callback -> undefined
   */
  const of = f => (inputs, callback) => callback(null, f(inputs))

  /**
   *
   * @function module:fun-async.id
   *
   * @param {*} input - to pass along
   * @param {Function} callback - handle results
   *
   * @return undefined
   */
  const id = (input, callback) => callback(null, input)

  /**
   *
   * @function module:fun-async.k
   *
   * @param {*} value - to return
   *
   * @return {Function} inputs -> callback -> undefined
   */
  const k = value => (...args) => last(args)(null, value)

  /**
   *
   * @function module:fun-async.composeAll
   *
   * @param {Array<Function>} fs - inputs -> callback -> undefined
   *
   * @return {Function} inputs -> callback -> undefined
   */
  const composeAll = fs => fs.reduce(compose, id)

  /**
   *
   * @function module:fun-async.pipeAll
   *
   * @param {Array<Function>} fs - inputs -> callback -> undefined
   *
   * @return {Function} inputs -> callback -> undefined
   */
  const pipeAll = fs => fs.reduce(pipe, id)

  /**
   *
   * @function module:fun-async.pipe
   *
   * @param {Function} f - inputs -> callback -> undefined
   * @param {Function} g - inputs -> callback -> undefined
   *
   * @return {Function} inputs -> callback -> undefined
   */
  const pipe = (f, g) => compose(g, f)

  /**
   *
   * @function module:fun-async.compose
   *
   * @param {Function} f - inputs -> callback -> undefined
   * @param {Function} g - inputs -> callback -> undefined
   *
   * @return {Function} inputs -> callback -> undefined
   */
  const compose = (f, g) => (...args) =>
    (cb => applyArgsWithCallback(
      args,
      (error, result) => error ? cb(error) : f(result, cb)
    )(g))(last(args))

  const applyArgsWithCallback = (args, callback) =>
    fn.apply(append(callback, take(-1, from(args))))

  /* exports */
  module.exports = {
    id: fn.curry(id),
    k: k,
    of: of,
    compose: fn.curry(compose),
    composeAll: composeAll,
    pipe: fn.curry(pipe),
    pipeAll: pipeAll,
    map: fn.curry(map),
    contramap: fn.curry(contramap),
    dimap: fn.curry(dimap),
    traverse: fn.curry(traverse)
  }
})()

