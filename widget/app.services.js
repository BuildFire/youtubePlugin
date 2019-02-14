'use strict';

(function (angular, buildfire) {
  angular.module('youtubePluginWidget')
    .provider('Buildfire', [function () {
      var Buildfire = this;
      Buildfire.$get = function () {
        return buildfire;
      };
      return Buildfire;
    }])
    .factory("DataStore", ['Buildfire', '$q', 'STATUS_CODE', 'STATUS_MESSAGES', function (Buildfire, $q, STATUS_CODE, STATUS_MESSAGES) {
      var onUpdateListeners = [];
      return {
        get: function (_tagName) {
          var deferred = $q.defer();
          Buildfire.datastore.get(_tagName, function (err, result) {
            if (err) {
              return deferred.reject(err);
            } else if (result) {
              return deferred.resolve(result);
            }
          });
          return deferred.promise;
        },
        update: function (_id, _item, _tagName) {
          var deferred = $q.defer();
          if (typeof _id == 'undefined') {
            return deferred.reject(new Error({
              code: STATUS_CODE.UNDEFINED_ID,
              message: STATUS_MESSAGES.UNDEFINED_ID
            }));
          }
          if (typeof _item == 'undefined') {
            return deferred.reject(new Error({
              code: STATUS_CODE.UNDEFINED_DATA,
              message: STATUS_MESSAGES.UNDEFINED_DATA
            }));
          }
          Buildfire.datastore.update(_id, _item, _tagName, function (err, result) {
            if (err) {
              return deferred.reject(err);
            } else if (result) {
              return deferred.resolve(result);
            }
          });
          return deferred.promise;
        },
        onUpdate: function () {
          var deferred = $q.defer();
          var onUpdateFn = Buildfire.datastore.onUpdate(function (event) {
            if (!event) {
              return deferred.notify(new Error({
                code: STATUS_CODE.UNDEFINED_EVENT,
                message: STATUS_MESSAGES.UNDEFINED_EVENT
              }), true);
            } else {
              return deferred.notify(event);
            }
          });
          onUpdateListeners.push(onUpdateFn);
          return deferred.promise;
        },
        clearListener: function () {
          onUpdateListeners.forEach(function (listner) {
            listner.clear();
          });
          onUpdateListeners = [];
        }
      };
    }])
    .factory('YoutubeApi', ['YOUTUBE_KEYS', '$q', '$http', 'STATUS_CODE', 'STATUS_MESSAGES', 'VIDEO_COUNT', 'PROXY_SERVER',
      function (YOUTUBE_KEYS, $q, $http, STATUS_CODE, STATUS_MESSAGES, VIDEO_COUNT, PROXY_SERVER) {
        var getProxyServerUrl = function () {
          return PROXY_SERVER.secureServerUrl;
        };
        var getSingleVideoDetails = function (videoId) {
          var deferred = $q.defer();
          var _url = '';
          if (!videoId) {
            deferred.reject(new Error({
              code: STATUS_CODE.UNDEFINED_VIDEO_ID,
              message: STATUS_MESSAGES.UNDEFINED_VIDEO_ID
            }));
          } else {
            $http.post(getProxyServerUrl() + '/video', {
              id: videoId
            })
              .success(function (response) {
                if (response.statusCode == 200)
                  deferred.resolve(response.video);
                else
                  deferred.resolve(null);
              })
              .error(function (error) {
                deferred.reject(error);
              });
          }
          return deferred.promise;
        };

        var getFeedVideos = function (playlistId, countLimit, pageToken) {
          var deferred = $q.defer();
          var _url = "";
          if (!countLimit)
            countLimit = VIDEO_COUNT.LIMIT || 8;
          if (!playlistId) {
            deferred.reject(new Error({
              code: STATUS_CODE.UNDEFINED_PLAYLIST_ID,
              message: STATUS_MESSAGES.UNDEFINED_PLAYLIST_ID
            }));
          } else {
            $http.post(getProxyServerUrl() + '/videos', {
              playlistId: playlistId,
              pageToken: pageToken,
              countLimit: countLimit
            })
              .success(function (response) {
                if (response.statusCode == 200)
                  deferred.resolve(response.videos);
                else
                  deferred.resolve(null);
              })
              .error(function (error) {
                deferred.reject(error);
              });
          }
          return deferred.promise;
        };
        return {
          getSingleVideoDetails: getSingleVideoDetails,
          getFeedVideos: getFeedVideos
        };
      }])
    .factory('Location', [function () {
      var _location = window.location;
      return {
        goTo: function (path) {
          _location.href = path;
        }
      };
    }])
    .factory('VideoCache', [function () {
      var video = null;
      return {
        setCache: function (data) {
          video = data;
        },
        getCache: function () {
          return video;
        }
      };
    }])
  ;
})(window.angular, window.buildfire);