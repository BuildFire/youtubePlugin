"use strict";

(function(angular) {
  angular
    .module("youtubePluginContent", ["ngRoute", "ui.tinymce", "ui.bootstrap"])
    //injected ngRoute for routing
    .config([
      "$routeProvider",
      function($routeProvider) {
        $routeProvider
          .when("/", {
            templateUrl: function(params) {
              debugger;
              return "templates/home.html";
            },
            controllerAs: "ContentHome",
            controller: "ContentHomeCtrl"
          })
          .otherwise("/");
      }
    ])
    .filter("getImageUrl", [
      "Buildfire",
      function(Buildfire) {
        return function(url, width, height, type) {
          if (type == "resize")
            return Buildfire.imageLib.resizeImage(url, {
              width: width,
              height: height
            });
          else
            return Buildfire.imageLib.cropImage(url, {
              width: width,
              height: height
            });
        };
      }
    ]);
})(window.angular);
