'use strict';

(function (angular, buildfire) {
  angular.module('youtubePluginContent')
    .provider('Buildfire', [function () {
      var Buildfire = this;
      Buildfire.$get = function () {
        return buildfire;
      };
      return Buildfire;
    }])
    .factory("DataStore", ['Buildfire', '$q', 'STATUS_CODE', 'STATUS_MESSAGES', function (Buildfire, $q, STATUS_CODE, STATUS_MESSAGES) {
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
        }
      };
    }])
    .factory("Utils", ["$http", "YOUTUBE_KEYS", function ($http, YOUTUBE_KEYS) {
      return {
        extractSingleVideoId: function (url) {
          var regExp = /^https?:\/\/(?:www\.)?youtube\.com\/watch\?(?=.*v=((\w|-){11}))(?:\S+)?$/;
          var match = url.match(regExp);
          if (match && match[1] && match[1].length == 11) {
            return match[1];
          } else {
            return null;
          }
        },
        fixChannelIdURL: function (url, callback){
          let isChannel = this.extractChannelId(url);
          let isSingle = this.extractSingleVideoId(url);
          let isPlaylist = this.extractPlaylistId(url);
          if(isChannel || isSingle || isPlaylist) return callback(null, url);
          
          let regex = /((http|https):\/\/|)(www\.)?youtube\.com\/([a-zA-Z0-9_\-@]{1,})/;
          let res = url.match(regex);
          if (res && res.length > 2 && res[4]) {
            $http.get("https://youtube.googleapis.com/youtube/v3/search?part=snippet&q="+res[4]+"&type=channel&key=" + YOUTUBE_KEYS.API_KEY, { cache: true })
            .success(function (response) {
              if(response.items[0] && response.items[0].id && response.items[0].id.channelId){
                callback(null, "https://www.youtube.com/channel/"+response.items[0].id.channelId);
              }else {
                callback(null, url);
              }
            }).error(function (error) {
              callback(error);
            });
          }else{
            callback(null, url);
          }
        },
        extractChannelId: function (url) {
          var regex = /((http|https):\/\/|)(www\.)?youtube\.com\/(channel|user|c)\/([a-zA-Z0-9_\-]{1,})/;
          var res = url.match(regex);
          var _obj = {};
          if (res && res.length) {
            var id = res.pop();
            var type = res.pop();
            _obj[type] = id;
            return _obj;
          }
          else
            return null;
        },
        extractPlaylistId: function (url) {
          var regex = /((http|https):\/\/|)(www\.)?youtube\.com\/playlist\?list=([a-zA-Z0-9_\-]+)/;
          var res = url.match(regex);
          if (res && res.length && res[4])
            return res[4];
          else return false;
        }
      };
    }]);
})(window.angular, window.buildfire);