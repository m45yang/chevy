'use strict'

var natural = require('natural')
var dictionary = require('./modules/dictionary')
var MIN_MATCH_THRESHOLD = 0.8

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
 * Currently a very dumb function to find the origin of a
 * carpool search query
 * Finds the word after the keyword 'from' and assumes that
 * to be the origin
 * @param  {[array]}  wordlist
 * @return {[string]} origin
 */
var getOrigin = function(wordlist) {
  var origin = ''

  wordlist.forEach(function(element, index, wordlist) {
    if (element === 'from') {
      if (stringMatch(dictionary.locations, wordlist[index + 1])) {
        origin = wordlist[index + 1]
      }
    }
    else if (element === 'to') {
      if (index > 1 && stringMatch(dictionary.locations, wordlist[index - 1])) {
        origin = wordlist[index - 1]
      }
    }
  })

  return origin.toUpperCase()
}

/**
 * Currently a very dumb function to find the destination of a
 * carpool search query
 * Finds the word after the keyword 'from' and assumes that
 * to be the origin
 * @param  {[array]}  wordlist
 * @return {[string]} origin
 */
var getDestination = function(wordlist) {
  var keyword = 'to'
  var origin = ''

  wordlist.forEach(function(element, index, wordlist) {
    if (element === keyword) {
      if (stringMatch(dictionary.locations, wordlist[index + 1])) {
        origin = wordlist[index + 1]
      }
    }
  })

  return origin.toUpperCase()
}

module.exports = {
  randomElement: randomElement,
  stringMatch: stringMatch,
  arrayStringMatch: arrayStringMatch,
  getOrigin: getOrigin,
  getDestination: getDestination
}
