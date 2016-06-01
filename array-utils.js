'use strict'

/**
 * Class containing useful functions for arrays
 */

class ArrayUtils {
  random_element(array) {
    return array[Math.floor(Math.random() * array.length)];
  }
}

module.exports = new ArrayUtils()
