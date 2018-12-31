const bookmarks = {
	add($scope, video) {
		let options = {
			id: video.snippet.resourceId.videoId || video.id,
			title: video.snippet.title,
			payload: `#/video/${video.snippet.resourceId.videoId}`,
			icon: video.snippet.thumbnails.default.url
		};
		let callback = (err, data) => {
			if (err) throw err;
			if ($scope.WidgetFeed) {
				$scope.WidgetFeed.videos.map(v => {
					const isBookmarked = v.snippet.resourceId.videoId === video.snippet.resourceId.videoId;
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
	delete($scope, video) {
		const callback = () => {
            if ($scope.WidgetFeed) {
				$scope.WidgetFeed.videos.map(v => {
					const isBookmarked = v.snippet.resourceId.videoId === video.snippet.resourceId.videoId;
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
		buildfire.bookmarks ? buildfire.bookmarks.delete(video.snippet.resourceId.videoId, callback) : null;
	},
	_getAll(callback) {
		const cb = (err, bookmarks) => {
			if (err) throw err;
			callback(bookmarks);
		};
		buildfire.bookmarks ? buildfire.bookmarks.getAll(cb) : cb(null, []);
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