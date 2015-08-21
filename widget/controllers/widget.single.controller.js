'use strict';

(function (angular) {
    angular.module('youtubePluginWidget')
        .controller('WidgetSingleCtrl', ['$routeParams', '$filter', 'YoutubeApi', 'DataStore', 'TAG_NAMES', function ($routeParams, $filter, YoutubeApi, DataStore, TAG_NAMES) {
            var currentItemDetailsBgImage = ''
                , getImageUrlFilter = $filter("getImageUrl");

            var WidgetSingle = this;
            WidgetSingle.data = null;
            WidgetSingle.video = null;

            var setCurrentItemListBgImage = function (_WidgetVideoData) {
                var body = angular.element('body');
                if (_WidgetVideoData.design && _WidgetVideoData.design.itemDetailsBgImage && currentItemDetailsBgImage != _WidgetVideoData.design.itemDetailsBgImage) {
                    currentItemDetailsBgImage = _WidgetVideoData.design.itemDetailsBgImage;
                    body.css(
                        'background', '#010101 url('
                        + getImageUrlFilter(currentItemDetailsBgImage, 342, 770, 'resize')
                        + ') repeat fixed top center')
                } else if (_WidgetVideoData.design && !_WidgetVideoData.design.itemDetailsBgImage) {
                    currentItemDetailsBgImage = null;
                    body.css('background', 'none');
                }
            };

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

            var onUpdateCallback = function (event) {
                if (event && event.tag === TAG_NAMES.YOUTUBE_INFO) {
                    WidgetSingle.data = event.obj;
                    setCurrentItemListBgImage(WidgetSingle.data);
                }
            };
            DataStore.onUpdate().then(null, null, onUpdateCallback);
        }])
})(window.angular);
