'use strict'

/**
 * Initialize connection to mongodb with Mongoose
 */

var mongoose = require('mongoose')
var Promsie = require('bluebird')

var initMongoose = function(app) {

  // Use bluebird as Mongoose promise library
  mongoose.Promise = Promise

  // Initialize connection to database
  mongoose.connect(app.config.db[process.env.NODE_ENV || 'development'])
  var db = mongoose.connection

  db.on('error', function () {
    app.log.error('database connection error')
  })
   
  db.once('open', function dbOpen() {
    app.log.info('database connection established')
  })

}

module.exports = initMongoose
