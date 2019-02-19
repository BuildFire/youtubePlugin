"use strict";

var bookmarks = {
  add: function add($scope, video) {
    if (!$scope || !video) return;
    var id = "";
    if (video.snippet.resourceId) {
      id = video.snippet.resourceId.videoId;
    } else {
      id = video.id;
    }
    var options = {
      id: id,
      title: video.snippet.title,
      payload: { link: id },
      icon: video.snippet.thumbnails.default.url
    };
    var callback = function callback(err, data) {
      if (err) throw err;
      if ($scope.WidgetFeed) {
        $scope.WidgetFeed.videos.map(function(v) {
          var isBookmarked =
            v.snippet.resourceId.videoId === video.snippet.resourceId.videoId;
          if (isBookmarked) {
            v.bookmarked = true;
          }
        });
      } else if ($scope.WidgetSingle) {
        $scope.WidgetSingle.video.bookmarked = true;
      }
      if (!$scope.$$phase) {
        $scope.$apply();
      }
    };
    buildfire.bookmarks ? buildfire.bookmarks.add(options, callback) : null;
  },
  delete: function _delete($scope, video) {
    if (!$scope || !video) return;
    var id = "";
    if (video.snippet.resourceId) {
      id = video.snippet.resourceId.videoId;
    } else {
      id = video.id;
    }
    var callback = function callback() {
      if ($scope.WidgetFeed) {
        $scope.WidgetFeed.videos.map(function(v) {
          var isBookmarked =
            v.snippet.resourceId.videoId === video.snippet.resourceId.videoId;
          if (isBookmarked) {
            v.bookmarked = false;
          }
        });
      } else if ($scope.WidgetSingle) {
        $scope.WidgetSingle.video.bookmarked = false;
      }
      if (!$scope.$$phase) {
        $scope.$apply();
      }
    };
    buildfire.bookmarks ? buildfire.bookmarks.delete(id, callback) : null;
  },
  _getAll: function _getAll(callback) {
    var cb = function cb(err, bookmarks) {
      if (err) throw err;
      callback(bookmarks);
    };
    buildfire.bookmarks ? buildfire.bookmarks.getAll(cb) : cb(null, []);
  },
  findAndMarkAll: function findAndMarkAll($scope) {
    if (!$scope) return;
    this._getAll(function(bookmarks) {
      var bookmarkIds = [];
      bookmarks.forEach(function(bookmark) {
        bookmarkIds.push(bookmark.id);
      });
      if ($scope.WidgetFeed) {
        $scope.WidgetFeed.videos.map(function(video) {
          var isBookmarked = bookmarkIds.includes(
            video.snippet.resourceId.videoId
          );
          if (isBookmarked) {
            video.bookmarked = true;
          } else {
            video.bookmarked = false;
          }
        });
      } else if ($scope.WidgetSingle) {
        var isBookmarked = bookmarkIds.includes($scope.WidgetSingle.video.id);
        if (isBookmarked) {
          $scope.WidgetSingle.video.bookmarked = true;
        } else {
          $scope.WidgetSingle.video.bookmarked = false;
        }
      }
      if (!$scope.$$phase) {
        $scope.$apply();
      }
    });
  }
};
