'use strict';
(function (angular, buildfire) {
  angular
    .module('youtubePluginDesign', ['ngRoute'])
      .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/', {
              templateUrl: 'templates/home.html',
              controllerAs: 'DesignHome',
              controller: 'DesignHomeCtrl'
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
})(window.angular, window.buildfire);
