'use strict';

(function (angular, buildfire) {
  angular.module('youtubePluginContent')
    .provider('Buildfire', [function () {
      var Buildfire = this;
      Buildfire.$get = function () {
        return buildfire
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
        deleteById: function (_id, _tagName) {
          var deferred = $q.defer();
          if (typeof _id == 'undefined') {
            return deferred.reject(new Error({
              code: STATUS_CODE.UNDEFINED_ID,
              message: STATUS_MESSAGES.UNDEFINED_ID
            }));
          }
          Buildfire.datastore.delete(_id, _tagName, function (err, result) {
            if (err) {
              return deferred.reject(err);
            } else if (result) {
              return deferred.resolve(result);
            }
          });
          return deferred.promise;
        }
      }
    }])
    .factory("Utils", [function () {
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
        }
      }
    }]);

})(window.angular, window.buildfire);