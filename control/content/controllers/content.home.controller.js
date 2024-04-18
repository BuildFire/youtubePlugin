"use strict";

(function(angular) {
  angular.module("youtubePluginContent").controller("ContentHomeCtrl", [
    "$scope",
    "Buildfire",
    "DataStore",
    "TAG_NAMES",
    "STATUS_CODE",
    "CONTENT_TYPE",
    "$modal",
    "$http",
    "YOUTUBE_KEYS",
    "Utils",
    "$timeout",
    "LAYOUTS",
    "$rootScope",
    "PROXY_SERVER",
    "YoutubeApi",
    function(
      $scope,
      Buildfire,
      DataStore,
      TAG_NAMES,
      STATUS_CODE,
      CONTENT_TYPE,
      $modal,
      $http,
      YOUTUBE_KEYS,
      Utils,
      $timeout,
      LAYOUTS,
      $rootScope,
      PROXY_SERVER,
      YoutubeApi
    ) {
      var _data = {
        content: {
          carouselImages: [],
          description: "",
          rssUrl: TAG_NAMES.DEFAULT_FEED_URL,
          type: "",
          playListID: null,
          videoID: null,
          videoThumbnailVersion: null
        },
        design: {
          itemListLayout: LAYOUTS.listLayouts[0].name,
          itemListBgImage: "",
          itemDetailsBgImage: ""
        },
        default: true
      };
      var ContentHome = this;
      ContentHome.masterData = angular.copy(_data);
      ContentHome.CONTENT_TYPE = CONTENT_TYPE;
      //ContentHome.data = angular.copy(_data);
      ContentHome.validLinkSuccess = false;
      ContentHome.validLinkFailure = false;
      ContentHome.contentType = undefined;
      ContentHome.failureMessage = "Error. Please check and try again";

      ContentHome.descriptionWYSIWYGOptions = {
        plugins: "advlist autolink link image lists charmap print preview",
        skin: "lightgray",
        trusted: true,
        theme: "modern"
      };

      // create a new instance of the buildfire carousel editor
      var editor = new Buildfire.components.carousel.editor("#carousel");

      // this method will be called when a new item added to the list
      editor.onAddItems = function(items) {
        if (!ContentHome.data.content.carouselImages)
          ContentHome.data.content.carouselImages = [];
        ContentHome.data.content.carouselImages.push.apply(
          ContentHome.data.content.carouselImages,
          items
        );
        $scope.$digest();
      };
      // this method will be called when an item deleted from the list
      editor.onDeleteItem = function(item, index) {
        ContentHome.data.content.carouselImages.splice(index, 1);
        $scope.$digest();
      };
      // this method will be called when you edit item details
      editor.onItemChange = function(item, index) {
        ContentHome.data.content.carouselImages.splice(index, 1, item);
        $scope.$digest();
      };
      // this method will be called when you change the order of items
      editor.onOrderChange = function(item, oldIndex, newIndex) {
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

      // bind the video data to the scope so it can be used in the search engine
      function setActiveVideoData(options) {
        const { id, title, description, keywords, imageUrl } = options;
        ContentHome.activeVideo = {
          id,
          title,
          description,
          keywords,
          imageUrl,
          data: {
            feed: {
              id,
              title,
              description,
              keywords,
              image_url: imageUrl,
            }
          }
        }
      }

      ContentHome.updateSingleVideo = () => {
        $scope.refreshButtonsLoading = true;
        YoutubeApi.getSingleVideoDetails(ContentHome.data.content.videoID)
          .then((res) => {
            const videoOptions = {
              id: ContentHome.data.content.videoID,
              title: res.snippet.title,
              description: res.snippet.description,
              keywords: res.snippet.tags ? res.snippet.tags.join(',') : "",
              imageUrl: res.snippet.thumbnails.default.url,
            }
            setActiveVideoData(videoOptions);
            ContentHome.indexFeed((err) => {
              $scope.refreshButtonsLoading = false;
              if (!$scope.$$phase) $scope.$digest();
              if (err) {
                buildfire.dialog.toast({
                  message: "Something went wrong, please try again.",
                  type: "danger",
                });
                return console.error(err);
              } else {
                buildfire.dialog.toast({
                  message: "Successfully updated global search.",
                  type: "success",
                });
              }
            });
          }).catch((err) => {
            $scope.refreshButtonsLoading = false;
            if (!$scope.$$phase) $scope.$digest();
            console.error(err);
            buildfire.dialog.toast({
              message: "Something went wrong, please try again.",
              type: "danger",
            });
          });
      }

      /*
       * Go pull any previously saved data
       * */
      var init = function() {
        var success = function(result) {
            console.info("init success result:", result);
            if (Object.keys(result.data).length > 0) {
              ContentHome.data = result.data;
            }
            if (result && !result.id) {
              ContentHome.data = angular.copy(_data);
              ContentHome.rssLink = ContentHome.data.content.rssUrl;
            } else {
              if (!ContentHome.data.content) ContentHome.data.content = {};
              if (ContentHome.data.content.type)
                ContentHome.contentType = ContentHome.data.content.type;
              if (ContentHome.data.content.rssUrl)
                ContentHome.rssLink = ContentHome.data.content.rssUrl;
              if (!ContentHome.data.content.carouselImages)
                editor.loadItems([]);
              else editor.loadItems(ContentHome.data.content.carouselImages);
            }
            updateMasterItem(ContentHome.data);
            if (tmrDelay) clearTimeout(tmrDelay);
          },
          error = function(err) {
            if (err && err.code !== STATUS_CODE.NOT_FOUND) {
              console.error("Error while getting data", err);
              if (tmrDelay) clearTimeout(tmrDelay);
            } else if (err && err.code === STATUS_CODE.NOT_FOUND) {
              saveData(
                JSON.parse(angular.toJson(ContentHome.data)),
                TAG_NAMES.YOUTUBE_INFO
              );
            }
          };
        DataStore.get(TAG_NAMES.YOUTUBE_INFO).then(success, error);
      };
      init();

      /*
       * Call the datastore to save the data object
       */
      var saveData = function(newObj, tag) {
        if (typeof newObj === "undefined") {
          return;
        }
        if (newObj.content.rssUrl && ContentHome.masterData.content.rssUrl !== newObj.content.rssUrl) {
          ContentHome.handleLoaderDialog("Fetching Data", "Fetching data, please wait...", true);
        } else {
          ContentHome.handleLoaderDialog();
        }
        var success = function(result) {
            $scope.refreshButtonsLoading = false;
            if (newObj.content.rssUrl && ContentHome.masterData.content.rssUrl !== newObj.content.rssUrl) {
              ContentHome.handleLoaderDialog("Indexing Data", "Indexing data for search results, please wait...", true);
              ContentHome.indexFeed((err) => {
                ContentHome.handleLoaderDialog();
                if (err) {
                  handleSearchEngineErrors('indexing');
                  return console.error(err);
                }
                ContentHome.validLinkSuccess = true;
                $timeout(() => {
                  ContentHome.validLinkSuccess = false;
                }, 5000);
                updateMasterItem(newObj);
              });
            } else {
              updateMasterItem(newObj);
            }
          },
          error = function(err) {
            $scope.refreshButtonsLoading = false;
            ContentHome.handleLoaderDialog();
            console.error("Error while saving data : ", err);
          };
        DataStore.save(newObj, tag).then(success, error);
      };

      /*
       * create an artificial delay so api isnt called on every character entered
       * */
      var tmrDelay = null;
      var saveDataWithDelay = function(newObj) {
        if (newObj) {
          if (isUnchanged(newObj)) {
            return;
          }
          if (tmrDelay) {
            clearTimeout(tmrDelay);
          }
          tmrDelay = setTimeout(function() {
            if (newObj && newObj.default) {
              if (newObj.content.rssUrl == TAG_NAMES.DEFAULT_FEED_URL) {
                newObj.content.rssUrl = "";
                ContentHome.data.content.rssUrl = "";
                ContentHome.rssLink = ContentHome.data.content.rssUrl;
              }
              delete newObj.default;
            }
            saveData(
              JSON.parse(angular.toJson(newObj)),
              TAG_NAMES.YOUTUBE_INFO
            );
          }, 500);
        }
      };
      /*
       * watch for changes in data and trigger the saveDataWithDelay function on change
       * */
      $scope.$watch(
        function() {
          return ContentHome.data;
        },
        saveDataWithDelay,
        true
      );

      ContentHome.fixChannelIdURL = function(){
        if(ContentHome.rssLink){
          Utils.fixChannelIdURL(ContentHome.rssLink, (err,res)=>{
            if(err) console.error(err);
            if(res) return ContentHome.validateRssLink(res);
            
            return ContentHome.validateRssLink(ContentHome.rssLink);
          });
        };
      };

      // Function to validate youtube rss feed link entered by user.

      ContentHome.validateRssLink = function(youtubeUrl){
        if (!ContentHome.rssLink) return ContentHome.clearData();
        if (ContentHome.rssLink === ContentHome.data.content.rssUrl) return;
        
        ContentHome.handleLoaderDialog("Validating URL", "Validating URL, please wait...", true);

        if(!youtubeUrl && ContentHome.rssLink) return ContentHome.fixChannelIdURL();

        let isChannel = Utils.extractChannelId(youtubeUrl);
        let isVideo = Utils.extractSingleVideoId(youtubeUrl);
        let isPlaylist = Utils.extractPlaylistId(youtubeUrl);
        
        if (isChannel) {
          ContentHome.contentType = CONTENT_TYPE.CHANNEL_FEED;
          ContentHome.detectedType = "Channel";
        } else if (isVideo) {
          ContentHome.contentType = CONTENT_TYPE.SINGLE_VIDEO;
          ContentHome.detectedType = "Single Video";
        } else if (isPlaylist) {
          ContentHome.contentType = CONTENT_TYPE.PLAYLIST_FEED;
          ContentHome.detectedType = "Playlist";
        } else {
          ContentHome.handleLoaderDialog();
          ContentHome.contentType = undefined;
          ContentHome.detectedType = undefined;
          ContentHome.validLinkFailure = true;
          $timeout(() => {
            ContentHome.validLinkFailure = false;
          }, 5000);
          if (!$scope.$$phase) $scope.$apply();
          return;
        }

        switch (ContentHome.contentType) {
          case CONTENT_TYPE.SINGLE_VIDEO:
            var videoID = Utils.extractSingleVideoId(youtubeUrl);
            if (videoID) {
              $http
                .get(
                  "https://www.googleapis.com/youtube/v3/videos?part=snippet&id=" +
                    videoID +
                    "&key=" +
                    YOUTUBE_KEYS.API_KEY,
                  { cache: true }
                )
                .success(function(response) {
                  ContentHome.failureMessage =
                    "Error. Please check and try again";
                  if (response.items && response.items.length) {
                    ContentHome.validLinkFailure = false;
                    if (ContentHome.data.content.playListID || ContentHome.data.content.videoID) {
                      ContentHome.handleLoaderDialog("Deleting Old Data", "Deleting old search data, please wait...", true);
                    }
                    ContentHome.deleteSearchEngineData(ContentHome.data.content, (err) => {
                      if (err) {
                        ContentHome.handleLoaderDialog();
                        handleSearchEngineErrors('updating');
                        return console.error(err);
                      }

                      const videoOptions = {
                        id: response.items[0].id,
                        title: response.items[0].snippet.title,
                        description: response.items[0].snippet.description,
                        keywords: response.items[0].snippet.tags ? response.items[0].snippet.tags.join(',') : "",
                        imageUrl: response.items[0].snippet.thumbnails.default.url,
                      }
                      setActiveVideoData(videoOptions);

                      ContentHome.data.content.rssUrl = ContentHome.rssLink;
                      ContentHome.data.content.type = ContentHome.contentType;
                      ContentHome.data.content.videoID = videoID;
                      ContentHome.data.content.playListID = null;

                      if (!$scope.$$phase) $scope.$apply();
                    });
                  } else {
                    ContentHome.handleLoaderDialog();
                    ContentHome.validLinkFailure = true;
                    $timeout(() => {
                      ContentHome.validLinkFailure = false;
                    }, 5000);
                    ContentHome.validLinkSuccess = false;
                  }
                  if (!$scope.$$phase) $scope.$apply();
                })
                .error(function() {
                  ContentHome.handleLoaderDialog();
                  ContentHome.failureMessage =
                    "Error. Please check and try again";
                  ContentHome.validLinkFailure = true;
                  $timeout(() => {
                    ContentHome.validLinkFailure = false;
                  }, 5000);
                  ContentHome.validLinkSuccess = false;
                  if (!$scope.$$phase) $scope.$apply();
                });
            } else {
              ContentHome.handleLoaderDialog();
              if (Utils.extractChannelId(youtubeUrl)) {
                ContentHome.failureMessage =
                  "Seems like you have entered feed url. Please choose correct option to validate url.";
              }
              ContentHome.validLinkFailure = true;
              $timeout(() => {
                ContentHome.validLinkFailure = false;
                ContentHome.failureMessage =
                  "Error. Please check and try again";
              }, 5000);
              ContentHome.validLinkSuccess = false;
              if (!$scope.$$phase) $scope.$apply();
            }
            break;
          case CONTENT_TYPE.CHANNEL_FEED:
            var feedIdAndType = Utils.extractChannelId(youtubeUrl);
            var feedApiUrl = null;
            if (feedIdAndType) {
              if (feedIdAndType.channel)
                feedApiUrl =
                  "https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=" +
                  feedIdAndType.channel +
                  "&key=" +
                  YOUTUBE_KEYS.API_KEY;
              else if (feedIdAndType.user || feedIdAndType.c)
                feedApiUrl =
                  "https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forUsername=" +
                  (feedIdAndType.user || feedIdAndType.c) +
                  "&key=" +
                  YOUTUBE_KEYS.API_KEY;
              $http
                .get(feedApiUrl, { cache: true })
                .success(function(response) {
                  ContentHome.failureMessage =
                    "Error. Please check and try again";
                  if (response.items && response.items.length) {
                    if (ContentHome.data.content.playListID || ContentHome.data.content.videoID) {
                      ContentHome.handleLoaderDialog("Deleting Old Data", "Deleting old search data, please wait...", true);
                    }
                    ContentHome.deleteSearchEngineData(ContentHome.data.content, (err) => {
                      if (err) {
                        ContentHome.handleLoaderDialog();
                        handleSearchEngineErrors('updating');
                        return console.error(err);
                      }
                      ContentHome.validLinkFailure = false;
                      ContentHome.data.content.rssUrl = ContentHome.rssLink;
                      ContentHome.data.content.type = ContentHome.contentType;
                      ContentHome.data.content.videoID = null;
                      if (
                        response.items[0].contentDetails &&
                        response.items[0].contentDetails.relatedPlaylists &&
                        response.items[0].contentDetails.relatedPlaylists.uploads
                      ) {
                        ContentHome.data.content.playListID = response.items[0].contentDetails.relatedPlaylists.uploads;
                      }

                      if (!$scope.$$phase) $scope.$apply();
                    });
                  } else {
                    ContentHome.handleLoaderDialog();
                    ContentHome.validLinkFailure = true;
                    $timeout(() => {
                      ContentHome.validLinkFailure = false;
                    }, 5000);
                    ContentHome.validLinkSuccess = false;
                  }
                  if (!$scope.$$phase) $scope.$apply();
                })
                .error(function() {
                  ContentHome.handleLoaderDialog();
                  ContentHome.failureMessage =
                    "Error. Please check and try again";
                  ContentHome.validLinkFailure = true;
                  $timeout(() => {
                    ContentHome.validLinkFailure = false;
                  }, 5000);
                  ContentHome.validLinkSuccess = false;
                  if (!$scope.$$phase) $scope.$apply();
                });
            } else {
              ContentHome.handleLoaderDialog();
              if (Utils.extractSingleVideoId(youtubeUrl)) {
                ContentHome.failureMessage =
                  "Seems like you have entered single video url. Please choose correct option to validate url.";
              }
              ContentHome.validLinkFailure = true;
              $timeout(() => {
                ContentHome.validLinkFailure = false;
                ContentHome.failureMessage =
                  "Error. Please check and try again";
              }, 5000);
              ContentHome.validLinkSuccess = false;
              if (!$scope.$$phase) $scope.$apply();
            }
            break;
          case CONTENT_TYPE.PLAYLIST_FEED:
            var playlistId = Utils.extractPlaylistId(youtubeUrl);
            if (playlistId) {
              $http
                .post(PROXY_SERVER.serverUrl + "/videos", {
                  playlistId: playlistId,
                  countLimit: 1
                })
                .success(function(response) {
                  ContentHome.failureMessage =
                    "Error. Please check and try again";
                  if (response && response.videos && response.videos.items) {
                    if (ContentHome.data.content.playListID || ContentHome.data.content.videoID) {
                      ContentHome.handleLoaderDialog("Deleting Old Data", "Deleting old search data, please wait...", true);
                    }
                    ContentHome.deleteSearchEngineData(ContentHome.data.content, (err) => {
                      if (err) {
                        ContentHome.handleLoaderDialog();
                        handleSearchEngineErrors('updating');
                        return console.error(err);
                      }
                      ContentHome.validLinkFailure = false;
                      ContentHome.data.content.rssUrl = ContentHome.rssLink;
                      ContentHome.data.content.type = ContentHome.contentType;
                      ContentHome.data.content.videoID = null;
                      if (response) {
                        ContentHome.data.content.playListID = playlistId;
                      }

                      if (!$scope.$$phase) $scope.$apply();
                    });
                  } else {
                    ContentHome.handleLoaderDialog();
                    ContentHome.validLinkFailure = true;
                    $timeout(() => {
                      ContentHome.validLinkFailure = false;
                    }, 5000);
                    ContentHome.validLinkSuccess = false;
                  }
                  if (!$scope.$$phase) $scope.$apply();
                })
                .error(function() {
                  ContentHome.handleLoaderDialog();
                  ContentHome.failureMessage =
                    "Error. Please check and try again";
                  ContentHome.validLinkFailure = true;
                  $timeout(() => {
                    ContentHome.validLinkFailure = false;
                  }, 5000);
                  ContentHome.validLinkSuccess = false;
                  if (!$scope.$$phase) $scope.$apply();
                });
            } else {
              ContentHome.handleLoaderDialog();
              if (Utils.extractSingleVideoId(youtubeUrl)) {
                ContentHome.failureMessage =
                  "Seems like you have entered single video url. Please choose correct option to validate url.";
              }
              ContentHome.validLinkFailure = true;
              $timeout(() => {
                ContentHome.validLinkFailure = false;
                ContentHome.failureMessage =
                  "Error. Please check and try again";
              }, 5000);
              ContentHome.validLinkSuccess = false;
              if (!$scope.$$phase) $scope.$apply();
            }
        }
      };

      ContentHome.indexFeed = function(callback) {
        if (ContentHome.data.content.playListID) {
          searchEngine.insertFeed(ContentHome.data.content.playListID, (err, res) => {
            if (err) return callback(err);
            callback();
          });
        } else if(ContentHome.activeVideo) {
          searchEngine.insertSingleVideo(ContentHome.activeVideo, (err, res) => {
            ContentHome.activeVideo = null;
            if (err) return callback(err);
            callback();
          });
        }
      }

      ContentHome.deleteSearchEngineData = function(contentData, callback) {
        if (contentData.playListID) {
          searchEngine.deleteFeed((err, res) => {
            if (err && err.errorMessage !== 'Not Found') {
              return callback(err);
            }
            callback();
          });
        } else if (contentData.videoID) {
          searchEngine.deleteSingleVideo(contentData.videoID, (err, res) => {
            if (err && err.errorMessage !== 'Not Found') {
              return callback(err);
            }
            callback();
          });
        } else {
          callback();
        }
      }

      // manage CP loader 
      ContentHome.handleLoaderDialog = function (title, message, show = false) {
        if(show) {
          const showLoaderOptions = {
            hideFooter: true,
            title: title
          }
          if (!ContentHome.cpLoader) { 
            ContentHome.cpLoader = new DialogComponent('cpLoaderDialog');
          }
          
          ContentHome.cpLoader.showDialog(showLoaderOptions, () => {})
          
          if(message){
            ContentHome.cpLoader.container.querySelector('#modalMessage').innerText = message;
          }
        } else if (ContentHome.cpLoader) {
          ContentHome.cpLoader.close();
        }
      }

      ContentHome.updateCachedVideos = function() {
        $scope.refreshButtonsLoading = true;
        ContentHome.data.content.videoThumbnailVersion = Date.now();
      }

      ContentHome.clearData = function() {
        ContentHome.handleLoaderDialog("Deleting Data", "Deleting data, please wait...", true);
        ContentHome.deleteSearchEngineData(ContentHome.data.content, (err) => {
          ContentHome.handleLoaderDialog();
          if (err) {
            handleSearchEngineErrors('deleting');
            return console.error(err);
          }

          ContentHome.contentType = undefined;
          ContentHome.data.content.rssUrl = null;
          ContentHome.data.content.type = ContentHome.contentType;
          ContentHome.data.content.videoID = null;
          ContentHome.data.content.playListID = null;
          if (!$scope.$$phase) $scope.$digest();
        });
      };

      const handleSearchEngineErrors = (errType) => {
        let title = "", message = "";
        switch (errType) {
          case 'indexing':
            title = "Indexing Error";
            message = "Error indexing data. Please try adding the URL again.";
            break;
          case 'deleting':
            title = "Deletion Error";
            message = "Error deleting data. Please try deleting the URL again.";
            break;
          case 'updating':
            title = "Updating Error";
            message = "Error updating data. Please try updating the URL again.";
            break;
          default:
            break;
        }
        buildfire.dialog.alert({ title, message });
      };
    }
  ]);
})(window.angular);
