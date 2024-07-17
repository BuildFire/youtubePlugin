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
      $rootScope.loading = true;
      var currentListLayout = null;
      WidgetFeed.masterData = {
        playListId: ""
      };
      WidgetFeed.pluginName = "YouTube";
      WidgetFeed.screenAnimationInProgress = false;

      /*declare the device width heights*/
      $rootScope.deviceHeight = window.innerHeight;
      $rootScope.deviceWidth = window.innerWidth || 320;
      $rootScope.currentVideo = null;
      WidgetFeed.appHeight = window.innerWidth * (9 / 16);

      var checkForNewDataFromYouTube = function (cache){
        var compareDataFromCacheAndYouTube = function(result){
          var isUnchanged=false;
          if(cache.items && result.items && result.items.length){
            result.items = result.items.filter(item => (
              item.snippet &&
              item.snippet.thumbnails &&
              Object.keys(item.snippet.thumbnails).length));

            if(cache.items.length == result.items.length){
              var flag=false;
              for (let i = 0; i < cache.items.length; i++) {
                if(cache.items[i].id!=result.items[i].id){
                  flag=true;
                }
              }
              if(!flag){
                isUnchanged=true;
              }
            }
          }
          if(!isUnchanged){
            WidgetFeed.videos = [];
            WidgetFeed.busy = false;
            WidgetFeed.nextPageToken = null;
            setTimeout(() => {
              if(!$rootScope.loading){
                getFeedVideosSuccess(result);
              }
            }, 0);
            if (!$scope.$$phase) $scope.$digest();
          }
        };
        var errorWithComperation = function(err){
          console.error("Error while getting data", err);
        };

        if (WidgetFeed.data.content.playListID && WidgetFeed.data.content.playListID !== "1") {
          YoutubeApi.getFeedVideos(
            WidgetFeed.data.content.playListID,
            VIDEO_COUNT.LIMIT,
            null
          ).then(compareDataFromCacheAndYouTube, errorWithComperation);
        }
      };
      /*
       * Fetch user's data from datastore
       */
      var initData = function(isRefresh) {
        var success = function(result) {
            if ($scope.deeplinkData && !$scope.isDeeplinkItemOpened) {
              processDeeplink($scope.deeplinkData, false);
            }
            cache.getCache(function(err, data) {
              // if the rss feed url has changed, ignore the cache and update when fetched. Also, if forcedCleanupv2 is false, it will skip cache and proceed with fetching.
              if (err || !data || data.rssUrl != result.data.content.rssUrl || !data.forcedCleanupv2) {
                $rootScope.loading = false;
              } else {
                getFeedVideosSuccess(data);
                checkForNewDataFromYouTube(data);
              }
              if ($scope.deeplinkData && !$scope.isDeeplinkItemOpened) {
                processDeeplink($scope.deeplinkData, false);
              }
              if (!$rootScope.$$phase) $rootScope.$digest();
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
              WidgetFeed.masterData.playListId = WidgetFeed.data.content.playListID;
            } else if (WidgetFeed.data.content && WidgetFeed.data.content.videoID) {
              Location.goTo("#/video/" + WidgetFeed.data.content.videoID);
            } else {
              $rootScope.showEmptyState = true;
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
            viewedVideos.findAndMarkViewed(WidgetFeed.videos);
          },
          error = function(err) {
            $rootScope.loading = false;
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

      const toggleDeeplinkSkeleton = (show) => {
        const deeplinkSkeletonContainer = document.getElementById('deeplinkSkeleton');
        if (show && !this.deeplinkSkeleton) {
            this.deeplinkSkeleton = new buildfire.components.skeleton('#deeplinkSkeleton', {
                type: 'image, list-item, sentence, paragraph',
            })
            this.deeplinkSkeleton.start();
            deeplinkSkeletonContainer.classList.remove('hidden');
        } else if (!show && this.deeplinkSkeleton) {
            deeplinkSkeletonContainer.classList.add('hidden');
            this.deeplinkSkeleton.stop();
            this.deeplinkSkeleton = null;
        }
      };
      $scope.deeplinkData = null;
      $scope.isDeeplinkItemOpened = false;
      // show the deeplink skeleton if the deeplink is present
      buildfire.deeplink.getData(function (data) {
        if (data && (data.link || data.feed)) {
          $rootScope.showFeed = false;
          toggleDeeplinkSkeleton(true);
          $scope.deeplinkData = data;
        }
      });
      buildfire.deeplink.onUpdate(function (data) {
        if (data && (data.link || data.feed)) {
          $scope.deeplinkData = data;
          toggleDeeplinkSkeleton(true);
          processDeeplink(data, true);
        }
      });

      function processDeeplink (data, pushToHistory=true) {
        if (data && data.feed) {
          let id = data.feed.id;
          if (id.indexOf("yt:video") > -1) {
            id = id.slice(id.lastIndexOf(":") + 1, id.length);
          }
          if (data.timeIndex) video.seekTo = data.timeIndex;
          $scope.isDeeplinkItemOpened = true;
          WidgetFeed.openDetailsPage({
            ...data.feed, id,
            snippet: {
              title: data.feed.title,
              description:data.feed.description,
              thumbnails: {
                default: {
                  url: data.feed.image_url
                }
              }
            },
          }, pushToHistory);
        } else if (data && data.link) {
          let linkD = data.link;
          if (linkD.indexOf("yt:video") > -1) {
            linkD = linkD.slice(linkD.lastIndexOf(":") + 1, linkD.length);
          }

          let video = WidgetFeed.videos.filter(function(video) {
            return video.snippet.resourceId.videoId === linkD;
          })[0];

          if (!video) {
            YoutubeApi.getSingleVideoDetails(linkD).then((result) => {
              video = result;
              if (data.timeIndex) video.seekTo = data.timeIndex;
              $scope.isDeeplinkItemOpened = true;
              WidgetFeed.openDetailsPage(video, pushToHistory);
            }).catch((err) => {
              console.error("Error while getting video details", err);
              toggleDeeplinkSkeleton(false);
              $rootScope.loading = false;
              $rootScope.showFeed = true;
            });
          } else {
            if (data.timeIndex) video.seekTo = data.timeIndex;
            $scope.isDeeplinkItemOpened = true;
            WidgetFeed.openDetailsPage(video, pushToHistory);
          }
        }
      }

      init();
      $rootScope.$on("Carousel:LOADED", function() {
        WidgetFeed.view = null;
        var carouselSlides = WidgetFeed.data.content && WidgetFeed.data.content.carouselImages || [];
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
      });
      var getFeedVideosSuccess = function(result) {
        // double check that result is not null
        if (result && result.items && result.items.length) {
          result.items = result.items.filter(item => (
            item.snippet &&
            item.snippet.thumbnails &&
            Object.keys(item.snippet.thumbnails).length));

          $rootScope.showEmptyState = false;
        } else {
          $rootScope.showEmptyState = true;
        }
        Buildfire.spinner.hide();
        $rootScope.loading = false;
        if (!result) {
          console.log("There was no data from the youtube API");
          if (!$scope.$$phase) $scope.$digest();
          return;
        }
        // compare the first item of the cached feed and the fetched feed
        // return if the feed hasnt changed

        var isUnchanged =
          WidgetFeed.videos[0] &&
          WidgetFeed.videos[0].id === result.items[0].id;
        if (isUnchanged) {
          if (!$scope.$$phase) $scope.$digest();
          return;
        }

        bookmarks.findAndMarkAll($scope);
        viewedVideos.findAndMarkViewed(result.items);
        WidgetFeed.videos = WidgetFeed.videos.length
          ? WidgetFeed.videos.concat(result.items)
          : result.items;
        // check if there is any duplication; so if there is, we will just depend on the newer data
        WidgetFeed.videos = isThereDuplication(WidgetFeed.videos) ? result.items : WidgetFeed.videos;

        // attach the feed url for diff checking later
        // save or update the cache
        result.rssUrl = WidgetFeed.data.content.rssUrl
          ? WidgetFeed.data.content.rssUrl
          : false;
        var mutatedResult = JSON.parse(JSON.stringify(result));
        mutatedResult.items = WidgetFeed.videos;
        mutatedResult.forcedCleanupv2 = true; // Used to cleanup all cache from old users, since there was a bug in cache.
        cache.saveCache(mutatedResult);

        WidgetFeed.nextPageToken = result.nextPageToken;
        if (WidgetFeed.videos.length < result.pageInfo.totalResults) {
          WidgetFeed.busy = false;
        }
        if (!$scope.$$phase) $scope.$digest();
      };

      var isThereDuplication = function(data) {
        let thereIsDuplication = false;
        let idsObject = {};
        data.forEach((item) => {
          if (!idsObject[item.id]) {
            idsObject[item.id] = 1;
          } else {
            idsObject[item.id] += 1;
          }
        });
        data.forEach((item) => {
          if (idsObject[item.id] > 1) {
            thereIsDuplication = true;
          }
        });
        return thereIsDuplication;
      };

      var getFeedVideosError = function(err) {
        Buildfire.spinner.hide();
        $rootScope.loading = false;
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
          if (WidgetFeed.data.content.rssUrl !== event.data.content.rssUrl) {
            $rootScope.loading = true;
          }
          if ($rootScope.currentVideo) {
            $rootScope.currentVideo = null;
            buildfire.history.pop();
          }
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

          if (!WidgetFeed.data.content.rssUrl) {
            WidgetFeed.videos = [];
            WidgetFeed.busy = false;
            WidgetFeed.nextPageToken = null;
            $rootScope.loading = false;
            $rootScope.showEmptyState = true;
          } else if (
            !(WidgetFeed.videos.length > 0) &&
            WidgetFeed.data.content.playListID
          ) {
            getFeedVideos(WidgetFeed.data.content.playListID);
          }

          if (
            WidgetFeed.data.content &&
            WidgetFeed.data.content.playListID &&
            WidgetFeed.data.content.playListID !==
              WidgetFeed.masterData.playListId
          ) {
            WidgetFeed.masterData.playListId = WidgetFeed.data.content.playListID;
            WidgetFeed.videos = [];
            WidgetFeed.busy = false;
            WidgetFeed.nextPageToken = null;
            WidgetFeed.loadMore();
          } else if (WidgetFeed.data.content && WidgetFeed.data.content.videoID) {
            Location.goTo("#/video/" + WidgetFeed.data.content.videoID);
          } else if (!WidgetFeed.data.content || (!WidgetFeed.data.content.playListID && !WidgetFeed.data.content.videoID)) {
            $rootScope.showEmptyState = true;
          }
        }
        if (!$scope.$$phase) $scope.$digest();
      };
      DataStore.onUpdate().then(null, null, onUpdateCallback);

      WidgetFeed.loadMore = function() {
        if (WidgetFeed.busy) return;
        WidgetFeed.busy = true;
        if (WidgetFeed.data.content.playListID && WidgetFeed.data.content.playListID !== "1") {
          getFeedVideos(WidgetFeed.data.content.playListID);
        } else {
          if (WidgetFeed.data.content.videoID) Location.goTo("#/video/" + WidgetFeed.data.content.videoID);
          else $rootScope.showEmptyState = true;
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

      WidgetFeed.openDetailsPage = function(video, pushToHistory = true) {
        if (WidgetFeed.screenAnimationInProgress) return;
        WidgetFeed.screenAnimationInProgress = true;

        if (video.snippet && video.snippet.resourceId && video.snippet.resourceId.videoId) {
          video.id = video.snippet.resourceId.videoId;
        }
        VideoCache.setCache({...video, pushToHistory});
      };
      $scope.$watch('$root.currentVideo', function() {
        const video = $rootScope.currentVideo;
        if (!video) return;
        if (video.pushToHistory) {
          buildfire.history.push(WidgetFeed.pluginName, {
            showLabelInTitlebar: true
          });
        }
        $rootScope.loading = false;
        WidgetFeed.screenAnimationInProgress = false;
        viewedVideos.markViewed($scope, video);
        const videoId = (video.snippet && video.snippet.resourceId && video.snippet.resourceId.videoId) ? video.snippet.resourceId.videoId : video.id;
        Location.goTo("#/video/" + videoId);

        setTimeout(() => {
          toggleDeeplinkSkeleton(false);
        }, 300);
      });

  WidgetFeed.getThumbnail = function(video) {
  var isTablet = $rootScope.deviceWidth >= 768;
  const layoutName = WidgetFeed.data.design.itemListLayout;
  const thumbnails = video.snippet.thumbnails;
  const maxres = thumbnails.maxres ? thumbnails.maxres.url : null;
  const standard = thumbnails.standard ? thumbnails.standard.url : null;
  const high = thumbnails.high ? thumbnails.high.url : null;
  const medium = thumbnails.medium ? thumbnails.medium.url : null;

  if (isTablet) {
    return maxres || standard || high || medium;
  }
  if (layoutName === "List_Layout_3") {
    return standard || high || medium;
  }
  return medium;
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
          WidgetFeed.masterData.playListId = WidgetFeed.data.content.playListID;
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
