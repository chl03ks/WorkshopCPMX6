//includes
var util = require('util'),
  twitter = require('twitter'),
  analisisSentimientos = require('./analisisSentimientos'),
  db = require('diskdb');

db = db.connect('db', ['sentiments']);


var config = {
  consumer_key: '7HsEIx73YwPmSHCbZgCweUt8s',
  consumer_secret: 'UWsYmcTm7hjyZju6PyebpdNkTf4Wi8dLOnsrhRqWDQMiP5RwLN',
  access_token_key: '2585921882-EPullc0UPkPUJNVKZmeFpyMkxugSCqUS41mvzx4',
  access_token_secret: '3G5lEHAASXa31ngsAjGGo7Svk2p6ZSYftGCJio8FzwTQu'
};

module.exports = function(text, callback) {
  var twitterClient = new twitter(config);
  var response = [],
    dbData = [];

  twitterClient.get('search/tweets', {
    q: text,
    count: 300
  }, function(error, data) {
    for (var i = 0; i < data.statuses.length; i++) {
      var resp = {};

      resp.tweet = data.statuses[i];
      resp.sentiment = analisisSentimientos(data.statuses[i].text);
      dbData.push({
        tweet: resp.tweet.text,
        score: resp.sentiment.score,
        user: resp.tweet.user,
        rt: resp.tweet.retweet_count

      });
      response.push(resp);
    };
    db.sentiments.save(dbData);
    callback(response);

  });
}
