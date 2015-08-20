'use strict';

(function (angular) {
    angular.module('youtubePluginWidget')
        .controller('WidgetFeedCtrl', ['$filter', 'DataStore', 'TAG_NAMES', 'STATUS_CODE', function ($filter, DataStore, TAG_NAMES, STATUS_CODE) {
            var WidgetFeed = this
                , currentItemListBgImage = null
                , getImageUrlFilter = $filter("getImageUrl");

        WidgetFeed.data = null;

            var setCurrentItemListBgImage = function (_WidgetFeedData) {
                var body = angular.element('body');
                if (_WidgetFeedData.design && _WidgetFeedData.design.itemListBgImage && currentItemListBgImage != _WidgetFeedData.design.itemListBgImage) {
                    currentItemListBgImage = _WidgetFeedData.design.itemListBgImage;
                    body.css(
                        'background', '#010101 url('
                        + getImageUrlFilter(currentItemListBgImage, 342, 770, 'resizeImage')
                        + ') repeat fixed top center')
                } else if (_WidgetHomeData.design && !_WidgetFeedData.design.itemListBgImage) {
                    currentItemListBgImage = null;
                    body.css('background', 'none');
                }
            };

            /*
             * Fetch user's data from datastore
             */
            var init = function () {
                var success = function (result) {
                    WidgetFeed.data = result.data;
                        setCurrentItemListBgImage(WidgetFeed.data);
                    }
                    , error = function (err) {
                        if (err && err.code !== STATUS_CODE.NOT_FOUND) {
                            console.error('Error while getting data', err);
                        }
                    };
                DataStore.get(TAG_NAMES.YOUTUBE_INFO).then(success, error);
            };
            init();

            var onUpdateCallback = function (event) {
                if (event && event.tag === TAG_NAMES.YOUTUBE_INFO) {
                  WidgetFeed.data = event.obj;
                    setCurrentItemListBgImage(WidgetFeed.data);
                }
            };
            DataStore.onUpdate().then(null, null, onUpdateCallback);
        }])
})(window.angular);
