/**
 * Authentication methods controller
 */

var graph = require('fbgraph')
var config = require('../../config.json')
var accessToken = require('../models/accessToken')

module.exports = {

  /**
   * Flow for a user to provide an access token
   * @param  {[object]} req [description]
   * @param  {[object]} res [description]
   */
  facebook: function(req, res) {
    // Redirect to the Oauth dialog if code
    // is not provided
    if (!req.query.code) {
      var authUrl = graph.getOauthUrl({
        "client_id": config.clientId,
        "redirect_uri": config.authUrl
      })

      if (!req.query.error) {
        res.redirect(authUrl)
      } else {
        console.log(req.query.error)
        res.send('Access denied.')
      }
      return
    }

    // Use provided code to get access token
    graph.authorize({
      "client_id": config.clientId,
      "redirect_uri": config.authUrl,
      "client_secret": config.clientSecretKey,
      "code": req.query.code
    }, function (err, response) {
      // store the user access token somewhere
      console.log(response.access_token)
      res.redirect('/')
    })
  }

}
