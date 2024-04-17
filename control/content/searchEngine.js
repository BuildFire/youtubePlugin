"use strict";

var searchEngine = {
  insertFeed(playListID, callback) {
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
  deleteFeed(callback) {
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
  insertSingleVideo(video, callback) {
    buildfire.services.searchEngine.save(
      {
        tag: "youtube_feed",
        title: video.title,
        key: video.id,
        description: video.description,
        keywords: video.keywords,
        imageUrl: video.imageUrl,
        data: video.data ? video.data : {}
      }, callback);
  },
  deleteSingleVideo(videoID, callback) {
    buildfire.services.searchEngine.delete({ tag: "youtube_feed", key: videoID }, callback);
  },
  _get(callback) {
    buildfire.services.searchEngine.feeds.get(
      { tag: "youtube_feed", feedType: "rss" },
      function(err, result) {
        callback(err, result);
      }
    );
  }
};
