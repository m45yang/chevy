'use strict'

var dictionary = require('../dictionary')
var Util = require('../../utils')

/**
 * Gets the actions required from the context object
 * and performs them
 * @param  {[object]} context
 * @return {[object]} context
 */
var parse = function(context) {
  var actions = context.actions

  if (actions.indexOf('search') > -1) {
    rideSearch(context.origin, context.destination)
  }

  return context
}

/**
 * Searches facebook carpool group for drivers leaving
 * from origin to destination on date
 * @param  {[string]} origin
 * @param  {[string]} destination
 * @param  {[Date]}   date
 * @return {[object]} payload
 */
var rideSearch = function(origin, destination, date) {
  console.log('search', origin, 'to', destination)
}

module.exports = parse
