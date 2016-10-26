'use strict'

var Promise    = require('bluebird')
var dictionary = require('./dictionary')
var Util       = require('./utils')

/**
 * Parses the context object for any potential search
 * keywords and performs the needed searches
 * @param  {[object]} context
 * @return {[object]} context
 */
var parse = function(context) {
  var tokens = context.queryTokens
  var origin = ''
  var destination = ''

  for(var i=0; i<tokens.length; i++) {
    if (Util.stringMatch(dictionary.search, tokens[i])) {
      origin = Util.getOrigin(tokens)
      destination = Util.getDestination(tokens, origin)
      if (origin !== '' && destination !== '') {
        context.actions.push('search')
        context.origin = origin
        context.destination = destination
      }
      else if (origin === '') {
        context.actions.push('requestOrigin')
      }
      else if (destination == '') {
        context.actions.push('requestDestination')
      }
      else {
        context.actions.push('requestOriginAndDestination')
      }
    }
  }

  return Promise.resolve(context)
}


module.exports = parse
