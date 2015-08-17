'use strict';

(function (angular, window) {
    angular
        .module('youtubePluginDesign')
        .controller('DesignHomeCtrl', ['$scope', 'DataStore', 'ImageLibrary', 'TAG_NAMES', 'CONTENT_TYPE',
            function ($scope, DataStore, ImageLibrary, TAG_NAMES, CONTENT_TYPE) {

                var DesignHome = this;
                DesignHome.masterData = null;
                DesignHome.layouts = {
                    listLayouts: [
                        {name: "List_Layout_1"},
                        {name: "List_Layout_2"},
                        {name: "List_Layout_3"},
                        {name: "List_Layout_4"}
                    ],
                    itemLayouts: [
                        {name: "Item-Layout-1"}
                    ]
                };
                var _data = {
                    "content": {
                        "images": [],
                        "description": '<p><br data-mce-bogus="1"></p>',
                        "rssUrl": "",
                        "type": CONTENT_TYPE.SINGLE_VIDEO
                    },
                    "design": {
                        "itemListLayout": DesignHome.layouts.listLayouts[0].name,
                        "itemListBgImage": "",
                        "itemDetailsBgImage": ""
                    }
                };
                DesignHome.data = angular.copy(_data);

                updateMasterItem(_data);

                function updateMasterItem(data) {
                    DesignHome.masterData = angular.copy(data);
                }

                function resetItem() {
                    DesignHome.data = angular.copy(DesignHome.masterData);
                }

                function isUnchanged(data) {
                    return angular.equals(data, DesignHome.masterData);
                }

                var init = function () {
                    var success = function (result) {
                            DesignHome.data = result.data;
                            if (DesignHome.data && !DesignHome.data.design) {
                                DesignHome.data.design = {};
                            }
                            if (DesignHome.data && DesignHome.data.design && !DesignHome.data.design.itemListLayout) {
                                DesignHome.data.design.itemListLayout = DesignHome.layouts.listLayouts[0].name;
                            }
                            updateMasterItem(DesignHome.data);
                            if (tmrDelay)clearTimeout(tmrDelay);
                        }
                        , error = function (err) {
                            console.error('Error while getting data', err);
                            if (tmrDelay)clearTimeout(tmrDelay);
                        };
                    DataStore.get(TAG_NAMES.YOUTUBE_INFO).then(success, error);
                };
                init();

                DesignHome.changeListLayout = function (layoutName) {
                    DesignHome.data.design.itemListLayout = layoutName;
                    if (tmrDelay)clearTimeout(tmrDelay);
                };

                DesignHome.addItemDetailsBackgroundImage = function () {
                    var options = {showIcons: false, multiSelection: false};
                    var success = function (result) {
                            DesignHome.data.design.itemDetailsBgImage = result.selectedFiles && result.selectedFiles[0] || null;
                            if (tmrDelay)clearTimeout(tmrDelay);
                        }
                        , error = function (err) {
                            console.error('Error while selecting item details background image from ImageLibrary', err);
                            if (tmrDelay)clearTimeout(tmrDelay);
                        };
                    ImageLibrary.showDialog(options).then(success, error);
                };

                DesignHome.removeItemDetailsBackgroundImage = function () {
                    DesignHome.data.design.itemDetailsBgImage = null;
                };


                DesignHome.addItemListBackgroundImage = function () {
                    var options = {showIcons: false, multiSelection: false};
                    var success = function (result) {
                            DesignHome.data.design.itemListBgImage = result.selectedFiles && result.selectedFiles[0] || null;
                            if (tmrDelay)clearTimeout(tmrDelay);
                        }
                        , error = function (err) {
                            console.error('Error while selecting item list background image from ImageLibrary', err);
                            if (tmrDelay)clearTimeout(tmrDelay);
                        };
                    ImageLibrary.showDialog(options).then(success, error);
                };


                DesignHome.removeItemListBackgroundImage = function () {
                    DesignHome.data.design.itemListBgImage = null;
                };

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
                            saveData(JSON.parse(angular.toJson(newObj)), TAG_NAMES.YOUTUBE_INFO);
                        }, 500);
                    }
                };
                /*
                 * watch for changes in data and trigger the saveDataWithDelay function on change
                 * */
                $scope.$watch(function () {
                    return DesignHome.data;
                }, saveDataWithDelay, true);
            }]);
})(window.angular, window);
