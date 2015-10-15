'use strict';

(function (angular) {
  angular.module('youtubePluginWidget')
    .constant('TAG_NAMES', {
      YOUTUBE_INFO: 'YouTubeInfo'
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
      SINGLE_VIDEO: 'Single Video'
    })
    .constant('YOUTUBE_KEYS', {
      API_KEY: 'AIzaSyC5d5acYzAtC9fiDcCOvvpA-xX9dKwkmAA'
    })
    .constant('VIDEO_COUNT', {
      LIMIT: 8
    })
    .constant('LAYOUTS', {
      listLayouts: [
        {name: "List_Layout_1"},
        {name: "List_Layout_2"},
        {name: "List_Layout_3"},
        {name: "List_Layout_4"}
      ]
    });
})(window.angular);