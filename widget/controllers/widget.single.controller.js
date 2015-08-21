'use strict';

(function (angular) {
    angular.module('youtubePluginWidget')
        .controller('WidgetSingleCtrl', ['$routeParams', 'YoutubeApi', 'DataStore', 'TAG_NAMES', function ($routeParams, YoutubeApi, DataStore, TAG_NAMES) {
            var WidgetSingle = this;
            WidgetSingle.data = null;
            WidgetSingle.video = null;

            /*
             * Fetch user's data from datastore
             */
            var init = function () {
                var success = function (result) {
                        WidgetSingle.data = result.data;
                        setCurrentItemListBgImage(WidgetSingle.data);
                    }
                    , error = function (err) {
                        console.error('Error while getting data', err);
                    };
                DataStore.get(TAG_NAMES.YOUTUBE_INFO).then(success, error);
            };
            init();

            var getSingleVideoDetails = function (_videoId) {
                var success = function (result) {
                        WidgetSingle.video = result.items && result.items[0];
                    }
                    , error = function (err) {
                        console.error('Error In Fetching Single Video Details', err);
                    };
                YoutubeApi.getSingleVideoDetails(_videoId).then(success, error);
            };
            if ($routeParams.videoId) {
                getSingleVideoDetails($routeParams.videoId);
            } else {
                console.error('Undefined Video Id Provided');
            }
        }])
})(window.angular);
