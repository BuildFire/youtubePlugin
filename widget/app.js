'use strict';

(function (angular, buildfire) {
  angular.module('youtubePluginWidget', ['ngRoute', 'infinite-scroll'])
    .config(['$routeProvider', '$compileProvider', function ($routeProvider, $compileProvider) {

      /**
       * To make href urls safe on mobile
       */
      $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|cdvfile):/);

      $routeProvider
        .when('/', {
          resolve: {
            videoData: ['DataStore', '$q', 'TAG_NAMES', 'CONTENT_TYPE', 'Location', function (DataStore, $q, TAG_NAMES, CONTENT_TYPE, Location) {
              var deferred = $q.defer();
              var success = function (result) {
                  if (result.data && result.data.content) {
                    if (result.data.content.type && result.data.content.type === CONTENT_TYPE.SINGLE_VIDEO && result.data.content.videoID) {
                      Location.goTo("#/video/" + result.data.content.videoID);
                      deferred.resolve();
                    }
                    else if (result.data.content.type && result.data.content.type === CONTENT_TYPE.CHANNEL_FEED && result.data.content.playListID) {
                      Location.goTo("#/feed/" + result.data.content.playListID);
                      deferred.resolve();
                    }
                    else {
                      Location.goTo("#/feed/1");
                      deferred.resolve();
                    }
                  } else {
                    Location.goTo("#/feed/1");
                    deferred.resolve();
                  }
                }
                , error = function (err) {
                  Location.goTo("#/feed/1");
                  deferred.reject();
                };
              DataStore.get(TAG_NAMES.YOUTUBE_INFO).then(success, error);
            }]
          }
        })
        .when('/feed/:playlistId', {
          templateUrl: 'templates/home.html',
          controllerAs: 'WidgetFeed',
          controller: 'WidgetFeedCtrl'
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
        return $sce.trustAsResourceUrl("//www.youtube.com/embed/" + id);
      }
    }])
    .directive("buildFireCarousel", ["$rootScope", function ($rootScope) {
      return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
          $rootScope.$broadcast("Carousel:LOADED");
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
    .run(['Location', '$location', function (Location, $location) {
      buildfire.navigation.onBackButtonClick = function () {
        var reg = /^\/feed/;
        if (!($location.path().match(reg))) {
          Location.goTo('#/');
        }
      };

    }]);
})(window.angular, window.buildfire);
