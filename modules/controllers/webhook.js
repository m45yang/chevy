/**
 * Webhook methods controller
 */

var Chevy = require('../chevy');
var config = require('../../config.json');

module.exports = {

  /**
   * Main webhook that takes in messages sent to
   * Chevy and passes them through the plugins
   * @param  {[object]} req [description]
   * @param  {[object]} res [description]
   */
  index: function (req, res) {
    var context = {
      query: '',
      postback: null,
      actions: [],
      completed: false,
      replies: []
    }

    var messaging_events = req.body.entry[0].messaging
    for (var i = 0; i < messaging_events.length; i++) {
      var event = req.body.entry[0].messaging[i]
      var sender = event.sender.id
      if (event.message && event.message.text) {
        context.query = event.message.text
      }
      else if (event.postback && event.postback.payload) {
        context.postback = event.postback
      }
      // no message or postback given
      else {
        continue
      }

      Chevy.think(context)
      .then(function(context) {
        return Chevy.reply(sender, context.replies)
      })
      .catch(function(err) {
        console.log(err)

        // Authorization error, send link to prompt user to use
        // the provided link to authorize Chevy
        if (err.type === 'OAuthException') {
          return Chevy.reply(sender, [
            { text: 'Please authorize Chevy to access the Waterloo Carpool page for you by clicking on this link!' },
            { text: config.authUrl }
          ])
        }
        else {
          return Chevy.reply(sender, [{ text: 'Something went wrong, please contact a developer!' }])
        }
      })
    }

    res.sendStatus(200)
  },

  /**
   * Endpoint for Facebook API to
   * verify webhook
   * @param  {[object]} req [description]
   * @param  {[object]} res [description]
   */
  verify: function (req, res) {
    if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
        return res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
  }
}
