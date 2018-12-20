const bookmarks = {
	add($scope, video) {
		let options = {
			id: video.snippet.resourceId.videoId,
			title: video.snippet.title,
			payload: `#/video/${video.snippet.resourceId.videoId}`,
			icon: video.snippet.thumbnails.default
		};
		let callback = (err, data) => {
			if (err) throw err;
			$scope.WidgetFeed.videos.map(v => {
                const isBookmarked = v.snippet.resourceId.videoId === video.snippet.resourceId.videoId;
                if (isBookmarked) {
                    v.bookmarked = true;
                }
            });

            if (!$scope.$$phase) {
                $scope.$apply();
            }
		};
		buildfire.bookmarks.add(options, callback);
    },
    delete($scope, video) {
        const callback = () => {
            $scope.WidgetFeed.videos.map(v => {
                const isBookmarked = v.snippet.resourceId.videoId === video.snippet.resourceId.videoId;
                if (isBookmarked) {
                    v.bookmarked = false;
                }
            });

            if (!$scope.$$phase) {
                $scope.$apply();
            }
        };
        buildfire.bookmarks.delete(video.snippet.resourceId.videoId, callback);
    },
    _getAll(callback) {
        const cb = (err, bookmarks) => {
            if (err) throw err;
            callback(bookmarks);
        };
        buildfire.bookmarks.getAll(cb);
    },
    findAndMarkAll($scope) {
        this._getAll(bookmarks => {
            console.log(bookmarks);
            
            const bookmarkIds = [];
            bookmarks.forEach(bookmark => {
                bookmarkIds.push(bookmark.id);
            });
            $scope.WidgetFeed.videos.map(video => {
                const isBookmarked = bookmarkIds.includes(video.snippet.resourceId.videoId);
                if (isBookmarked) {
                    video.bookmarked = true;
                } else {
                    video.bookmarked = false;
                }
            });
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        });
        
    }
};
