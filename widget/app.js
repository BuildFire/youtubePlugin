'use strict';

(function (angular) {
    angular.module('youtubePluginWidget', ['ngRoute'])
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: 'templates/home.html',
                    controllerAs: 'WidgetHome',
                    controller: 'WidgetHomeCtrl'
                })
                .otherwise('/');
        }])
        .filter('getImageUrl', ['Buildfire', function (Buildfire) {
            return function (url, width, height, type) {
                if (type == 'resize')
                    return Buildfire.imageLib.resizeImage(url, {
                        width: width,
                        height: height
                    });
                else
                    return Buildfire.imageLib.cropImage(url, {
                        width: width,
                        height: height
                    });
            }
        }]);
})(window.angular);
