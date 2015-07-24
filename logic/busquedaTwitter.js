//includes
var util = require('util'),
  twitter = require('twitter'),
  analisisSentimientos = require('./analisisSentimientos'),
  db = require('diskdb');

db = db.connect('db', ['sentiments']);


var config = {
  consumer_key: 'xxxxxxxxxxxxxxxxxxxxxxxxxxx',
  consumer_secret: 'xxxxxxxxxxxxxxxxxxxxxxxxxxx',
  access_token_key: 'xxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxx',
  access_token_secret: 'xxxxxxxxxxxxxxxxxxxxxxxxxxx'
};

module.exports = function(text, callback) {
  var twitterClient = new twitter(config);
  var response = [],
    dbData = [];

  twitterClient.search(text, function(data) {
    for (var i = 0; i < data.statuses.length; i++) {
      var resp = {};

      resp.tweet = data.statuses[i];
      resp.sentiment = analisisSentimientos(data.statuses[i].text);
      dbData.push({
        tweet: resp.tweet.text,
        score: resp.sentiment.score
      });
      response.push(resp);
    };
    db.sentiments.save(dbData);
    callback(response);
  });
}
