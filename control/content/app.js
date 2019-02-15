"use strict";

import "../../../../scripts/angular/angular.min.js";
import "../../../../scripts/angular/angular-route.min.js";
import "../../../../scripts/angular/ui-bootstrap.min.js";
import "./enums";
import "./app.services";
import "./controllers/content.home.controller";
import "../../../../scripts/tinymce/tinymce.min.js";
import "../../../../scripts/tinymce/ui-tinymce.js";

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
