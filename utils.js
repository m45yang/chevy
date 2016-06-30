'use strict'

var natural = require('natural')
var dictionary = require('./modules/dictionary')
var MIN_MATCH_THRESHOLD = 0.95

/**
 * Utilify functions
 */


/**
 * Returns a random element in an array
 * @param  {[array]} array
 * @return {[object]}
 */
var randomElement = function(array) {
  return array[Math.floor(Math.random() * array.length)]
}

/**
 * Uses the Jaro-Winkler string distance algorithm to determine if
 * there is a plausible match for @word within @wordlist
 * @param  {[array]} wordlist [array of words to check]
 * @param  {[string]} word    [word to match]
 * @return {[bool]}           [true for yes, false for no]
 */
var stringMatch = function(wordlist, word) {
  var match = false
  var coefficient

  wordlist.forEach(function(element, index) {
    coefficient = natural.JaroWinklerDistance(word, element)
    if (coefficient > MIN_MATCH_THRESHOLD) {
      match = true
    }
  })

  return match
}

/**
 * Uses the Jaro-Winkler string distance algorithm to determine if
 * there is a plausible match for a word within @inputlist with
 * any word in @wordlist
 * @param  {[array]} wordlist  [array of words to check]
 * @param  {[array]} inputlist [array of words to match]
 * @return {[bool]}            [true for yes, false for no]
 */
var arrayStringMatch = function(wordlist, inputlist) {
  var match = false
  var coefficient

  inputList.forEach(function(input, index) {
    wordlist.forEach(function(word, index) {
      coefficient = natural.JaroWinklerDistance(word, input)
      if (coefficient > MIN_MATCH_THRESHOLD) {
        match = true
      }
    })
  })
}

/**
 * Dumb function to find the origin of a
 * carpool search query
 * Finds the word after the keyword 'from' and assumes that
 * to be the origin
 * @param  {[array]}  tokens
 * @return {[string]} origin
 */
var getOrigin = function(tokens) {
  var origin = ''

  tokens.forEach(function(element, index, tokens) {
    if (origin !== '') return

    var oneWord = element.toLowerCase()
    var twoWord = (oneWord + tokens[index + 1]).toLowerCase()

    if (stringMatch(dictionary.locations.oneWord, oneWord)) {
      origin = oneWord
    }
    else if (stringMatch(dictionary.locations.twoWord, twoWord)) {
      origin = twoWord
    }
  })
  return origin
}

/**
 * Function to find the destination of a
 * carpool search query
 * Destination cannot match @origin
 * @param  {[array]}  tokens
 * @param  {[string]} origin
 * @return {[string]} destination
 */
var getDestination = function(tokens, origin) {
  var keyword = 'to'
  var destination = ''


  tokens.forEach(function(token, index, tokens) {
    if (destination !== '') return

    var oneWord = token.toLowerCase()
    var twoWord = (oneWord + tokens[index + 1]).toLowerCase()

    if (stringMatch(dictionary.locations.oneWord, oneWord)) {
      destination = origin !== oneWord ? oneWord : ''
    }
    else if (stringMatch(dictionary.locations.twoWord, twoWord)) {
      destination = origin !== twoWord ? twoWord : ''
    }
  })
  return destination
}

module.exports = {
  randomElement: randomElement,
  stringMatch: stringMatch,
  arrayStringMatch: arrayStringMatch,
  getOrigin: getOrigin,
  getDestination: getDestination
}
