'use strict';

(function(angular, buildfire) {
	angular.module('youtubePluginWidget').controller('WidgetFeedCtrl', ['$scope', 'Buildfire', 'DataStore', 'TAG_NAMES', 'STATUS_CODE', 'YoutubeApi', 'VIDEO_COUNT', '$sce', 'Location', '$rootScope', 'LAYOUTS', 'VideoCache', '$modal',
		function($scope, Buildfire, DataStore, TAG_NAMES, STATUS_CODE, YoutubeApi, VIDEO_COUNT, $sce, Location, $rootScope, LAYOUTS, VideoCache, $modal) {
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
        playListId: ''
      };

      /*declare the device width heights*/
      $rootScope.deviceHeight = window.innerHeight;
      $rootScope.deviceWidth = window.innerWidth || 320;
      WidgetFeed.appHeight = window.innerWidth * (9 / 16);
      console.log($rootScope.deviceWidth);
      console.log($rootScope.deviceHeight);
			/*
			 * Fetch user's data from datastore
			 */
      var initData = function (isRefresh) {
        var success = function (result) {
          WidgetFeed.data = result.data;
          if (!WidgetFeed.data.design) WidgetFeed.data.design = {};
          if (!WidgetFeed.data.content) WidgetFeed.data.content = {};
          if (!WidgetFeed.data.design.itemListLayout) {
            WidgetFeed.data.design.itemListLayout = LAYOUTS.listLayouts[0].name;
          }
          if (WidgetFeed.data.design.itemListBgImage) {
            $rootScope.backgroundListImage = WidgetFeed.data.design.itemListBgImage;
          }
          if (!result.id) {
            WidgetFeed.data.content.playListID = TAG_NAMES.DEFAULT_FEED_ID;
          }
          if (WidgetFeed.data.content.type) $rootScope.contentType = WidgetFeed.data.content.type;
          currentListLayout = WidgetFeed.data.design.itemListLayout;
          if (WidgetFeed.data.content && WidgetFeed.data.content.playListID) {
            currentPlayListId = WidgetFeed.data.content.playListID;
            WidgetFeed.masterData.playListId = currentPlayListId;
          }
          if (WidgetFeed.data.content && WidgetFeed.data.content.videoID) {
            console.log('single video detected');
            Location.goTo('#/video/' + WidgetFeed.data.content.videoID);
          }
          if (!$scope.$$phase) $scope.$digest();
          if (isRefresh) {
            if (currentListLayout != WidgetFeed.data.design.itemListLayout && view && WidgetFeed.data.content.carouselImages) {
              if (WidgetFeed.data.content.carouselImages.length) view._destroySlider();
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
          error = function (err) {
            if (err && err.code !== STATUS_CODE.NOT_FOUND) {
              console.error('Error while getting data', err);
            }
          };
        DataStore.get(TAG_NAMES.YOUTUBE_INFO).then(success, error);
      };
      var init = function (isRefresh) {
        viewedVideos.init();
        initData(isRefresh);
      };

      init();
      $rootScope.$on('Carousel:LOADED', function () {
        WidgetFeed.view = null;
        if (!WidgetFeed.view) {
          WidgetFeed.view = new Buildfire.components.carousel.view('#carousel', [], 'WideScreen');
          const css = `
              min-height: ${window.innerWidth * 0.5625}px !important;
              position: relative;
              top: 0px;
              left: 0px;
              display: block;
            `;
          setTimeout(() => {
            document.getElementById('carousel').setAttribute('style', css);
          }, 50);
        }
        if (WidgetFeed.data.content && WidgetFeed.data.content.carouselImages) {
          WidgetFeed.view.loadItems(WidgetFeed.data.content.carouselImages, null, 'WideScreen');
        } else {
          WidgetFeed.view.loadItems([]);
        }
      });

      buildfire.auth.onLogin(user => {
        init(true);
      });

      buildfire.auth.onLogout(err => {
        console.log(err);
        init(true);
      });

      var getFeedVideos = function (_playlistId) {
        Buildfire.spinner.show();
        var success = function (result) {
          Buildfire.spinner.hide();
          bookmarks.findAndMarkAll($scope);
          viewedVideos.findAndMarkViewed(result.items);

          WidgetFeed.videos = WidgetFeed.videos.length ? WidgetFeed.videos.concat(result.items) : result.items;
          WidgetFeed.nextPageToken = result.nextPageToken;
          if (WidgetFeed.videos.length < result.pageInfo.totalResults) {
            WidgetFeed.busy = false;
          }
          if (!$scope.$$phase) $scope.$digest();
        },
          error = function (err) {
            Buildfire.spinner.hide();
            console.error('Error In Fetching feed Videos', err);
          };
        YoutubeApi.getFeedVideos(_playlistId, VIDEO_COUNT.LIMIT, WidgetFeed.nextPageToken).then(success, error);
      };

      var onUpdateCallback = function (event) {
        if (event && event.tag === TAG_NAMES.YOUTUBE_INFO) {
          WidgetFeed.data = event.data;
          if (!WidgetFeed.data.design) WidgetFeed.data.design = {};
          if (!WidgetFeed.data.content) WidgetFeed.data.content = {};
          if (WidgetFeed.data.content.type) $rootScope.contentType = WidgetFeed.data.content.type;
          if (!WidgetFeed.data.design.itemListLayout) {
            WidgetFeed.data.design.itemListLayout = LAYOUTS.listLayouts[0].name;
          }
          if (WidgetFeed.data.design.itemListBgImage) {
            $rootScope.backgroundListImage = WidgetFeed.data.design.itemListBgImage;
          } else {
            $rootScope.backgroundListImage = '';
          }

          if (currentListLayout != WidgetFeed.data.design.itemListLayout && view && WidgetFeed.data.content.carouselImages) {
            if (WidgetFeed.data.content.carouselImages.length) view._destroySlider();
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
          } else if (!(WidgetFeed.videos.length > 0) && WidgetFeed.data.content.playListID) {
            currentPlayListId = WidgetFeed.data.content.playListID;
            getFeedVideos(WidgetFeed.data.content.playListID);
          }
          console.log('+++++++++++++vl5', WidgetFeed.data.content.playListID, WidgetFeed.masterData.playListId);
          if (WidgetFeed.data.content && WidgetFeed.data.content.playListID && WidgetFeed.data.content.playListID !== WidgetFeed.masterData.playListId) {
            currentPlayListId = WidgetFeed.data.content.playListID;
            WidgetFeed.masterData.playListId = currentPlayListId;
            WidgetFeed.videos = [];
            WidgetFeed.busy = false;
            WidgetFeed.nextPageToken = null;
            WidgetFeed.loadMore();
          } else if (WidgetFeed.data.content && WidgetFeed.data.content.videoID) Location.goTo('#/video/' + WidgetFeed.data.content.videoID);
        }
      };
      DataStore.onUpdate().then(null, null, onUpdateCallback);

      WidgetFeed.loadMore = function () {
        if (WidgetFeed.busy) return;
        WidgetFeed.busy = true;
        if (currentPlayListId && currentPlayListId !== '1') {
          getFeedVideos(currentPlayListId);
        } else {
          if (WidgetFeed.data.content.videoID) Location.goTo('#/video/' + WidgetFeed.data.content.videoID);
        }
      };

      WidgetFeed.safeHtml = function (html) {
        if (html) {
          var $html = $('<div />', { html: html });
          $html.find('iframe').each(function (index, element) {
            var src = element.src;
            console.log('element is: ', src, src.indexOf('http'));
            src = src && src.indexOf('file://') != -1 ? src.replace('file://', 'http://') : src;
            element.src = src && src.indexOf('http') != -1 ? src : 'http:' + src;
          });
          return $sce.trustAsHtml($html.html());
        }
      };

      WidgetFeed.showDescription = function (description) {
        var _retVal = false;
        if (description) {
          description = description.trim();
          if (description !== '<p>&nbsp;<br></p>' && description !== '<p><br data-mce-bogus="1"></p>') {
            _retVal = true;
          }
        }
        return _retVal;
      };

      WidgetFeed.view = function (video) {
        viewedVideos.markViewed($scope, video);
      };

      WidgetFeed.openDetailsPage = function (video) {
        setTimeout(() => {
          viewedVideos.markViewed($scope, video);
        }, 500);
        video.id = video.snippet.resourceId.videoId;
        VideoCache.setCache(video);
        Location.goTo('#/video/' + video.snippet.resourceId.videoId);
      };

      WidgetFeed.getThumbnail = function (video) {
        const isTablet = $rootScope.deviceWidth >= 768;
        if (isTablet) {
          return video.snippet.thumbnails.maxres.url;
        } else {
          return video.snippet.thumbnails.medium.url;
        }
      };

      WidgetFeed.bookmark = function ($event, video) {
        $event.stopImmediatePropagation();
        const isBookmarked = video.bookmarked ? true : false;
        if (isBookmarked) {
          bookmarks.delete($scope, video);
        } else {
          bookmarks.add($scope, video);
        }
      };

      WidgetFeed.share = function ($event, video) {
        $event.stopImmediatePropagation();

        const options = {
          subject: video.snippet.title,
          /* currently non-functional params
          // text: video.snippet.description,
          // image: video.snippet.thumbnails.default,
          */
          link: `https://youtu.be/${video.snippet.resourceId.videoId}`
        };

        const callback = err => {
          if (err) {
            console.warn(err);
          }
        };

        buildfire.device.share(options, callback);
      };

      $rootScope.$on('ROUTE_CHANGED', function (e, data) {
        WidgetFeed.data = data;

        if (!WidgetFeed.data.design) {
          WidgetFeed.data.design = {};
        }

        if (!WidgetFeed.data.content) {
          WidgetFeed.data.content = {};
        }

        if (WidgetFeed.masterData.playListId != WidgetFeed.data.content.playListID) {
          WidgetFeed.busy = false;
          WidgetFeed.nextPageToken = null;
          WidgetFeed.videos = [];
          WidgetFeed.masterData.playListId = WidgetFeed.data.content.playListID;
          getFeedVideos(WidgetFeed.data.content.playListID);
        }

        if (WidgetFeed.data.design.itemListBgImage) {
          $rootScope.backgroundListImage = WidgetFeed.data.design.itemListBgImage;
        } else {
          $rootScope.backgroundListImage = '';
        }

        if (!(WidgetFeed.videos.length >= 0) && WidgetFeed.data.content.playlistId) {
          currentPlayListId = WidgetFeed.data.content.playListID;
          WidgetFeed.masterData.playListId = currentPlayListId;
          getFeedVideos(WidgetFeed.data.content.playListID);
        }

        if (currentListLayout != WidgetFeed.data.design.itemListLayout && view && WidgetFeed.data.content.carouselImages) {
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

        buildfire.datastore.onRefresh(function () {
          WidgetFeed.videos = [];
          WidgetFeed.busy = false;
          WidgetFeed.nextPageToken = null;
          initData(true);
        });
      });

      buildfire.datastore.onRefresh(function () {
        WidgetFeed.videos = [];
        WidgetFeed.busy = false;
        WidgetFeed.nextPageToken = null;
        initData(true);
      });

      $scope.$on('$destroy', function () {
        DataStore.clearListener();
      });
		}
	]);
})(window.angular, window.buildfire);
