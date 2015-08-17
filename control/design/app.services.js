'use strict';

(function (angular, buildfire) {
    angular.module('youtubePluginDesign')
        .provider('Buildfire', [function () {
            var Buildfire = this;
            Buildfire.$get = function () {
                return buildfire
            };
            return Buildfire;
        }])
        .factory("DataStore", ['Buildfire', '$q', 'STATUS_CODE', 'STATUS_MESSAGES', function (Buildfire, $q, STATUS_CODE, STATUS_MESSAGES) {
            var deferred = $q.defer();
            var callback = function (err, result) {
                if (err) {
                    return deferred.reject(err);
                }
                else if (result) {
                    return deferred.resolve(result);
                }
            };
            return {
                get: function (_tagName) {
                    Buildfire.datastore.get(_tagName, callback);
                    return deferred.promise;
                },
                getById: function (_id, _tagName) {
                    if (typeof _id == 'undefined') {
                        return deferred.reject(new Error({
                            code: STATUS_CODE.UNDEFINED_ID,
                            message: STATUS_MESSAGES.UNDEFINED_ID
                        }));
                    }
                    Buildfire.datastore.get(_tagName, callback);
                    return deferred.promise;
                },
                insert: function (_items, _tagName) {
                    if (typeof _items == 'undefined') {
                        return deferred.reject(new Error({
                            code: STATUS_CODE.UNDEFINED_DATA,
                            message: STATUS_MESSAGES.UNDEFINED_DATA
                        }));
                    }
                    if (Array.isArray(items)) {
                        Buildfire.datastore.bulkInsert(_items, _tagName, callback);
                    } else {
                        Buildfire.datastore.insert(_items, _tagName, false, callback);
                    }
                    return deferred.promise;
                },
                search: function (_options, _tagName) {
                    if (typeof _options == 'undefined') {
                        return deferred.reject(new Error({
                            code: STATUS_CODE.UNDEFINED_OPTIONS,
                            message: STATUS_MESSAGES.UNDEFINED_OPTIONS
                        }));
                    }
                    Buildfire.datastore.search(_options, _tagName, callback);
                    return deferred.promise;
                },
                update: function (_id, _item, _tagName) {
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
                    Buildfire.datastore.update(_id, _item, _tagName, callback);
                    return deferred.promise;
                },
                save: function (_item, _tagName) {
                    if (typeof _item == 'undefined') {
                        return deferred.reject(new Error({
                            code: STATUS_CODE.UNDEFINED_DATA,
                            message: STATUS_MESSAGES.UNDEFINED_DATA
                        }));
                    }
                    Buildfire.datastore.save(_item, _tagName, callback);
                    return deferred.promise;
                },
                deleteById: function (_id, _tagName) {
                    if (typeof _id == 'undefined') {
                        return deferred.reject(new Error({
                            code: STATUS_CODE.UNDEFINED_ID,
                            message: STATUS_MESSAGES.UNDEFINED_ID
                        }));
                    }
                    Buildfire.datastore.delete(_id, _tagName, callback);
                    return deferred.promise;
                }
            }
        }]);

})(window.angular, window.buildfire);