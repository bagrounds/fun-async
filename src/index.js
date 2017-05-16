/**
 *
 * @module fun-async
 */
;(function () {
  'use strict'

  /* imports */
  var array = require('fun-array')
  var fn = require('fun-function')

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
    dimap: fn.curry(dimap)
  }

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
  function dimap (f, g, asyncF) {
    return function (input, cb) {
      asyncF(f(input), function callback (error, result) {
        if (error) {
          cb(error)
        } else {
          cb(null, g(result))
        }
      })
    }
  }

  /**
   *
   * @function module:fun-async.contramap
   *
   * @param {Function} f - a -> b
   * @param {Function} asyncF - inputs -> callback -> undefined
   *
   * @return {Function} inputs -> callback -> undefined
   */
  function contramap (f, asyncF) {
    return function (input, cb) {
      asyncF(f(input), function callback (error, result) {
        if (error) {
          cb(error)
        } else {
          cb(null, result)
        }
      })
    }
  }

  /**
   *
   * @function module:fun-async.map
   *
   * @param {Function} f - a -> b
   * @param {Function} asyncF - inputs -> callback -> undefined
   *
   * @return {Function} inputs -> callback -> undefined
   */
  function map (f, asyncF) {
    return function () {
      var cb = array.last(array.from(arguments))
      applyArgsWithCallback(arguments, callback)(asyncF)

      function callback (error, result) {
        if (error) {
          cb(error)
        } else {
          cb(null, f(result))
        }
      }
    }
  }

  /**
   *
   * @function module:fun-async.of
   *
   * @param {Function} f - a -> b
   *
   * @return {Function} inputs -> callback -> undefined
   */
  function of (f) {
    return function (inputs, callback) {
      callback(null, f(inputs))
    }
  }

  /**
   *
   * @function module:fun-async.id
   *
   * @param {*} input - to pass along
   * @param {Function} callback - handle results
   */
  function id (input, callback) {
    callback(null, input)
  }

  /**
   *
   * @function module:fun-async.k
   *
   * @param {*} value - to return
   *
   * @return {Function} inputs -> callback -> undefined
   */
  function k (value) {
    return function () {
      array.last(array.from(arguments))(null, value)
    }
  }

  /**
   *
   * @function module:fun-async.composeAll
   *
   * @param {Array<Function>} fs - inputs -> callback -> undefined
   *
   * @return {Function} inputs -> callback -> undefined
   */
  function composeAll (fs) {
    return fs.reduce(compose, id)
  }

  /**
   *
   * @function module:fun-async.pipeAll
   *
   * @param {Array<Function>} fs - inputs -> callback -> undefined
   *
   * @return {Function} inputs -> callback -> undefined
   */
  function pipeAll (fs) {
    return fs.reduce(pipe, id)
  }

  /**
   *
   * @function module:fun-async.pipe
   *
   * @param {Function} f - inputs -> callback -> undefined
   * @param {Function} g - inputs -> callback -> undefined
   *
   * @return {Function} inputs -> callback -> undefined
   */
  function pipe (f, g) {
    return compose(g, f)
  }

  /**
   *
   * @function module:fun-async.compose
   *
   * @param {Function} f - inputs -> callback -> undefined
   * @param {Function} g - inputs -> callback -> undefined
   *
   * @return {Function} inputs -> callback -> undefined
   */
  function compose (f, g) {
    return function () {
      var cb = array.last(array.from(arguments))
      applyArgsWithCallback(arguments, callback)(g)

      function callback (error, result) {
        if (error) {
          cb(error)
        } else {
          f(result, cb)
        }
      }
    }
  }

  function applyArgsWithCallback (args, callback) {
    return fn.apply(array.append(callback, array.take(-1, array.from(args))))
  }
})()

