'use strict';

(function (angular) {
    angular.module('youtubePluginContent', ['ngRoute', 'ui.tinymce', 'ui.bootstrap','ui.sortable'])
        //injected ngRoute for routing
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: 'templates/home.html',
                    controllerAs: 'ContentHome',
                    controller: 'ContentHomeCtrl'
                })
                .otherwise('/');
        }])
      .filter('getImageUrl', function () {
        return function (url, width, height, type) {
          if (type == 'resize')
            return buildfire.imageLib.resizeImage(url, {
              width: width,
              height: height
            });
          else
            return buildfire.imageLib.cropImage(url, {
              width: width,
              height: height
            });
        }
      });
})(window.angular);