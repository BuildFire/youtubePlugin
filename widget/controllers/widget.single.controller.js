"use strict";

(function(angular, buildfire) {
  angular.module("youtubePluginWidget").controller("WidgetSingleCtrl", [
    "$routeParams",
    "$scope",
    "YoutubeApi",
    "DataStore",
    "TAG_NAMES",
    "Location",
    "LAYOUTS",
    "$rootScope",
    "VideoCache",
    function(
      $routeParams,
      $scope,
      YoutubeApi,
      DataStore,
      TAG_NAMES,
      Location,
      LAYOUTS,
      $rootScope,
      VideoCache
    ) {
      buildfire.datastore.onRefresh(function() {
        // Don't do anything on pull down
      });

      var currentItemDetailsBgImage = "",
        currentPlayListID = null,
        currentItemListLayout = null;
      var WidgetSingle = this;
      WidgetSingle.data = null;
      WidgetSingle.video = null;
      WidgetSingle.viewSource = function(link) {
        if (link) {
          buildfire.navigation.openWindow(link);
        }
      };

      buildfire.auth.onLogin(function() {
        bookmarks.findAndMarkAll($scope);
      });

      buildfire.auth.onLogout(function() {
        bookmarks.findAndMarkAll($scope);
      });

      /*
       * Fetch user's data from datastore
       */

      var init = function() {
        var success = function(result) {
            WidgetSingle.data = result.data;
            viewedVideos.init();
            if (!WidgetSingle.data.design) WidgetSingle.data.design = {};
            if (!WidgetSingle.data.content) WidgetSingle.data.content = {};
            if (!WidgetSingle.data.design.itemListLayout) {
              WidgetSingle.data.design.itemListLayout =
                LAYOUTS.listLayouts[0].name;
            }
            if (WidgetSingle.data.design.itemDetailsBgImage) {
              $rootScope.backgroundImage =
                WidgetSingle.data.design.itemDetailsBgImage;
            }

            currentItemListLayout = WidgetSingle.data.design.itemListLayout;
            currentPlayListID = WidgetSingle.data.content.playListID;
          },
          error = function(err) {
            console.error("Error while getting data", err);
          };
        DataStore.get(TAG_NAMES.YOUTUBE_INFO).then(success, error);
      };
      init();

      var getSingleVideoDetails = function(_videoId) {
        var success = function(result) {
            $rootScope.showFeed = false;
            WidgetSingle.video = result;
            bookmarks.findAndMarkAll($scope);
            viewedVideos.markViewed($scope, WidgetSingle.video);
          },
          error = function(err) {
            $rootScope.showFeed = false;
            console.error("Error In Fetching Single Video Details", err);
          };
        YoutubeApi.getSingleVideoDetails(_videoId).then(success, error);
      };

      WidgetSingle.bookmark = function() {
        var isBookmarked = WidgetSingle.video.bookmarked ? true : false;

        if (isBookmarked) {
          bookmarks.delete($scope, WidgetSingle.video);
        } else {
          bookmarks.add($scope, WidgetSingle.video);
        }
      };

      WidgetSingle.share = function() {
        var link = "";
        if (WidgetSingle.video.snippet.resourceId) {
          link = WidgetSingle.video.snippet.resourceId.videoId;
        } else {
          link = WidgetSingle.video.id;
        }
        var options = {
          subject: WidgetSingle.video.snippet.title,
          text: WidgetSingle.video.snippet.description,
          // image: WidgetSingle.video.snippet.thumbnails.default.url,
          link: link
        };

        var callback = function(err, res) {};

        buildfire.device.share(options, callback);
      };

      WidgetSingle.addNote = function() {
        window.player.pauseVideo();
        var options = {
          imageUrl: $scope.WidgetSingle.video.snippet.thumbnails.default.url,
          itemId: $scope.WidgetSingle.video.snippet.resourceId.videoId,
          title: $scope.WidgetSingle.video.snippet.title,
          timeIndex: Math.round(window.player.getCurrentTime())
        };
        var callback = function(err, data) {
          if (err) throw err;
        };
        // buildfire.input.showTextDialog(options, callback);
        buildfire.notes.openDialog(options, callback);
      };

      buildfire.notes &&
        buildfire.notes.onSeekTo &&
        buildfire.notes.onSeekTo(function(data) {
          WidgetSingle.video.seekTo = data.time;
          if (WidgetSingle.video.seekTo) {
            window.player.seekTo(WidgetSingle.video.seekTo);
            // player.playVideo();
          }
        });

      if ($routeParams.videoId) {
        if (VideoCache.getCache()) {
          $rootScope.showFeed = false;
          WidgetSingle.video = VideoCache.getCache();
          window.addEventListener(
            "message",
            function(e) {
              if (e.data.cmd) return;
              var data = e.data;
              if (typeof data === "string") {
                data = JSON.parse(e.data);
              }
              if (data.event === "onReady") {
                if (WidgetSingle.video.seekTo) {
                  window.player.seekTo(WidgetSingle.video.seekTo);
                } else {
                  window.player.playVideo();
                }
              }
            },
            false
          );
        } else getSingleVideoDetails($routeParams.videoId);
      } else {
        console.error("Undefined Video Id Provided");
      }

      var onUpdateCallback = function(event) {
        if (event && event.tag === TAG_NAMES.YOUTUBE_INFO) {
          WidgetSingle.data = event.data;

          if (!WidgetSingle.data.design) {
            WidgetSingle.data.design = {};
          }

          if (!WidgetSingle.data.content) {
            WidgetSingle.data.content = {};
          }

          if (WidgetSingle.data.design.itemDetailsBgImage) {
            $rootScope.backgroundImage =
              WidgetSingle.data.design.itemDetailsBgImage;
          } else {
            $rootScope.backgroundImage = "";
          }

          if (WidgetSingle.data.content.type) {
            $rootScope.contentType = WidgetSingle.data.content.type;
          }

          if (!WidgetSingle.data.content.rssUrl) {
            $routeParams.videoId = "";
            WidgetSingle.video = null;
          } else if (
            !WidgetSingle.video &&
            WidgetSingle.data.content.videoID &&
            !$routeParams.videoId
          ) {
            $routeParams.videoId = WidgetSingle.data.content.videoID;
            getSingleVideoDetails(WidgetSingle.data.content.videoID);
          } else if (
            !WidgetSingle.video &&
            WidgetSingle.data.content.playListID &&
            !$routeParams.videoId
          ) {
            currentPlayListID = WidgetSingle.data.content.playListID;
            $rootScope.showFeed = true;
            Location.goTo("#/");
          }

          if (
            WidgetSingle.data.content.videoID &&
            WidgetSingle.data.content.videoID !== $routeParams.videoId
          ) {
            getSingleVideoDetails(WidgetSingle.data.content.videoID);
          } else if (
            WidgetSingle.data.content.playListID &&
            (!$routeParams.videoId ||
              WidgetSingle.data.design.itemListLayout !==
                currentItemListLayout ||
              WidgetSingle.data.content.playListID !== currentPlayListID)
          ) {
            currentPlayListID = WidgetSingle.data.content.playListID;
            currentItemListLayout = WidgetSingle.data.design.itemListLayout;
            $rootScope.showFeed = true;
            Location.goTo("#/");
          }
        }
      };

      DataStore.onUpdate().then(null, null, onUpdateCallback);

      $scope.$on("$destroy", function() {
        DataStore.clearListener();
        $rootScope.$broadcast("ROUTE_CHANGED", WidgetSingle.data);
      });
    }
  ]);
})(window.angular, window.buildfire);
