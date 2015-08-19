'use strict';

(function (angular) {
    angular.module('youtubePluginWidget')
        .controller('WidgetHomeCtrl', ['$filter', 'DataStore', 'TAG_NAMES', 'STATUS_CODE', function ($filter, DataStore, TAG_NAMES, STATUS_CODE) {
            var WidgetHome = this
                , currentItemListBgImage = null
                , getImageUrlFilter = $filter("getImageUrl");

            WidgetHome.data = null;

            var setCurrentItemListBgImage = function (_WidgetHomeData) {
                var body = angular.element('body');
                if (_WidgetHomeData.design && _WidgetHomeData.design.itemListBgImage && currentItemListBgImage != _WidgetHomeData.design.itemListBgImage) {
                    currentItemListBgImage = _WidgetHomeData.design.itemListBgImage;
                    body.css(
                        'background', '#010101 url('
                        + getImageUrlFilter(currentItemListBgImage, 342, 770, 'resizeImage')
                        + ') repeat fixed top center')
                } else if (_WidgetHomeData.design && !_WidgetHomeData.design.itemListBgImage) {
                    currentItemListBgImage = null;
                    body.css('background', 'none');
                }
            };

            /*
             * Fetch user's data from datastore
             */
            var init = function () {
                var success = function (result) {
                        WidgetHome.data = result.data;
                        setCurrentItemListBgImage(WidgetHome.data);
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
                    WidgetHome.data = event.obj;
                    setCurrentItemListBgImage(WidgetHome.data);
                }
            };
            DataStore.onUpdate().then(null, null, onUpdateCallback);
        }])
})(window.angular);
