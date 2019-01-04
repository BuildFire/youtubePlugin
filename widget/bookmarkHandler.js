const bookmarks = {
	add($scope, video) {
		if (!$scope || !video) return;
		let id = '';
		if (video.snippet.resourceId) {
			id = video.snippet.resourceId.videoId;
		} else {
			id = video.id;
		}
		let options = {
			id,
			title: video.snippet.title,
			payload: `#/video/${id}`,
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
		if (!$scope || !video) return;
		let id = '';
		if (video.snippet.resourceId) {
			id = video.snippet.resourceId.videoId;
		} else {
			id = video.id;
		}
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
		buildfire.bookmarks ? buildfire.bookmarks.delete(id, callback) : null;
	},
	_getAll(callback) {
		const cb = (err, bookmarks) => {
			if (err) throw err;
			callback(bookmarks);
		};
		buildfire.bookmarks ? buildfire.bookmarks.getAll(cb) : cb(null, []);
	},
	findAndMarkAll($scope) {
		if (!$scope) return;
		this._getAll(bookmarks => {
			const bookmarkIds = [];
			bookmarks.forEach(bookmark => {
				bookmarkIds.push(bookmark.id);
			});
			if ($scope.WidgetFeed) {
				$scope.WidgetFeed.videos.map(video => {
					const isBookmarked = bookmarkIds.includes(video.snippet.resourceId.videoId);
					if (isBookmarked) {
						video.bookmarked = true;
					} else {
						video.bookmarked = false;
					}
				});
			} else if ($scope.WidgetSingle) {
				const isBookmarked = bookmarkIds.includes($scope.WidgetSingle.video.id);
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
