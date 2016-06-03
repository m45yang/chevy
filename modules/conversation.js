'use strict'

var natural = require('natural')
var dictionary = require('./dictionary')
var ArrayUtils = require('../array-utils')

/**
 * Conversation class
 * Reading conversation strings and adding replies
 */

class Conversation {
  constructor() {
    this.tokenizer = new natural.WordTokenizer()
  }

  /**
   * Parses the context object for any potential conversation
   * keywords and adds the appropriate replies
   * @param  {[object]} context
   * @return {[object]} context
   */
  parse(context) {
    var query = context.query
    var tokens = this.tokenizer.tokenize(query)

    for(var i=0; i<tokens.length; i++) {
      if (ArrayUtils.string_match(dictionary.greetings, tokens[i])) {
        context.replies.push(ArrayUtils.random_element(['Hi!', 'Hello! I am Chevy!', 'Hey there!', 'Hey!', 'Chevy reporting for duty!']))
        context.replies.push('Prompt for carpool goes here')
        break
      }
    }

    return context
  }
}

module.exports = new Conversation()
