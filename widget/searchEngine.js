'use strict';

var searchEngine = {
  indexFeed: function indexFeed(playListID) {
    var _this = this;

    var rssUrl = 'https://www.youtube.com/feeds/videos.xml?playlist_id=' + playListID;
    // buildfire.services.searchEngine.feeds.get({ tag: 'rss_feed', feedType: 'rss' }, (err, result) => {
    this._get(function (err, result) {
      if (err) throw err;
      console.log(result);
      var feedUrl = result[0] ? result[0].feed_config.url : false;
      if (feedUrl === rssUrl) {
        var options = { searchText: "e" };
        var callback = function callback(e, d) {
          return console.log(e, d.hits);
        };
        buildfire.services.searchEngine.search(options, callback);
        return;
      } else if (!feedUrl) {
        _this._insertFeed(rssUrl);
      } else {
        _this._updateFeed(result[0]._id, rssUrl);
      }
    });
  },
  _insertFeed: function _insertFeed(url, callback) {

    var options = {
      tag: 'rss_feed',
      title: 'rss feed',
      feedType: "rss",
      feedConfig: {
        url: url
      },
      feedItemConfig: {
        uniqueKey: 'id',
        titleKey: 'title',
        urlKey: 'link',
        descriptionKey: 'media:group.media:description',
        imageUrlKey: "media:group.media:thumbnail.$.url"
      }
    };

    buildfire.services.searchEngine.feeds.insert(options, function (err, result) {
      if (err) throw err;
      console.log(result);
    });
  },
  _updateFeed: function _updateFeed(feedId, url) {
    var _this2 = this;

    var options = {
      tag: 'rss_feed',
      feedId: feedId,
      removeFeedData: true
    };
    var callback = function callback(e) {
      if (e) throw e;
      _this2._insertFeed(url);
    };
    buildfire.services.searchEngine.feeds.delete(options, callback);
  },
  _get: function _get(callback) {
    buildfire.services.searchEngine.feeds.get({ tag: 'rss_feed', feedType: 'rss' }, function (err, result) {
      callback(err, result);
    });
  }
};