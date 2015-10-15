'use strict';

(function (angular, buildfire) {
  angular.module('youtubePluginWidget')
    .provider('Buildfire', [function () {
      var Buildfire = this;
      Buildfire.$get = function () {
        return buildfire
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
        getById: function (_id, _tagName) {
          var deferred = $q.defer();
          if (typeof _id == 'undefined') {
            return deferred.reject(new Error({
              code: STATUS_CODE.UNDEFINED_ID,
              message: STATUS_MESSAGES.UNDEFINED_ID
            }));
          }
          Buildfire.datastore.get(_tagName, function (err, result) {
            if (err) {
              return deferred.reject(err);
            } else if (result) {
              return deferred.resolve(result);
            }
          });
          return deferred.promise;
        },
        insert: function (_item, _tagName) {
          var deferred = $q.defer();
          if (typeof _item == 'undefined') {
            return deferred.reject(new Error({
              code: STATUS_CODE.UNDEFINED_DATA,
              message: STATUS_MESSAGES.UNDEFINED_DATA
            }));
          }
          if (Array.isArray(_item)) {
            return deferred.reject(new Error({
              code: STATUS_CODE.ITEM_ARRAY_FOUND,
              message: STATUS_MESSAGES.ITEM_ARRAY_FOUND
            }));
          } else {
            Buildfire.datastore.insert(_item, _tagName, false, function (err, result) {
              if (err) {
                return deferred.reject(err);
              } else if (result) {
                return deferred.resolve(result);
              }
            });
          }
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
        save: function (_item, _tagName) {
          var deferred = $q.defer();
          if (typeof _item == 'undefined') {
            return deferred.reject(new Error({
              code: STATUS_CODE.UNDEFINED_DATA,
              message: STATUS_MESSAGES.UNDEFINED_DATA
            }));
          }
          Buildfire.datastore.save(_item, _tagName, function (err, result) {
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
      }
    }])
    .factory('YoutubeApi', ['YOUTUBE_KEYS', '$q', '$http', 'STATUS_CODE', 'STATUS_MESSAGES', 'VIDEO_COUNT', function (YOUTUBE_KEYS, $q, $http, STATUS_CODE, STATUS_MESSAGES, VIDEO_COUNT) {
      var getSingleVideoDetails = function (videoId) {
        var deferred = $q.defer();
        var _url = '';
        if (!videoId) {
          deferred.reject(new Error({
            code: STATUS_CODE.UNDEFINED_VIDEO_ID,
            message: STATUS_MESSAGES.UNDEFINED_VIDEO_ID
          }));
        } else {
          _url = 'https://www.googleapis.com/youtube/v3/videos?part=snippet&id=' + videoId + '&key=' + YOUTUBE_KEYS.API_KEY;
          $http.get(_url).then(function (response) {
            // this callback will be called asynchronously
            // when the response is available
            deferred.resolve(response.data);
          }, function (error) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
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
          if (pageToken)
            _url = "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=" + countLimit + "&pageToken=" + pageToken + "&playlistId=" + playlistId + "&key=" + YOUTUBE_KEYS.API_KEY;
          else
            _url = "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=" + countLimit + "&playlistId=" + playlistId + "&key=" + YOUTUBE_KEYS.API_KEY;
        }
        /*$http.get(_url).then(function (response) {
         // this callback will be called asynchronously
         // when the response is available
         deferred.resolve(response);
         }, function (error) {
         // called asynchronously if an error occurs
         // or server returns response with an error status.
         deferred.reject(error);
         });*/
        alert("******" + _url);
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
          alert("&&&&&&&&&&&&&&&&&&&&&");
          if (xhr.readyState == 4) {
            alert(xhr.responseText+ ">>>>>>>>>>>>>>" + xhr.statusText);
            deferred.resolve(xhr.responseText);
          }
        };
        xhr.open('GET', _url, true);
        xhr.send(null);
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
  ;
})(window.angular, window.buildfire);