'use strict';

(function (angular) {
  angular.module('youtubePluginWidget')
    .controller('WidgetFeedCtrl', ['$scope', 'Buildfire', 'DataStore', 'TAG_NAMES', 'STATUS_CODE', 'YoutubeApi', 'VIDEO_COUNT', '$sce', 'Location', '$rootScope', 'LAYOUTS', 'VideoCache',
      function ($scope, Buildfire, DataStore, TAG_NAMES, STATUS_CODE, YoutubeApi, VIDEO_COUNT, $sce, Location, $rootScope, LAYOUTS, VideoCache) {
        var WidgetFeed = this;

        WidgetFeed.data = {};
        //create new instance of buildfire carousel viewer
        var view = null;
        WidgetFeed.videos = [];
        WidgetFeed.busy = false;
        WidgetFeed.nextPageToken = null;
        $rootScope.showFeed = true;
        var currentListLayout = null;
        var currentPlayListId = null;

        /*
         * Fetch user's data from datastore
         */
        var init = function () {
          var success = function (result) {
              WidgetFeed.data = result.data;
              if (!WidgetFeed.data.design)
                WidgetFeed.data.design = {};
              if (!WidgetFeed.data.content)
                WidgetFeed.data.content = {};
              if (!WidgetFeed.data.design.itemListLayout) {
                WidgetFeed.data.design.itemListLayout = LAYOUTS.listLayouts[0].name;
              }
              if (WidgetFeed.data.content.type)
                $rootScope.contentType = WidgetFeed.data.content.type;
              currentListLayout = WidgetFeed.data.design.itemListLayout;
              if (WidgetFeed.data.content && WidgetFeed.data.content.playListID) {
                currentPlayListId = WidgetFeed.data.content.playListID;
              }
              if (WidgetFeed.data.content && WidgetFeed.data.content.videoID) {
                console.log('single video detected');
                Location.goTo("#/video/" + WidgetFeed.data.content.videoID);
              }
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
            view = new Buildfire.components.carousel.view("#carousel", []);
          }
          if (WidgetFeed.data.content && WidgetFeed.data.content.carouselImages) {
            view.loadItems(WidgetFeed.data.content.carouselImages);
          } else {
            view.loadItems([]);
          }
        });

        var getFeedVideos = function (_playlistId) {
          Buildfire.spinner.show();
          var success = function (result) {
              Buildfire.spinner.hide();
              WidgetFeed.videos = WidgetFeed.videos.length ? WidgetFeed.videos.concat(result.items) : result.items;
              WidgetFeed.nextPageToken = result.nextPageToken;
              if (WidgetFeed.videos.length < result.pageInfo.totalResults) {
                WidgetFeed.busy = false;
              }
            }
            , error = function (err) {
              Buildfire.spinner.hide();
              console.error('Error In Fetching feed Videos', err);
            };
          YoutubeApi.getFeedVideos(_playlistId, VIDEO_COUNT.LIMIT, WidgetFeed.nextPageToken).then(success, error);
        };

        var onUpdateCallback = function (event) {
          if (event && event.tag === TAG_NAMES.YOUTUBE_INFO) {
            WidgetFeed.data = event.data;
            if (!WidgetFeed.data.design)
              WidgetFeed.data.design = {};
            if (!WidgetFeed.data.content)
              WidgetFeed.data.content = {};
            if (WidgetFeed.data.content.type)
              $rootScope.contentType = WidgetFeed.data.content.type;
            if (!WidgetFeed.data.design.itemListLayout) {
              WidgetFeed.data.design.itemListLayout = LAYOUTS.listLayouts[0].name;
            }

            if (currentListLayout != WidgetFeed.data.design.itemListLayout && view && WidgetFeed.data.content.carouselImages) {
              if (WidgetFeed.data.content.carouselImages.length)
                view._destroySlider();
              view = null;
            }
            else {
              if (view) {
                view.loadItems(WidgetFeed.data.content.carouselImages);
              }
            }
            currentListLayout = WidgetFeed.data.design.itemListLayout;

            if (!WidgetFeed.data.content.rssUrl) {
              WidgetFeed.videos = [];
              WidgetFeed.busy = false;
              WidgetFeed.nextPageToken = null;
            }
            else if (!(WidgetFeed.videos.length > 0) && WidgetFeed.data.content.playListID) {
              currentPlayListId = WidgetFeed.data.content.playListID;
              getFeedVideos(WidgetFeed.data.content.playListID);
            }

            if (WidgetFeed.data.content && WidgetFeed.data.content.playListID && (WidgetFeed.data.content.playListID !== currentPlayListId)) {
              currentPlayListId = WidgetFeed.data.content.playListID;
              WidgetFeed.videos = [];
              WidgetFeed.busy = false;
              WidgetFeed.nextPageToken = null;
              WidgetFeed.loadMore();
            } else if (WidgetFeed.data.content && WidgetFeed.data.content.videoID)
              Location.goTo("#/video/" + WidgetFeed.data.content.videoID);
          }
        };
        DataStore.onUpdate().then(null, null, onUpdateCallback);

        WidgetFeed.loadMore = function () {
          if (WidgetFeed.busy) return;
          WidgetFeed.busy = true;
          if (currentPlayListId && currentPlayListId !== '1') {
            getFeedVideos(currentPlayListId);
          }
          else {
            if (WidgetFeed.data.content.videoID)
              Location.goTo("#/video/" + WidgetFeed.data.content.videoID);
          }
        };

        WidgetFeed.safeHtml = function (html) {
          if (html)
            return $sce.trustAsHtml(html);
        };

        WidgetFeed.showDescription = function (description) {
          var _retVal = false;
          if (description) {
            description = description.trim();
            if ((description !== '<p>&nbsp;<br></p>') && (description !== '<p><br data-mce-bogus="1"></p>')) {
              _retVal = true;
            }
          }
          return _retVal;
        };

        WidgetFeed.openDetailsPage = function (video) {
          video.id = video.snippet.resourceId.videoId;
          VideoCache.setCache(video);
          Location.goTo('#/video/' + video.snippet.resourceId.videoId);
        };

        $rootScope.$on("ROUTE_CHANGED", function (e, data) {
          WidgetFeed.data = data;
          if (!WidgetFeed.data.design)
            WidgetFeed.data.design = {};
          if (!WidgetFeed.data.content)
            WidgetFeed.data.content = {};
          if (!(WidgetFeed.videos.length > 0) && WidgetFeed.data.content.playlistId) {
            currentPlayListId = WidgetFeed.data.content.playlistId;
            getFeedVideos(WidgetFeed.data.content.playListID);
          }
          if (!view) {
            view = new Buildfire.components.carousel.view("#carousel", []);
          }
          if (view && WidgetFeed.data.content.carouselImages) {
            view.loadItems(WidgetFeed.data.content.carouselImages);
          }
          DataStore.onUpdate().then(null, null, onUpdateCallback);
        });

        $scope.$on("$destroy", function () {
          DataStore.clearListener();
        });
      }
    ])
})
(window.angular);
