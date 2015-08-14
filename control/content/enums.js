'use strict';

(function (angular) {
    angular.module('youtubePluginContent')
        .constant('TAG_NAMES', {
            GET_INFO: 'GetInfo'
        })
        .constant('ERROR_CODE', {
            NOT_FOUND: 'NOTFOUND'
        })
        .constant('STATUS_CODE', {
            INSERTED: 'inserted',
            UPDATED: 'updated'
        })
        .constant('CONTENT_TYPE', {
            CHANNEL_FEED: 'Channel Feed',
            SINGLE_VIDEO: 'Single Video'
        })
})(window.angular);