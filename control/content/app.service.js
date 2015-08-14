'use strict';

(function (angular) {
    angular.module('youtubePluginContent')
        .factory('Buildfire', [function () {
            return buildfire;
        }])
        .factory('Location', [function () {
            var _location = window.location;
            return {
                goTo: function (path) {
                    _location.href = path;
                },
                goToHome: function () {
                    _location.href = _location.href.substr(0, _location.href.indexOf('#'));
                }
            };
        }])
})(window.angular,window.bui);