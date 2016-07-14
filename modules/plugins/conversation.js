'use strict'

var Promise    = require('bluebird')
var dictionary = require('../dictionary')
var Util       = require('../utils')

/**
 * Parses the context object for any potential conversation
 * keywords and adds the appropriate replies
 * @param  {[object]} context
 * @return {[object]} context
 */
var parse = function(context) {
  var tokens = context.queryTokens

  for(var i=0; i<tokens.length; i++) {
    if (Util.stringMatch(dictionary.greetings, tokens[i])) {
      context.actions.push('greet')
      break
    }
  }

  return Promise.resolve(context)
}

module.exports = parse
