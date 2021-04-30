"use strict";

(function(angular, buildfire) {
  angular.module("youtubePluginWidget").controller("WidgetFeedCtrl", [
    "$scope",
    "Buildfire",
    "DataStore",
    "TAG_NAMES",
    "STATUS_CODE",
    "YoutubeApi",
    "VIDEO_COUNT",
    "$sce",
    "Location",
    "$rootScope",
    "LAYOUTS",
    "VideoCache",
    function(
      $scope,
      Buildfire,
      DataStore,
      TAG_NAMES,
      STATUS_CODE,
      YoutubeApi,
      VIDEO_COUNT,
      $sce,
      Location,
      $rootScope,
      LAYOUTS,
      VideoCache
    ) {
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
      WidgetFeed.masterData = {
        playListId: ""
      };
      WidgetFeed.pluginName = "YouTube";

      /*declare the device width heights*/
      $rootScope.deviceHeight = window.innerHeight;
      $rootScope.deviceWidth = window.innerWidth || 320;
      WidgetFeed.appHeight = window.innerWidth * (9 / 16);

      var handleBookmarkNav = function handleBookmarkNav(videos) {
        buildfire.deeplink.getData(function(data) {
          if (data && data.link) {
            var video = videos.filter(function(video) {
              return video.snippet.resourceId.videoId === data.link;
            })[0];
            WidgetFeed.openDetailsPage(video);
          }
        });
      };

      /*
       * Fetch user's data from datastore
       */
      var initData = function(isRefresh) {
        var success = function(result) {
            cache.getCache(function(err, data) {
              // if the rss feed url has changed, ignore the cache and update when fetched. Also, if forcedCleanupv1 is false, it will skip cache and proceed with fetching.
              if (err || !data || data.rssUrl != result.data.content.rssUrl || !data.forcedCleanupv1)
                return;
              getFeedVideosSuccess(data);
            });

            WidgetFeed.data = result.data;
            if (!WidgetFeed.data.design) WidgetFeed.data.design = {};
            if (!WidgetFeed.data.content) WidgetFeed.data.content = {};
            if (!WidgetFeed.data.design.itemListLayout) {
              WidgetFeed.data.design.itemListLayout =
                LAYOUTS.listLayouts[0].name;
            }
            if (WidgetFeed.data.design.itemListBgImage) {
              $rootScope.backgroundListImage =
                WidgetFeed.data.design.itemListBgImage;
            }
            if (!result.id) {
              WidgetFeed.data.content.playListID = TAG_NAMES.DEFAULT_FEED_ID;
            }
            if (WidgetFeed.data.content.type)
              $rootScope.contentType = WidgetFeed.data.content.type;
            currentListLayout = WidgetFeed.data.design.itemListLayout;
            if (WidgetFeed.data.content && WidgetFeed.data.content.playListID) {
              currentPlayListId = WidgetFeed.data.content.playListID;
              WidgetFeed.masterData.playListId = currentPlayListId;
            }
            if (WidgetFeed.data.content && WidgetFeed.data.content.videoID) {
              Location.goTo("#/video/" + WidgetFeed.data.content.videoID);
            }
            if (!$scope.$$phase) $scope.$digest();
            if (isRefresh) {
              if (
                currentListLayout != WidgetFeed.data.design.itemListLayout &&
                view &&
                WidgetFeed.data.content.carouselImages
              ) {
                if (WidgetFeed.data.content.carouselImages.length)
                  view._destroySlider();
                view = null;
              } else {
                if (view) {
                  view.loadItems(WidgetFeed.data.content.carouselImages);
                }
              }
              WidgetFeed.loadMore();
            }
            // bookmarks.findAndMarkAll($scope);
            viewedVideos.findAndMarkViewed(WidgetFeed.videos);
          },
          error = function(err) {
            if (err && err.code !== STATUS_CODE.NOT_FOUND) {
              console.error("Error while getting data", err);
            }
          };
        DataStore.get(TAG_NAMES.YOUTUBE_INFO).then(success, error);
      };
      var init = function(isRefresh) {
        buildfire.getContext(function(err, result) {
          if (err) console.error(err);
          window.bfInstanceId = result.instanceId;
          WidgetFeed.pluginName = (result && result.title) || "YouTube";
        });

        viewedVideos.init();
        initData(isRefresh);
      };

      var handleBookmarkNav = function handleBookmarkNav(videos) {
        buildfire.deeplink.getData(function(data) {
          if (data && data.link) {
            var linkD = data.link;
            if (linkD.indexOf("yt:video") > -1) {
              linkD = linkD.slice(linkD.lastIndexOf(":") + 1, linkD.length);
            }
            var video = videos.filter(function(video) {
              return video.snippet.resourceId.videoId === linkD;
            })[0];
            if (data.timeIndex) video.seekTo = data.timeIndex;
            WidgetFeed.openDetailsPage(video);
          }
        });
      };

      init();
      $rootScope.$on("Carousel:LOADED", function() {
        WidgetFeed.view = null;
        if (!WidgetFeed.view) {
          var carouselSlides = WidgetFeed.data.content.carouselImages || [];
          var carouselSelector = document.getElementById("carousel");
          WidgetFeed.view = new Buildfire.components.carousel.view({
            selector: carouselSelector,
            items: carouselSlides
          });
          var css =
            "min-height: " +
            window.innerWidth * 0.5625 +
            "px !important;position: relative;top: 0px;left: 0px; display: block;";
          setTimeout(function() {
            document.getElementById("carousel").setAttribute("style", css);
          }, 50);
        }
        if (WidgetFeed.data.content && WidgetFeed.data.content.carouselImages) {
          WidgetFeed.view._loadImages(
            WidgetFeed.data.content.carouselImages,
            () => console.log("WidgetFeed Load Images")
          );
        } else {
          WidgetFeed.view._loadImages([], () =>
            console.log("WidgetFeed Load Images []")
          );
        }
      });
      var getFeedVideosSuccess = function(result) {
        // compare the first item of the cached feed and the fetched feed
        // return if the feed hasnt changed

        var isUnchanged =
          WidgetFeed.videos[0] &&
          WidgetFeed.videos[0].id === result.items[0].id;
        if (isUnchanged) {
          Buildfire.spinner.hide();
          return;
        }

        bookmarks.findAndMarkAll($scope);
        viewedVideos.findAndMarkViewed(result.items);
        WidgetFeed.videos = WidgetFeed.videos.length
          ? WidgetFeed.videos.concat(result.items)
          : result.items;
        handleBookmarkNav(WidgetFeed.videos);

        // attach the feed url for diff checking later
        // save or update the cache
        result.rssUrl = WidgetFeed.data.content.rssUrl
          ? WidgetFeed.data.content.rssUrl
          : false;
        var mutatedResult = JSON.parse(JSON.stringify(result));
        mutatedResult.items = WidgetFeed.videos;
        mutatedResult.forcedCleanupv1 = true; // Used to cleanup all cache from old users, since there was a bug in cache.
        cache.saveCache(mutatedResult);
        Buildfire.spinner.hide();

        WidgetFeed.nextPageToken = result.nextPageToken;
        if (WidgetFeed.videos.length < result.pageInfo.totalResults) {
          WidgetFeed.busy = false;
        }
        if (!$scope.$$phase) $scope.$digest();
      };

      var getFeedVideosError = function(err) {
        Buildfire.spinner.hide();
        console.error("Error In Fetching feed Videos", err);
      };

      var getFeedVideos = function(_playlistId) {
        Buildfire.spinner.show();
        YoutubeApi.getFeedVideos(
          _playlistId,
          VIDEO_COUNT.LIMIT,
          WidgetFeed.nextPageToken
        ).then(getFeedVideosSuccess, getFeedVideosError);
      };

      var onUpdateCallback = function(event) {
        if (event && event.tag === TAG_NAMES.YOUTUBE_INFO) {
          WidgetFeed.data = event.data;
          if (!WidgetFeed.data.design) WidgetFeed.data.design = {};
          if (!WidgetFeed.data.content) WidgetFeed.data.content = {};
          if (WidgetFeed.data.content.type)
            $rootScope.contentType = WidgetFeed.data.content.type;
          if (!WidgetFeed.data.design.itemListLayout) {
            WidgetFeed.data.design.itemListLayout = LAYOUTS.listLayouts[0].name;
          }
          if (WidgetFeed.data.design.itemListBgImage) {
            $rootScope.backgroundListImage =
              WidgetFeed.data.design.itemListBgImage;
          } else {
            $rootScope.backgroundListImage = "";
          }

          if (
            currentListLayout != WidgetFeed.data.design.itemListLayout &&
            view &&
            WidgetFeed.data.content.carouselImages
          ) {
            if (WidgetFeed.data.content.carouselImages.length)
              view._destroySlider();
            view = null;
          } else {
            if (view) {
              view.loadItems(WidgetFeed.data.content.carouselImages);
            }
          }
          currentListLayout = WidgetFeed.data.design.itemListLayout;
          currentPlayListId = WidgetFeed.data.content.playListID;

          if (!WidgetFeed.data.content.rssUrl) {
            WidgetFeed.videos = [];
            WidgetFeed.busy = false;
            WidgetFeed.nextPageToken = null;
          } else if (
            !(WidgetFeed.videos.length > 0) &&
            WidgetFeed.data.content.playListID
          ) {
            currentPlayListId = WidgetFeed.data.content.playListID;
            getFeedVideos(WidgetFeed.data.content.playListID);
          }

          if (
            WidgetFeed.data.content &&
            WidgetFeed.data.content.playListID &&
            WidgetFeed.data.content.playListID !==
              WidgetFeed.masterData.playListId
          ) {
            currentPlayListId = WidgetFeed.data.content.playListID;
            WidgetFeed.masterData.playListId = currentPlayListId;
            WidgetFeed.videos = [];
            WidgetFeed.busy = false;
            WidgetFeed.nextPageToken = null;
            WidgetFeed.loadMore();
          } else if (WidgetFeed.data.content && WidgetFeed.data.content.videoID)
            Location.goTo("#/video/" + WidgetFeed.data.content.videoID);
        }
      };
      DataStore.onUpdate().then(null, null, onUpdateCallback);

      WidgetFeed.loadMore = function() {
        if (WidgetFeed.busy) return;
        WidgetFeed.busy = true;
        if (currentPlayListId && currentPlayListId !== "1") {
          getFeedVideos(currentPlayListId);
        } else {
          if (WidgetFeed.data.content.videoID)
            Location.goTo("#/video/" + WidgetFeed.data.content.videoID);
        }
      };

      WidgetFeed.safeHtml = function(html) {
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

      WidgetFeed.showDescription = function(description) {
        var _retVal = false;
        if (description) {
          description = description.trim();
          if (
            description !== "<p>&nbsp;<br></p>" &&
            description !== '<p><br data-mce-bogus="1"></p>'
          ) {
            _retVal = true;
          }
        }
        return _retVal;
      };

      WidgetFeed.view = function(video) {
        viewedVideos.markViewed($scope, video);
      };

      WidgetFeed.openDetailsPage = function(video) {
        setTimeout(function() {
          viewedVideos.markViewed($scope, video);
        }, 2000);
        video.id = video.snippet.resourceId.videoId;
        VideoCache.setCache(video);
        buildfire.history.push(WidgetFeed.pluginName, {
          showLabelInTitlebar: true
        });
        Location.goTo("#/video/" + video.snippet.resourceId.videoId);
      };

      WidgetFeed.getThumbnail = function(video) {
        var isTablet = $rootScope.deviceWidth >= 768;
        if (isTablet) {
          return video.snippet.thumbnails.maxres.url;
        } else {
          return video.snippet.thumbnails.medium.url;
        }
      };

      WidgetFeed.bookmark = function($event, video) {
        $event.stopImmediatePropagation();
        var isBookmarked = video.bookmarked ? true : false;
        if (isBookmarked) {
          bookmarks.delete($scope, video);
        } else {
          bookmarks.add($scope, video);
        }
      };

      WidgetFeed.share = function($event, video) {
        $event.stopImmediatePropagation();

        var options = {
          subject: video.snippet.title,
          text: video.snippet.description,
          // image: video.snippet.thumbnails.default.url,
          link: "https://youtu.be/" + video.snippet.resourceId.videoId
        };
        var callback = function(err, result) {
          if (err) {
            console.warn(err);
          }
        };

        buildfire.device.share(options, callback);
      };

      WidgetFeed.updateAuthListeners = function() {
        buildfire.auth.onLogin(function(user) {
          init(true);
        });

        buildfire.auth.onLogout(function(err) {
          console.log(err);
          init(true);
        });
      };

      $rootScope.$on("ROUTE_CHANGED", function(e, data) {
        WidgetFeed.data = data;

        WidgetFeed.updateAuthListeners();

        if (WidgetFeed.data && !WidgetFeed.data.design) {
          WidgetFeed.data.design = {};
        }

        if (WidgetFeed.data && !WidgetFeed.data.content) {
          WidgetFeed.data.content = {};
        }

        if (
          WidgetFeed.data &&
          WidgetFeed.data.content.playListID &&
          WidgetFeed.masterData.playListId != WidgetFeed.data.content.playListID
        ) {
          WidgetFeed.busy = false;
          WidgetFeed.nextPageToken = null;
          WidgetFeed.videos = [];
          WidgetFeed.masterData.playListId = WidgetFeed.data.content.playListID;
          getFeedVideos(WidgetFeed.data.content.playListID);
        }

        if (WidgetFeed.data.design && WidgetFeed.data.design.itemListBgImage) {
          $rootScope.backgroundListImage =
            WidgetFeed.data.design.itemListBgImage;
        } else {
          $rootScope.backgroundListImage = "";
        }

        if (
          !(WidgetFeed.videos.length >= 0) &&
          WidgetFeed.data.content.playlistId
        ) {
          currentPlayListId = WidgetFeed.data.content.playListID;
          WidgetFeed.masterData.playListId = currentPlayListId;
          getFeedVideos(WidgetFeed.data.content.playListID);
        } else {
          bookmarks.findAndMarkAll($scope);
        }

        if (
          currentListLayout != WidgetFeed.data.design.itemListLayout &&
          view &&
          WidgetFeed.data.content.carouselImages
        ) {
          if (WidgetFeed.data.content.carouselImages.length) {
            view._destroySlider();
            view = null;
          }
        } else {
          if (view) {
            view.loadItems(WidgetFeed.data.content.carouselImages);
          }
        }

        currentListLayout = WidgetFeed.data.design.itemListLayout;

        DataStore.onUpdate().then(null, null, onUpdateCallback);

        buildfire.datastore.onRefresh(function() {
          WidgetFeed.videos = [];
          WidgetFeed.busy = false;
          WidgetFeed.nextPageToken = null;
          initData(true);
        });
      });

      buildfire.datastore.onRefresh(function() {
        WidgetFeed.videos = [];
        WidgetFeed.busy = false;
        WidgetFeed.nextPageToken = null;
        initData(true);
      });

      $scope.$on("$destroy", function() {
        DataStore.clearListener();
      });

      $scope.$on("$viewContentLoaded", function() {
        buildfire.appearance.ready();
      });

      WidgetFeed.updateAuthListeners();
    }
  ]);
})(window.angular, window.buildfire);
