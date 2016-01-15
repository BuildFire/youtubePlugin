'use strict';

(function (angular, buildfire) {
  angular.module('youtubePluginWidget', ['ngRoute', 'infinite-scroll', 'ngAnimate'])
    .config(['$routeProvider', '$compileProvider', function ($routeProvider, $compileProvider) {

      /**
       * To make href urls safe on mobile
       */
      $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|cdvfile|file):/);


      /**
       *To disable pull don to refresh functionality
       * */

      buildfire.datastore.disableRefresh();

      $routeProvider
        .when('/', {
          template: '<div></div>'
        })
        .when('/video/:videoId', {
          templateUrl: 'templates/Item_Details.html',
          controller: 'WidgetSingleCtrl',
          controllerAs: 'WidgetSingle'

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
    }])
    .filter('returnYoutubeUrl', ['$sce', function ($sce) {
      return function (id) {
        return $sce.trustAsResourceUrl("http://www.youtube.com/embed/" + id + "?enablejsapi");
      }
    }])
    .directive("buildFireCarousel", ["$rootScope", '$timeout', function ($rootScope, $timeout) {
      return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
          $timeout(function () {
            $rootScope.$broadcast("Carousel:LOADED");
          }, 100);
        }
      };
    }])
    .directive("triggerNgRepeatRender", [function () {
      return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
          var a = $(elem).width();
        }
      };
    }])
    .directive("backgroundImage", ['$filter', function ($filter) {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {
          var getImageUrlFilter = $filter("getImageUrl");
          var setBackgroundImage = function (backgroundImage) {
            if (backgroundImage) {
              element.css(
                'background', '#010101 url('
                + getImageUrlFilter(backgroundImage, 342, 770, 'resize')
                + ') repeat fixed top center');
            } else {
              element.css('background', 'none');
            }
          };
          attrs.$observe('backgroundImage', function (newValue) {
            setBackgroundImage(newValue);
          });
        }
      };
    }])
    .directive("loadImage", [function () {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {
          element.attr("src","assets/images/" + attrs.loadImage + ".png");

          var elem = $("<img>");
          elem[0].onload = function () {
            element.attr("src", attrs.finalSrc);
            elem.remove();
          };
          elem.attr("src", attrs.finalSrc);
        }
      };
    }])
    .run(['Location', '$location', '$rootScope', function (Location, $location, $rootScope) {
      buildfire.navigation.onBackButtonClick = function () {
        var reg = /^\/video/;
        if (reg.test($location.path()) && $rootScope.contentType == "Channel Feed") {
          $rootScope.showFeed = true;
          Location.goTo('#/');
        }
        else {
          buildfire.navigation.navigateHome();
        }
      };

    }]);
})(window.angular, window.buildfire);
