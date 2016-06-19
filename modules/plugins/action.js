'use strict'

var dictionary = require('../dictionary')
var ArrayUtils = require('../../array-utils')

/**
 * Action class
 *
 */

class Action {
  /**
   * Gets the actions required from the context object
   * and performs them
   * @param  {[object]} context
   * @return {[object]} context
   */
  parse(context) {

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
  rideSearch(origin, destination, date) {

  }
}

module.exports = new Action()
