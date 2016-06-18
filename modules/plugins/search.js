'use strict'

var dictionary = require('../dictionary')
var ArrayUtils = require('../../array-utils')

/**
 * Carpool search class
 * Reading search query strings and adding replies
 */

class Search {
  /**
   * Parses the context object for any potential search
   * keywords and performs the needed searches
   * @param  {[object]} context
   * @return {[object]} context
   */
  parse(context) {
    var tokens = context.queryTokens
    var origin = ''
    var destination = ''

    for(var i=0; i<tokens.length; i++) {
      if (ArrayUtils.string_match(dictionary.search, tokens[i])) {
        origin = ArrayUtils.getOrigin(tokens)
        destination = ArrayUtils.getDestination(tokens)
        if (origin !== '' && destination !== '') {
          context.replies.push('Here are some rides you can take from ' + origin + ' to ' + destination + '!')
        } else if (origin === '') {
          context.replies.push('Origin missing')
        } else if (destination == '') {
          context.replies.push('Destination missing')
        } else {
          context.replies.push('Origin and destination missing')
        }
        break
      }
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
  rideSearch(origin, destination, date) {

  }
}

module.exports = new Search()
