'use strict'

var Promise = require('bluebird')
var dictionary = require('../dictionary')
var Util = require('../../utils')

/**
 * Parses the context object for any potential conversation
 * keywords and adds the appropriate replies
 * @param  {[object]} context
 * @return {[object]} context
 */
var parse = function(context) {
  var tokens = context.queryTokens

  for(var i=0; i<tokens.length; i++) {
    if (Util.string_match(dictionary.greetings, tokens[i])) {
      context.actions.push('greet')
      // context.replies.push(ArrayUtils.random_element(['Hi!', 'Hello! I am Chevy!', 'Hey there!', 'Hey!', 'Chevy reporting for duty!']))
      // context.replies.push('Prompt for carpool goes here')
      break
    }
  }
}

module.exports = parse
