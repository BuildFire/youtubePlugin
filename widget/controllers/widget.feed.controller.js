'use strict';

(function (angular) {
  angular.module('youtubePluginWidget')
    .controller('WidgetFeedCtrl', ['DataStore', 'TAG_NAMES', 'STATUS_CODE', 'YoutubeApi', '$routeParams', 'VIDEO_COUNT', '$sce', 'Location', '$rootScope',
      function (DataStore, TAG_NAMES, STATUS_CODE, YoutubeApi, $routeParams, VIDEO_COUNT, $sce, Location, $rootScope) {
        var WidgetFeed = this
          , currentItemListBgImage = null;
        WidgetFeed.layouts = {
          listLayouts: [
            {name: "List_Layout_1"},
            {name: "List_Layout_2"},
            {name: "List_Layout_3"},
            {name: "List_Layout_4"}
          ]
        };

        WidgetFeed.data = null;
        //create new instance of buildfire carousel viewer
        var view = null;

        /*
         * Fetch user's data from datastore
         */
        var init = function () {
          var success = function (result) {
              WidgetFeed.data = result.data;
              if (WidgetFeed.data && WidgetFeed.data.design && (!WidgetFeed.data.design.itemListLayout)) {
                WidgetFeed.data.design.itemListLayout = WidgetFeed.layouts.listLayouts[0].name;
              }
              WidgetFeed.loadMore();
            }
            , error = function (err) {
              if (err && err.code !== STATUS_CODE.NOT_FOUND) {
                console.error('Error while getting data', err);
              }
            };
          DataStore.get(TAG_NAMES.YOUTUBE_INFO).then(success, error);
        };

        init();
        $rootScope.$on("Carousel:LOADED", function () {
          if (!view) {
            view = new buildfire.components.carousel.view("#carousel", []);
          }
          if (WidgetFeed.data.content && WidgetFeed.data.content.carouselImages) {
            view.loadItems(WidgetFeed.data.content.carouselImages);
          } else {
            view.loadItems([]);
          }
        });

        var onUpdateCallback = function (event) {
          if (event && event.tag === TAG_NAMES.YOUTUBE_INFO) {
            WidgetFeed.data = event.data;
            if (WidgetFeed.data && WidgetFeed.data.design && (!WidgetFeed.data.design.itemListLayout)) {
              WidgetFeed.data.design.itemListLayout = WidgetFeed.layouts.listLayouts[0].name;
            }
            view.loadItems(WidgetFeed.data.content.carouselImages);
            if (WidgetFeed.data.content && WidgetFeed.data.content.videoID)
              Location.goTo("#/video/" + WidgetFeed.data.content.videoID);
          }
        };
        DataStore.onUpdate().then(null, null, onUpdateCallback);

        WidgetFeed.loadMore = function () {
          var _playlistId = $routeParams.playlistId;

          var success = function (result) {
              console.log("**************",result.data.items);
              WidgetFeed.videos = result.data.items || [];
            }
            , error = function (err) {
              console.error('Error In Fetching Single Video Details', err);
            };
          YoutubeApi.getFeedVideos(_playlistId, VIDEO_COUNT.LIMIT, null).then(success, error);
        };

        WidgetFeed.safeHtml = function (html) {
          if (html)
            return $sce.trustAsHtml(html);
        };

      }])
})(window.angular);
