'use strict'

var Promise = require('bluebird')
var dictionary = require('../dictionary')
var Util = require('../../utils')

/**
 * Conversation class
 * Reading conversation strings and adding replies
 */

class Conversation {
  constructor() {
    this.replies = ['Hi!', 'Hello! I am Chevy!', 'Hey there!', 'Hey!', 'Chevy reporting for duty!']
  }

  /**
   * Parses the context object for any potential conversation
   * keywords and adds the appropriate replies
   * @param  {[object]} context
   * @return {[object]} context
   */
  parse(context) {
    return new Promise(function(resolve, reject) {
      var tokens = context.queryTokens

      for(var i=0; i<tokens.length; i++) {
        if (Util.string_match(dictionary.greetings, tokens[i])) {
          context.action = 'greet'
          // context.replies.push(Util.random_element(this.replies))
          // context.replies.push('Prompt for carpool goes here')
          break
        }
      }

      return resolve(context)
    });
  }
}

module.exports = new Conversation()
