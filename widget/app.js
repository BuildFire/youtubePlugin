"use strict";

import "../../../../scripts/angular/angular.min.js";
import "../../../../scripts/angular/angular-route.min.js";
import "angular-animate";
import "./enums";
import "./app.services";
import "./modal";
import "./viewedVideos";
import "./viewedVideos";
import "./searchEngine";
import "./bookmarkHandler";
import "./controllers/widget.feed.controller";
import "./controllers/widget.single.controller";
import "./controllers/widget.single.controller";
import "../../../scripts/angular/ng-infinite-scroll.custom.js"; // BuildFire custom library
import "./ytConfig";
import "./callPlayer";

(function(angular, buildfire) {
  angular
    .module("youtubePluginWidget", ["ngRoute", "infinite-scroll", "ngAnimate"])
    .config([
      "$routeProvider",
      "$compileProvider",
      function($routeProvider, $compileProvider) {
        /**
         * To make href urls safe on mobile
         */
        $compileProvider.aHrefSanitizationWhitelist(
          /^\s*(https?|ftp|mailto|chrome-extension|cdvfile|file):/
        );

        $routeProvider
          .when("/", {
            template: "<div></div>"
          })
          .when("/video/:videoId", {
            templateUrl: "templates/Item_Details.html",
            controller: "WidgetSingleCtrl",
            controllerAs: "WidgetSingle"
          })
          .otherwise("/");
      }
    ])
    .filter("getImageUrl", [
      "Buildfire",
      function(Buildfire) {
        filter.$stateful = true;
        function filter(url, width, height, type) {
          var _imgUrl;
          if (!_imgUrl) {
            if (type == "resize") {
              Buildfire.imageLib.local.resizeImage(
                url,
                {
                  width: width,
                  height: height
                },
                function(err, imgUrl) {
                  _imgUrl = imgUrl;
                }
              );
            } else {
              Buildfire.imageLib.local.cropImage(
                url,
                {
                  width: width,
                  height: height
                },
                function(err, imgUrl) {
                  _imgUrl = imgUrl;
                }
              );
            }
          }

          return _imgUrl;
        }
        return filter;
      }
    ])
    .filter("returnYoutubeUrl", [
      "$sce",
      "YoutubeApi",
      function($sce, YoutubeApi) {
        return function(id) {
          var url = "www.youtube.com/embed/" + id + "?enablejsapi=1&autoplay=1";
          url = "https://" + url;
          return $sce.trustAsResourceUrl(url);
        };
      }
    ])
    .directive("buildFireCarousel", [
      "$rootScope",
      "$timeout",
      function($rootScope, $timeout) {
        return {
          restrict: "A",
          link: function(scope, elem, attrs) {
            $timeout(function() {
              $rootScope.$broadcast("Carousel:LOADED");
            }, 100);
          }
        };
      }
    ])
    .directive("triggerNgRepeatRender", [
      function() {
        return {
          restrict: "A",
          link: function(scope, elem, attrs) {
            var a = $(elem).width();
          }
        };
      }
    ])
    .directive("backgroundImage", [
      "$filter",
      function($filter) {
        return {
          restrict: "A",
          link: function(scope, element, attrs) {
            var getImageUrlFilter = $filter("getImageUrl");
            var setBackgroundImage = function(backgroundImage) {
              if (backgroundImage) {
                element.css(
                  "background",
                  "#010101 url(" +
                    getImageUrlFilter(backgroundImage, 342, 770, "resize") +
                    ") repeat fixed top center"
                );
              } else {
                element.css("background", "none");
              }
            };
            attrs.$observe("backgroundImage", function(newValue) {
              setBackgroundImage(newValue);
            });
          }
        };
      }
    ])
    .directive("loadImage", [
      function() {
        return {
          restrict: "A",
          link: function(scope, element, attrs) {
            element.attr(
              "src",
              "../../../styles/media/holder-" + attrs.loadImage + ".gif"
            );

            var elem = $("<img>");
            elem[0].onload = function() {
              element.attr("src", attrs.finalSrc);
              elem.remove();
            };
            elem.attr("src", attrs.finalSrc);
          }
        };
      }
    ])
    .directive("loadIframe", [
      "$rootScope",
      function($rootScope) {
        return {
          restrict: "A",
          link: function(scope, element, attrs) {
            $rootScope.appHeight = window.innerWidth * (9 / 16);
            var iframe = document.createElement("iframe"),
              img = $(element).find("img");
            iframe.onload = function() {
              iframe.classList.remove("ng-hide");
              img.remove();
            }; // before setting 'src'
            iframe.id = "ytPlayer";
            iframe.src = attrs.loadIframe;
            iframe.width = "100%";
            iframe.classList.add("ng-hide");
            iframe.height = $rootScope.appHeight + "px";
            iframe.frameborder = "0";
            iframe.allow = "autoplay";
            $(element).append(iframe);
          }
        };
      }
    ])
    .run([
      "Location",
      "$location",
      "$rootScope",
      function(Location, $location, $rootScope) {
        buildfire.navigation.onBackButtonClick = function() {
          var reg = /^\/video/;
          if (
            reg.test($location.path()) &&
            ($rootScope.contentType == "Channel Feed" ||
              $rootScope.contentType == "Playlist Feed")
          ) {
            $rootScope.showFeed = true;
            Location.goTo("#/");
          } else {
            buildfire.navigation._goBackOne();
          }
        };

        if (buildfire.device) {
          buildfire.device.onAppBackgrounded(function() {
            //pause the video on fone lock
            callPlayer("ytPlayer", "pauseVideo");
          });
        }
      }
    ])
    .filter("cropImage", [
      function() {
        function filter(url, width, height, noDefault) {
          var _imgUrl;
          filter.$stateful = true;
          if (noDefault) {
            if (!url) return "";
          }
          if (!_imgUrl) {
            buildfire.imageLib.local.cropImage(
              url,
              {
                width,
                height
              },
              function(err, imgUrl) {
                _imgUrl = imgUrl;
              }
            );
          }
          return _imgUrl;
        }
        return filter;
      }
    ])
    .directive("backImg", [
      "$rootScope",
      function($rootScope) {
        return function(scope, element, attrs) {
          console.log(scope, element, attrs);
          attrs.$observe("backImg", function(value) {
            var img = "";
            if (value) {
              buildfire.imageLib.local.cropImage(
                value,
                {
                  width: $rootScope.deviceWidth,
                  height: $rootScope.deviceHeight
                },
                function(err, imgUrl) {
                  if (imgUrl) {
                    img = imgUrl;
                    element.attr(
                      "style",
                      "background:url(" +
                        img +
                        ") !important;background-size:cover !important"
                    );
                  } else {
                    img = "";
                    element.attr("style", "background-color:white");
                  }
                  element.css({
                    "background-size": "cover !important"
                  });
                }
              );
              // img = $filter("cropImage")(value, $rootScope.deviceWidth, $rootScope.deviceHeight, true);
            } else {
              img = "";
              element.attr("style", "background-color:white");
              element.css({
                "background-size": "cover !important"
              });
            }
          });
        };
      }
    ]);
})(window.angular, window.buildfire);
