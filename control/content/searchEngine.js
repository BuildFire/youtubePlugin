"use strict";

var searchEngine = {
  insertFeed: function insertFeed(playListID, callback) {
    var options = {
      tag: "youtube_feed",
      title: "youtube feed",
      feedType: "rss",
      feedConfig: {
        url: "https://www.youtube.com/feeds/videos.xml?playlist_id=" + playListID,
      },
      feedItemConfig: {
        uniqueKey: "id",
        titleKey: "title",
        urlKey: "link",
        descriptionKey: "media:group.media:description",
        imageUrlKey: "media:group.media:thumbnail.$.url"
      }
    };

    buildfire.services.searchEngine.feeds.insert(options, callback);
  },
  deleteFeed: function deleteFeed(callback) {
    this._get(function (err, result) {
      if (err) return callback(err, null);
      if (!result || !result[0] || !result[0]._id) return callback();

      const feedId = result[0]._id;
      const options = {
        tag: `youtube_feed`,
        feedId: feedId,
        removeFeedData: true
      };
      buildfire.services.searchEngine.feeds.delete(options, callback);
    });
  },
  insertSingleVideo: function insertSingleVideo(video, callback) {
    buildfire.services.searchEngine.insert(
      {
        tag: "youtube_feed",
        title: video.title,
        description: video.description,
        keywords: video.keywords,
        imageUrl: video.imageUrl,
      }, callback);
  },
  deleteSingleVideo: function deleteSingleVideo(searchEngineId, callback) {
    buildfire.services.searchEngine.delete({ tag: "youtube_feed", id: searchEngineId }, callback);
  },
  _get: function _get(callback) {
    buildfire.services.searchEngine.feeds.get(
      { tag: "youtube_feed", feedType: "rss" },
      function(err, result) {
        callback(err, result);
      }
    );
  }
};
