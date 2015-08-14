'use strict';

(function (angular, buildfire) {
    angular.module('youtubePluginContent')
        .provider('Buildfire', [function () {
            var Buildfire = this;
            Buildfire.$get = function () {
                return buildfire
            };
            return Buildfire;
        }])
})(window.angular, window.buildfire);