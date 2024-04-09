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
    "$sce",
    function(
      $routeParams,
      $scope,
      YoutubeApi,
      DataStore,
      TAG_NAMES,
      Location,
      LAYOUTS,
      $rootScope,
      VideoCache,
      $sce
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
      WidgetSingle.viewSource = function(WidgetSingle) {
        if (
          WidgetSingle &&
          WidgetSingle.video &&
          WidgetSingle.video.snippet &&
          WidgetSingle.video.snippet.resourceId &&
          WidgetSingle.video.snippet.resourceId.videoId
        ) {
          buildfire.navigation.openWindow(`https://www.youtube.com/watch?v=${WidgetSingle.video.snippet.resourceId.videoId}`, '_system');
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
            $rootScope.loading = false;
            WidgetSingle.video = result;
            let options = {
              text: WidgetSingle.video.snippet.description,
              supportedHashtagType: 'youtube'
            };
            buildfire.format.textToHTML(options, (err, result) => {
              if(err) return console.error(`ERROR: ${err}`);
              WidgetSingle.video.snippet.wwg = result.html;
              if (!$scope.$$phase) {
                $scope.$digest();
              }
            });
            bookmarks.findAndMarkAll($scope);
            viewedVideos.markViewed($scope, WidgetSingle.video);
          },
          error = function(err) {
            $rootScope.loading = false;
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
        pauseStopVideo();
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
        pauseStopVideo();
        var videoId = $scope.WidgetSingle.video.snippet.resourceId
          ? $scope.WidgetSingle.video.snippet.resourceId.videoId
          : $scope.WidgetSingle.video.id;

        var options = {
          imageUrl: $scope.WidgetSingle.video.snippet.thumbnails.default.url,
          itemId: videoId,
          title: $scope.WidgetSingle.video.snippet.title,
          timeIndex: Math.round(window.player.getCurrentTime())
        };
        var callback = function(err, data) {
          if (err) throw err;
        };
        buildfire.notes.openDialog(options, callback);
      };

      WidgetSingle.safeHtml = function(html) {
        if (html) {
          var $html = $("<div />", { html: html });
          $html.find("iframe").each(function(index, element) {
            var src = element.src;
            src =
              src && src.indexOf("file://") != -1
                ? src.replace("file://", "http://")
                : src;
            element.src =
              src && src.indexOf("http") != -1 ? src : "http:" + src;
          });
          return $sce.trustAsHtml($html.html());
        }
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
          let options = {
            text: WidgetSingle.video.snippet.description,
            supportedHashtagType: 'youtube'
          };
          buildfire.format.textToHTML(options, (err, result) => {
            if(err) return console.error(`ERROR: ${err}`);
            WidgetSingle.video.snippet.wwg = result.html;
            if (!$scope.$$phase) {
              $scope.$digest();
            }
          });
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
          if (WidgetSingle.data.content.rssUrl !== event.data.content.rssUrl) {
            $rootScope.loading = true;
          }
          if ($rootScope.currentVideo) {
            $rootScope.currentVideo = null;
            buildfire.history.pop();
          }
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
            $rootScope.loading = false;
            $rootScope.showEmptyState = true;
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
            $rootScope.loading = false;
            currentPlayListID = WidgetSingle.data.content.playListID;
            $rootScope.showFeed = true;
            Location.goTo("#/");
          }

          if (
            WidgetSingle.data.content.videoID &&
            WidgetSingle.data.content.videoID !== $routeParams.videoId
          ) {
            $routeParams.videoId = WidgetSingle.data.content.videoID;
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
            $rootScope.loading = false;
            Location.goTo("#/");
          }
        }
      };

      DataStore.onUpdate().then(null, null, onUpdateCallback);

      buildfire.history.onPop(() => {
        $rootScope.showFeed = true;
        Location.goTo("#/");
      });

      $scope.$on("$destroy", function() {
        DataStore.clearListener();
        $rootScope.$broadcast("ROUTE_CHANGED", WidgetSingle.data);
      });
    }
  ]);
})(window.angular, window.buildfire);
