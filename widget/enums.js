'use strict';

(function (angular) {
  angular.module('youtubePluginWidget')
    .constant('TAG_NAMES', {
      YOUTUBE_INFO: 'YouTubeInfo',
      DEFAULT_FEED_URL: 'http://www.youtube.com/user/goprocamera',
      DEFAULT_FEED_ID: 'UUqhnX4jA0A5paNd1v-zEysw'
    })
    .constant('STATUS_CODE', {
      INSERTED: 'inserted',
      UPDATED: 'updated',
      NOT_FOUND: 'NOTFOUND',
      UNDEFINED_DATA: 'UNDEFINED_DATA',
      UNDEFINED_OPTIONS: 'UNDEFINED_OPTIONS',
      UNDEFINED_ID: 'UNDEFINED_ID',
      ITEM_ARRAY_FOUND: 'ITEM_ARRAY_FOUND',
      NOT_ITEM_ARRAY: 'NOT_ITEM_ARRAY',
      UNDEFINED_EVENT: 'UNDEFINED_EVENT',
      UNDEFINED_VIDEO_ID: 'UNDEFINED_VIDEO_ID',
      UNDEFINED_PLAYLIST_ID: 'UNDEFINED_PLAYLIST_ID'
    })
    .constant('STATUS_MESSAGES', {
      UNDEFINED_DATA: 'Undefined data provided',
      UNDEFINED_OPTIONS: 'Undefined options provided',
      UNDEFINED_ID: 'Undefined id provided',
      NOT_ITEM_ARRAY: 'Array of Items not provided',
      ITEM_ARRAY_FOUND: 'Array of Items provided',
      UNDEFINED_EVENT: 'Undefined event received',
      UNDEFINED_VIDEO_ID: 'Undefined video id provided',
      UNDEFINED_PLAYLIST_ID: 'Undefined playlist id provided'
    })
    .constant('CONTENT_TYPE', {
      CHANNEL_FEED: 'Channel Feed',
      PLAYLIST_FEED: 'Playlist Feed',
      SINGLE_VIDEO: 'Single Video'
    })
    .constant('YOUTUBE_KEYS', {
      API_KEY: 'AIzaSyC5d5acYzAtC9fiDcCOvvpA-xX9dKwkmAA'
    })
    .constant('VIDEO_COUNT', {
      LIMIT: window.innerHeight && window.innerHeight > 500 ? 25 : 8
    })
    .constant('LAYOUTS', {
      listLayouts: [
        { name: "List_Layout_1" },
        { name: "List_Layout_2" },
        { name: "List_Layout_3" },
        { name: "List_Layout_4" }
      ]
    })
    .constant('PROXY_SERVER', {
      serverUrl: "https://proxy.buildfire.com",
      secureServerUrl: 'https://proxy.buildfire.com'
    });
})(window.angular);
