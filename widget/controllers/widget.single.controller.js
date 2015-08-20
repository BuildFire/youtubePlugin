'use strict';

(function (angular) {
    angular.module('youtubePluginWidget')
        .controller('WidgetSingleCtrl', ['$routeParams', 'YoutubeApi', function ($routeParams, YoutubeApi) {
            var WidgetSingle = this;
            WidgetSingle.data = null;

            var getSingleVideoDetails = function (_videoId) {
                var success = function (result) {
                        WidgetSingle.data = result.items && result.items[0];
                        console.info('-------------------Single Video Details data----------------', WidgetSingle.data);
                    }
                    , error = function (err) {
                        console.error('Error In Fetching Single Video Details', err);
                    };
                if (_videoId) {
                    YoutubeApi.getSingleVideoDetails(_videoId).then(success, error);
                } else {
                    console.error('Undefined Video Id Provided');
                }
            };
            if ($routeParams.videoId) {
                getSingleVideoDetails($routeParams.videoId);
            }
        }])
})(window.angular);
