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
        .factory("ImageLibrary", ['Buildfire', '$q', 'STATUS_CODE', 'STATUS_MESSAGES', function (Buildfire, $q, STATUS_CODE, STATUS_MESSAGES) {
            return {
                showDialog: function (_options) {
                    var deferred = $q.defer();
                    if (typeof _options == 'undefined') {
                        deferred.reject(new Error({
                            code: STATUS_CODE.UNDEFINED_OPTIONS,
                            message: STATUS_MESSAGES.UNDEFINED_OPTIONS
                        }));
                    }
                    Buildfire.imageLib.showDialog(_options, function (err, result) {
                        if (err) {
                            return deferred.reject(err);
                        }
                        else if (result) {
                            return deferred.resolve(result);
                        }
                    });
                    return deferred.promise;
                }
            }
        }]);

})(window.angular, window.buildfire);