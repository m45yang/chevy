/**
 * accessToken model
 */

var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var accessTokenSchema = new Schema({
  userId: String,
  accessToken: String,
}, { collection: 'accessTokens' });

var accessToken = mongoose.model('metricCurrentSas', accessTokenSchema);

module.exports = accessToken;
