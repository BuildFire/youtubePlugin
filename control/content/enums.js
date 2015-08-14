'use strict';

(function (angular) {
    angular.module('youtubePluginContent')
        .constant('TAG_NAMES', {
            GET_INFO: 'getInfo'
        })
        .constant('ERROR_CODE', {
            NOT_FOUND: 'NOTFOUND'
        })
        .constant('STATUS_CODE', {
            INSERTED: 'inserted',
            UPDATED: 'updated'
        })
})(window.angular);