"use strict";

var _typeof =
  typeof Symbol === "function" && typeof Symbol.iterator === "symbol"
    ? function(obj) {
        return typeof obj;
      }
    : function(obj) {
        return obj &&
          typeof Symbol === "function" &&
          obj.constructor === Symbol &&
          obj !== Symbol.prototype
          ? "symbol"
          : typeof obj;
      };

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

var viewedVideos = {
  id: "",
  /**
   * If localStorage is not set, initialize viewed videos as an empty array
   */
  init: function init() {
    var _this = this;

    buildfire.auth.getCurrentUser(function(err, user) {
      if (err) throw err;

      _this.id = user ? user._id : "guest";

      let ls_viewedVideos = localStorage.getItem("viewedVideos");

      var viewedItems = ls_viewedVideos ? JSON.parse(ls_viewedVideos) : null;

      var storageInitialized =
        viewedItems &&
        (typeof viewedItems === "undefined"
          ? "undefined"
          : _typeof(viewedItems)) === "object"
          ? true
          : false;

      if (storageInitialized) {
        var userStateInitialized = viewedItems.hasOwnProperty(_this.id);
        if (userStateInitialized) return;
        else viewedItems[_this.id] = [];
      } else {
        viewedItems = _defineProperty({}, _this.id, []);
      }

      localStorage.setItem("viewedVideos", JSON.stringify(viewedItems));
    });
  },

  /**
   * returns the current user's parsed array of viewed videos
   * @returns {Array}
   */
  get: function get() {
    try {
      let ls_viewedVideos = localStorage.getItem("viewedVideos");
      return ls_viewedVideos ? JSON.parse(ls_viewedVideos)[this.id] : [];
    } catch (e) {
      console.warn(e);
      return [];
    }
  },

  /**
   * stringify and set viewed videos to local storage
   * @param {Array} videos
   */
  _set: function _set(videos) {
    try {
      let ls_viewedVideos = localStorage.getItem("viewedVideos");
      if (!ls_viewedVideos) return [];
      var _viewedVideos = JSON.parse(ls_viewedVideos);
      _viewedVideos[this.id] = videos;
      localStorage.setItem("viewedVideos", JSON.stringify(_viewedVideos));
    } catch (e) {
      console.warn(e);
      return [];
    }
  },

  /**
   * pushes a video id to local storage
   * marks video as viewed
   * @param {Object} $scope
   * @param {Object} video
   */
  markViewed: function markViewed($scope, video) {
    if (!$scope || !video) return;
    var viewedItems = this.get();
    var videoId = "";
    if (video.snippet.resourceId) {
      videoId = video.snippet.resourceId.videoId;
    } else {
      videoId = video.id;
    }
    var isViewed = viewedItems.includes(videoId);

    if (isViewed) return;

    viewedItems.push(videoId);
    this._set(viewedItems);

    if ($scope.WidgetFeed) {
      $scope.WidgetFeed.videos.map(function(video) {
        var singleVideoId = "";
        if (video.snippet.resourceId) {
          singleVideoId = video.snippet.resourceId.videoId;
        } else {
          singleVideoId = video.id;
        }
        if (viewedItems.includes(singleVideoId)) {
          video.viewed = true;
        }
      });
      if (!$scope.$$phase) {
        $scope.$digest();
      }
    }
  },

  /**
   * maps through an array of videos
   * marks videos that have been viewed
   * @param {Array} videos
   */
  findAndMarkViewed: function findAndMarkViewed(videos) {
    var _this2 = this;

    if (this.id === "") return;
    if (!videos || videos.length == 0) return;

    return videos.map(function(video) {
      var videoId = "";
      if (video.snippet.resourceId) {
        videoId = video.snippet.resourceId.videoId;
      } else {
        videoId = video.id;
      }
      var isViewed = _this2.get().includes(videoId);
      video.viewed = isViewed ? true : false;
    });
  }
};
