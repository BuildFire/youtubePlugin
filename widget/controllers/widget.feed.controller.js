'use strict';

(function (angular) {
    angular.module('youtubePluginWidget')
        .controller('WidgetFeedCtrl', ['$filter', 'DataStore', 'TAG_NAMES', 'STATUS_CODE','YoutubeApi','$routeParams','VIDEO_COUNT', function ($filter, DataStore, TAG_NAMES, STATUS_CODE,YoutubeApi,$routeParams,VIDEO_COUNT) {
            var WidgetFeed = this
                , currentItemListBgImage = null
                , getImageUrlFilter = $filter("getImageUrl");
        WidgetFeed.layouts = {
              listLayouts: [
                {name: "List_Layout_1"},
                {name: "List_Layout_2"},
                {name: "List_Layout_3"},
                {name: "List_Layout_4"}
              ]
            };

        WidgetFeed.data = null;

            var setCurrentItemListBgImage = function (_WidgetFeedData) {
                var body = angular.element('body');
                if (_WidgetFeedData.design && _WidgetFeedData.design.itemListBgImage && currentItemListBgImage != _WidgetFeedData.design.itemListBgImage) {
                    currentItemListBgImage = _WidgetFeedData.design.itemListBgImage;
                    body.css(
                        'background', '#010101 url('
                        + getImageUrlFilter(currentItemListBgImage, 342, 770, 'resizeImage')
                        + ') repeat fixed top center')
                } else if (_WidgetFeedData.design && !_WidgetFeedData.design.itemListBgImage) {
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
                    if(WidgetFeed.data && WidgetFeed.data.design && (!WidgetFeed.data.design.itemListLayout))
                    WidgetFeed.data.design.itemListLayout = WidgetFeed.layouts.listLayouts[0].name;
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

            WidgetFeed.loadMore = function(){
              var _playlistId = $routeParams.playlistId;
              var success = function (result) {
                  WidgetFeed.videos = result.data.items || [];
                  console.info('-------------------Feeds data----------------', WidgetFeed.videos);
                }
                , error = function (err) {
                  console.error('Error In Fetching Single Video Details', err);
                };
              console.log("**************************",_playlistId,VIDEO_COUNT.LIMIT);
              YoutubeApi.getFeedVideos(_playlistId,VIDEO_COUNT.LIMIT, null).then(success, error);
            };

            WidgetFeed.loadMore();

        }])
})(window.angular);
