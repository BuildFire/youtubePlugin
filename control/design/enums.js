'use strict';

(function (angular) {
    angular.module('youtubePluginDesign')
        .constant('TAG_NAMES', {
            YOUTUBE_INFO: 'YouTubeInfo'
        })
        .constant('STATUS_CODE', {
            INSERTED: 'inserted',
            UPDATED: 'updated',
            NOT_FOUND: 'NOTFOUND',
            UNDEFINED_DATA: 'UNDEFINED_DATA',
            UNDEFINED_OPTIONS: 'UNDEFINED_OPTIONS',
            UNDEFINED_ID: 'UNDEFINED_ID'
        })
        .constant('STATUS_MESSAGES', {
            UNDEFINED_DATA: 'Undefined data provided',
            UNDEFINED_OPTIONS: 'Undefined options provided',
            UNDEFINED_ID: 'Undefined id provided'
        })
        .constant('CONTENT_TYPE', {
            CHANNEL_FEED: 'Channel Feed',
            SINGLE_VIDEO: 'Single Video'
        })
})(window.angular);