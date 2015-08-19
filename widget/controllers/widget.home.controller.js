'use strict';

(function (angular) {
    angular.module('youtubePluginWidget')
        .controller('WidgetHomeCtrl', ['DataStore', 'TAG_NAMES', 'STATUS_CODE', function (DataStore, TAG_NAMES, STATUS_CODE) {
            var WidgetHome = this;
            WidgetHome.data = null;
            /*
             * Fetch users's data from datastore
             */
            var init = function () {
                var success = function (result) {
                        WidgetHome.data = result.data;
                        console.info('WidgetHomeCtrl success result:----------:::::::::', WidgetHome.data );
                    }
                    , error = function (err) {
                        if (err && err.code !== STATUS_CODE.NOT_FOUND) {
                            console.error('Error while getting data', err);
                        }
                    };
                DataStore.get(TAG_NAMES.YOUTUBE_INFO).then(success, error);
            };
            init();
        }])
})(window.angular);
