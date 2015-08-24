'use strict';

(function (angular) {
    angular.module('youtubePluginWidget')
        .controller('WidgetFeedCtrl', ['$filter', 'DataStore', 'TAG_NAMES', 'STATUS_CODE','YoutubeApi','$routeParams','VIDEO_COUNT','$sce','Location',
        function ($filter, DataStore, TAG_NAMES, STATUS_CODE,YoutubeApi,$routeParams,VIDEO_COUNT,$sce,Location) {
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
              var listLayoutElement = angular.element('#list-layout');
              if (_WidgetFeedData.design && _WidgetFeedData.design.itemListBgImage && currentItemListBgImage != _WidgetFeedData.design.itemListBgImage) {
                currentItemListBgImage = _WidgetFeedData.design.itemListBgImage;
                listLayoutElement.css(
                  'background', '#010101 url('
                  + getImageUrlFilter(currentItemListBgImage, 342, 770, 'resize')
                  + ') repeat fixed top center')
              } else if (_WidgetFeedData.design && !_WidgetFeedData.design.itemListBgImage) {
                currentItemListBgImage = null;
                listLayoutElement.css('background', 'none');
              } else {
                listLayoutElement.css(
                  'background', '#010101 url('
                  + getImageUrlFilter(currentItemListBgImage, 342, 770, 'resize')
                  + ') repeat fixed top center')
              }
            };

            /*
             * Fetch user's data from datastore
             */
            var init = function () {
                var success = function (result) {
                    WidgetFeed.data = result.data;
                    if(WidgetFeed.data && WidgetFeed.data.design && (!WidgetFeed.data.design.itemListLayout)){
                      WidgetFeed.data.design.itemListLayout = WidgetFeed.layouts.listLayouts[0].name;
                    }
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
                  if(WidgetFeed.data.content && WidgetFeed.data.content.videoID)
                    Location.goTo("#/video/" + WidgetFeed.data.content.videoID);
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
              YoutubeApi.getFeedVideos(_playlistId,VIDEO_COUNT.LIMIT, null).then(success, error);
            };

            WidgetFeed.loadMore();
            WidgetFeed.safeHtml = function (html) {
              if (html)
               return $sce.trustAsHtml(html);
            };

        }])
})(window.angular);
