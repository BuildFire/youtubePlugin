"use strict";

import "../../../../scripts/angular/angular.min.js";
import "../../../../scripts/angular/angular-route.min.js";
import "../../../../scripts/angular/ui-bootstrap.min.js";
import "./enums";
import "app.services.js";
import "controllers/design.home.controller.js";
import "../../../../scripts/tinymce/tinymce.min.js";
import "../../../../scripts/tinymce/ui-tinymce.js";

(function(angular, buildfire) {
  angular
    .module("youtubePluginDesign", ["ngRoute"])
    .config([
      "$routeProvider",
      function($routeProvider) {
        $routeProvider
          .when("/", {
            templateUrl: "templates/home.html",
            controllerAs: "DesignHome",
            controller: "DesignHomeCtrl"
          })
          .otherwise("/");
      }
    ])
    .filter("getImageUrl", function() {
      return function(url, width, height, type) {
        if (url) {
          if (type == "resize")
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
      };
    });
})(window.angular, window.buildfire);
