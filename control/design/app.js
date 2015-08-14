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
})(window.angular, window.buildfire);
