'use strict';

(function (angular) {
  angular.module('youtubePluginWidget')
    .controller('WidgetSingleCtrl', ['$routeParams', '$scope', 'YoutubeApi', 'DataStore', 'TAG_NAMES', 'Location', 'LAYOUTS', '$rootScope', 'VideoCache',
      function ($routeParams, $scope, YoutubeApi, DataStore, TAG_NAMES, Location, LAYOUTS, $rootScope, VideoCache) {
        var currentItemDetailsBgImage = '',
          currentPlayListID = null,
          currentItemListLayout = null;

        var WidgetSingle = this;
        WidgetSingle.data = null;
        WidgetSingle.video = null;

        /*
         * Fetch user's data from datastore
         */

        var init = function () {
          var success = function (result) {
              WidgetSingle.data = result.data;
              if (!WidgetSingle.data.design)
                WidgetSingle.data.design = {};
              if (!WidgetSingle.data.content)
                WidgetSingle.data.content = {};
              if (!WidgetSingle.data.design.itemListLayout) {
                WidgetSingle.data.design.itemListLayout = LAYOUTS.listLayouts[0].name;
              }
              currentItemListLayout = WidgetSingle.data.design.itemListLayout;
              currentPlayListID = WidgetSingle.data.content.playListID;
            }
            , error = function (err) {
              console.error('Error while getting data', err);
            };
          DataStore.get(TAG_NAMES.YOUTUBE_INFO).then(success, error);
        };
        init();

        var getSingleVideoDetails = function (_videoId) {
          var success = function (result) {
              WidgetSingle.video = result;
            }
            , error = function (err) {
              console.error('Error In Fetching Single Video Details', err);
            };
          YoutubeApi.getSingleVideoDetails(_videoId).then(success, error);
        };

        if ($routeParams.videoId) {
          if (VideoCache.getCache()) {
            WidgetSingle.video = VideoCache.getCache();
          }
          else
            getSingleVideoDetails($routeParams.videoId);
        } else {
          console.error('Undefined Video Id Provided');
        }

        var onUpdateCallback = function (event) {
          if (event && event.tag === TAG_NAMES.YOUTUBE_INFO) {
            WidgetSingle.data = event.data;
            if (!WidgetSingle.data.design)
              WidgetSingle.data.design = {};
            if (!WidgetSingle.data.content)
              WidgetSingle.data.content = {};
            if (WidgetSingle.data.content.type)
              $rootScope.contentType = WidgetSingle.data.content.type;
            if (!WidgetSingle.data.content.rssUrl) {
              $routeParams.videoId = '';
              WidgetSingle.video = null;
            } else if (!WidgetSingle.video && WidgetSingle.data.content.videoID && !$routeParams.videoId) {
              $routeParams.videoId = WidgetSingle.data.content.videoID;
              getSingleVideoDetails(WidgetSingle.data.content.videoID);
            } else if (!WidgetSingle.video && WidgetSingle.data.content.playListID && !$routeParams.videoId) {
              currentPlayListID = WidgetSingle.data.content.playListID;
              Location.goTo("#/feed/" + WidgetSingle.data.content.playListID);
            }

            if (WidgetSingle.data.content.videoID && (WidgetSingle.data.content.videoID !== $routeParams.videoId)) {
              getSingleVideoDetails(WidgetSingle.data.content.videoID);
            } else if (WidgetSingle.data.content.playListID && (!$routeParams.videoId || (WidgetSingle.data.design.itemListLayout !== currentItemListLayout) || (WidgetSingle.data.content.playListID !== currentPlayListID))) {
              currentPlayListID = WidgetSingle.data.content.playListID;
              currentItemListLayout = WidgetSingle.data.design.itemListLayout;
              Location.goTo("#/feed/" + WidgetSingle.data.content.playListID);
            }
          }
        };
        DataStore.onUpdate().then(null, null, onUpdateCallback);

        $scope.$on("$destroy", function () {
          DataStore.clearListener();
        });
      }])
})(window.angular);
