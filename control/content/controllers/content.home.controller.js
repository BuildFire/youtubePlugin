'use strict';

(function (angular) {
  angular
    .module('youtubePluginContent')
    .controller('ContentHomeCtrl', ['$scope', 'Buildfire', 'DataStore', 'TAG_NAMES', 'STATUS_CODE', 'CONTENT_TYPE', '$modal', '$http', 'YOUTUBE_KEYS', 'Utils', '$timeout', 'LAYOUTS', '$rootScope',
      function ($scope, Buildfire, DataStore, TAG_NAMES, STATUS_CODE, CONTENT_TYPE, $modal, $http, YOUTUBE_KEYS, Utils, $timeout, LAYOUTS, $rootScope) {
        var _data = {
          "content": {
            "carouselImages": [],
            "description": '',
            "rssUrl": TAG_NAMES.DEFAULT_FEED_URL,
            "type": "",
            "playListID": null,
            "videoID": null
          },
          "design": {
            "itemListLayout": LAYOUTS.listLayouts[0].name,
            "itemListBgImage": "",
            "itemDetailsBgImage": ""
          },
          "default": true
        };
        var ContentHome = this;
        ContentHome.masterData = angular.copy(_data);
        ContentHome.CONTENT_TYPE = CONTENT_TYPE;
        //ContentHome.data = angular.copy(_data);
        ContentHome.validLinkSuccess = false;
        ContentHome.validLinkFailure = false;
        ContentHome.contentType = CONTENT_TYPE.CHANNEL_FEED;
        ContentHome.failureMessage = "Error. Please check and try again";

        ContentHome.descriptionWYSIWYGOptions = {
          plugins: 'advlist autolink link image lists charmap print preview',
          skin: 'lightgray',
          trusted: true,
          theme: 'modern'
        };

        // create a new instance of the buildfire carousel editor
        var editor = new Buildfire.components.carousel.editor("#carousel");

        // this method will be called when a new item added to the list
        editor.onAddItems = function (items) {
          if (!ContentHome.data.content.carouselImages)
            ContentHome.data.content.carouselImages = [];
          ContentHome.data.content.carouselImages.push.apply(ContentHome.data.content.carouselImages, items);
          $scope.$digest();
        };
        // this method will be called when an item deleted from the list
        editor.onDeleteItem = function (item, index) {
          ContentHome.data.content.carouselImages.splice(index, 1);
          $scope.$digest();
        };
        // this method will be called when you edit item details
        editor.onItemChange = function (item, index) {
          ContentHome.data.content.carouselImages.splice(index, 1, item);
          $scope.$digest();
        };
        // this method will be called when you change the order of items
        editor.onOrderChange = function (item, oldIndex, newIndex) {
          var items = ContentHome.data.content.carouselImages;

          var tmp = items[oldIndex];

          if (oldIndex < newIndex) {
            for (var i = oldIndex + 1; i <= newIndex; i++) {
              items[i - 1] = items[i];
            }
          } else {
            for (var i = oldIndex - 1; i >= newIndex; i--) {
              items[i + 1] = items[i];
            }
          }
          items[newIndex] = tmp;

          ContentHome.data.content.carouselImages = items;
          $scope.$digest();
        };

        updateMasterItem(_data);

        function updateMasterItem(data) {
          ContentHome.masterData = angular.copy(data);
        }

        function resetItem() {
          ContentHome.data = angular.copy(ContentHome.masterData);
        }

        function isUnchanged(data) {
          return angular.equals(data, ContentHome.masterData);
        }

        /*
         * Go pull any previously saved data
         * */
        var init = function () {
          var success = function (result) {
              console.info('init success result:', result);
              if (Object.keys(result.data).length > 0) {
                ContentHome.data = result.data;
              }
              if (result && !result.id) {
                ContentHome.data = angular.copy(_data);
                ContentHome.rssLink = ContentHome.data.content.rssUrl;
              } else {
                if (!ContentHome.data.content)
                  ContentHome.data.content = {};
                if (ContentHome.data.content.type)
                  ContentHome.contentType = ContentHome.data.content.type;
                if (ContentHome.data.content.rssUrl)
                  ContentHome.rssLink = ContentHome.data.content.rssUrl;
                if (!ContentHome.data.content.carouselImages)
                  editor.loadItems([]);
                else
                  editor.loadItems(ContentHome.data.content.carouselImages);
              }
              updateMasterItem(ContentHome.data);
              if (tmrDelay)clearTimeout(tmrDelay);
            }
            , error = function (err) {
              if (err && err.code !== STATUS_CODE.NOT_FOUND) {
                console.error('Error while getting data', err);
                if (tmrDelay)clearTimeout(tmrDelay);
              }
              else if (err && err.code === STATUS_CODE.NOT_FOUND) {
                saveData(JSON.parse(angular.toJson(ContentHome.data)), TAG_NAMES.YOUTUBE_INFO);
              }
            };
          DataStore.get(TAG_NAMES.YOUTUBE_INFO).then(success, error);
        };
        init();

        /*
         * Call the datastore to save the data object
         */
        var saveData = function (newObj, tag) {
          if (typeof newObj === 'undefined') {
            return;
          }
          var success = function (result) {
              console.info('Saved data result: ', result);
              updateMasterItem(newObj);
            }
            , error = function (err) {
              console.error('Error while saving data : ', err);
            };
          DataStore.save(newObj, tag).then(success, error);
        };

        /*
         * create an artificial delay so api isnt called on every character entered
         * */
        var tmrDelay = null;
        var saveDataWithDelay = function (newObj) {
          if (newObj) {
            if (isUnchanged(newObj)) {
              return;
            }
            if (tmrDelay) {
              clearTimeout(tmrDelay);
            }
            tmrDelay = setTimeout(function () {
              if(newObj && newObj.default) {
                  if(newObj.content.rssUrl == TAG_NAMES.DEFAULT_FEED_URL) {
                      newObj.content.rssUrl = '';
                      ContentHome.data.content.rssUrl = '';
                      ContentHome.rssLink = ContentHome.data.content.rssUrl;
                  }
                  delete newObj.default;
              }
              saveData(JSON.parse(angular.toJson(newObj)), TAG_NAMES.YOUTUBE_INFO);
            }, 500);
          }
        };
        /*
         * watch for changes in data and trigger the saveDataWithDelay function on change
         * */
        $scope.$watch(function () {
          return ContentHome.data;
        }, saveDataWithDelay, true);

        // Function to validate youtube rss feed link entered by user.

        ContentHome.validateRssLink = function () {
          console.log(ContentHome.contentType);
          switch (ContentHome.contentType) {
            case CONTENT_TYPE.SINGLE_VIDEO :
              var videoID = Utils.extractSingleVideoId(ContentHome.rssLink);
              if (videoID) {
                $http.get("https://www.googleapis.com/youtube/v3/videos?part=snippet&id=" + videoID + "&key=" + YOUTUBE_KEYS.API_KEY)
                  .success(function (response) {
                    console.log(response);
                    ContentHome.failureMessage = "Error. Please check and try again";
                    if (response.items && response.items.length) {
                      ContentHome.validLinkSuccess = true;
                      $timeout(function () {
                        ContentHome.validLinkSuccess = false;
                      }, 5000);
                      ContentHome.validLinkFailure = false;
                      ContentHome.data.content.rssUrl = ContentHome.rssLink;
                      ContentHome.data.content.type = ContentHome.contentType;
                      ContentHome.data.content.videoID = videoID;
                      ContentHome.data.content.playListID = null;
                    }
                    else {
                      ContentHome.validLinkFailure = true;
                      $timeout(function () {
                        ContentHome.validLinkFailure = false;
                      }, 5000);
                      ContentHome.validLinkSuccess = false;
                    }
                  })
                  .error(function () {
                    ContentHome.failureMessage = "Error. Please check and try again";
                    ContentHome.validLinkFailure = true;
                    $timeout(function () {
                      ContentHome.validLinkFailure = false;
                    }, 5000);
                    ContentHome.validLinkSuccess = false;
                  });
              }
              else {
                if (Utils.extractChannelId(ContentHome.rssLink)) {
                  ContentHome.failureMessage = "Seems like you have entered feed url. Please choose correct option to validate url."
                }
                ContentHome.validLinkFailure = true;
                $timeout(function () {
                  ContentHome.validLinkFailure = false;
                  ContentHome.failureMessage = "Error. Please check and try again";
                }, 5000);
                ContentHome.validLinkSuccess = false;
              }
              break;
            case CONTENT_TYPE.CHANNEL_FEED :
              var feedIdAndType = Utils.extractChannelId(ContentHome.rssLink);
              var feedApiUrl = null;
              console.log(feedIdAndType);
              if (feedIdAndType) {
                if (feedIdAndType.channel)
                  feedApiUrl = "https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=" + feedIdAndType.channel + "&key=" + YOUTUBE_KEYS.API_KEY;
                else if (feedIdAndType.user || feedIdAndType.c)
                  feedApiUrl = "https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forUsername=" + (feedIdAndType.user || feedIdAndType.c) + "&key=" + YOUTUBE_KEYS.API_KEY;
                $http.get(feedApiUrl)
                  .success(function (response) {
                    console.log(response);
                    ContentHome.failureMessage = "Error. Please check and try again";
                    if (response.items && response.items.length) {
                      ContentHome.validLinkSuccess = true;
                      $timeout(function () {
                        ContentHome.validLinkSuccess = false;
                      }, 5000);
                      ContentHome.validLinkFailure = false;
                      ContentHome.data.content.rssUrl = ContentHome.rssLink;
                      ContentHome.data.content.type = ContentHome.contentType;
                      if (response.items[0].contentDetails && response.items[0].contentDetails.relatedPlaylists && response.items[0].contentDetails.relatedPlaylists.uploads)
                        ContentHome.data.content.playListID = response.items[0].contentDetails.relatedPlaylists.uploads;
                      ContentHome.data.content.videoID = null;
                    }
                    else {
                      ContentHome.validLinkFailure = true;
                      $timeout(function () {
                        ContentHome.validLinkFailure = false;
                      }, 5000);
                      ContentHome.validLinkSuccess = false;
                    }
                  })
                  .error(function () {
                    ContentHome.failureMessage = "Error. Please check and try again";
                    ContentHome.validLinkFailure = true;
                    $timeout(function () {
                      ContentHome.validLinkFailure = false;
                    }, 5000);
                    ContentHome.validLinkSuccess = false;
                  });
              }
              else {
                if (Utils.extractSingleVideoId(ContentHome.rssLink)) {
                  ContentHome.failureMessage = "Seems like you have entered single video url. Please choose correct option to validate url."
                }
                ContentHome.validLinkFailure = true;
                $timeout(function () {
                  ContentHome.validLinkFailure = false;
                  ContentHome.failureMessage = "Error. Please check and try again";
                }, 5000);
                ContentHome.validLinkSuccess = false;
              }
          }
        };

        ContentHome.clearData = function () {
          if (!ContentHome.rssLink) {
            ContentHome.contentType = ContentHome.CONTENT_TYPE.CHANNEL_FEED;
            ContentHome.data.content.rssUrl = null;
            ContentHome.data.content.type = ContentHome.contentType;
            ContentHome.data.content.videoID = null;
            ContentHome.data.content.playListID = null;
          }
        };
      }]);
})(window.angular);
