'use strict'

var natural = require('natural')
var MIN_MATCH_THRESHOLD = 0.75

/**
 * Class containing useful functions for arrays
 */

class ArrayUtils {
  /**
   * Returns a random element in an array
   * @param  {[array]} array
   * @return {[object]}
   */
  random_element(array) {
    return array[Math.floor(Math.random() * array.length)]
  }

  /**
   * Uses the Jaro-Winkler string distance algorithm to determine if
   * there is a plausible match for a word within a wordlist
   * @param  {[array]} wordlist [list of words to check]
   * @param  {[string]} word    [word to match]
   * @return {[bool]}           [true for yes, false for no]
   */
  string_match(wordlist, word) {
    var match = false
    var coefficient

    wordlist.forEach(function(element, index, wordlist) {
      coefficient = natural.JaroWinklerDistance(word, element)
      if (coefficient > MIN_MATCH_THRESHOLD) {
        match = true
      }
    })

    return match
  }
}

module.exports = new ArrayUtils()
