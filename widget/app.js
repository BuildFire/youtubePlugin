'use strict';

(function (angular, buildfire) {
    angular.module('youtubePluginWidget', ['ngRoute'])
        .config(['$routeProvider', function ($routeProvider) {
        /**
         * Disable the pull down refresh
         */
        buildfire.datastore.disableRefresh();
            $routeProvider
                .when('/', {
                    resolve: {
                        videoData: ['DataStore', '$q', 'TAG_NAMES', 'CONTENT_TYPE', 'Location', function (DataStore, $q, TAG_NAMES, CONTENT_TYPE, Location) {
                            var deferred = $q.defer();
                            var success = function (result) {
                                    if (result.data && result.data.content) {
                                        if (result.data.content.type && result.data.content.type === CONTENT_TYPE.SINGLE_VIDEO && result.data.content.videoID) {
                                            Location.goTo("#/video/" + result.data.content.videoID);
                                            deferred.resolve();
                                        }
                                        else if (result.data.content.type && result.data.content.type === CONTENT_TYPE.CHANNEL_FEED && result.data.content.playListID) {
                                            Location.goTo("#/feed/" + result.data.content.playListID);
                                            deferred.resolve();
                                        }
                                    } else {
                                        deferred.resolve();
                                    }
                                }
                                , error = function (err) {
                                    deferred.reject();
                                };
                            DataStore.get(TAG_NAMES.YOUTUBE_INFO).then(success, error);
                        }]
                    }
                })
                .when('/feed/:playlistId', {
                    templateUrl: 'templates/home.html',
                    controllerAs: 'WidgetFeed',
                    controller: 'WidgetFeedCtrl'
                })
                .when('/video/:videoId', {
                    templateUrl: 'templates/Item_Details.html',
                    controller: 'WidgetSingleCtrl',
                    controllerAs: 'WidgetSingle'

                })
                .otherwise('/');
        }])
        .filter('getImageUrl', ['Buildfire', function (Buildfire) {
            return function (url, width, height, type) {
                if (type == 'resize')
                    return Buildfire.imageLib.resizeImage(url, {
                        width: width,
                        height: height
                    });
                else
                    return Buildfire.imageLib.cropImage(url, {
                        width: width,
                        height: height
                    });
            }
        }]);
})(window.angular,window.buildfire);
