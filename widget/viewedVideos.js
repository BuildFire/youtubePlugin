const viewedVideos = {
	id: '',
	/**
	 * If localStorage is not set, initialize viewed videos as an empty array
	 */
	init() {
		buildfire.auth.getCurrentUser((err, user) => {
			if (err) throw err;

			this.id = user ? user._id : 'guest';

			let viewedItems = JSON.parse(localStorage.getItem('viewedVideos'));

			const storageInitialized = viewedItems && typeof viewedItems === 'object' ? true : false;

			if (storageInitialized) {
				const userStateInitialized = viewedItems.hasOwnProperty(this.id);
				if (userStateInitialized) return;
				else viewedItems[this.id] = [];
			} else {
				viewedItems = { [this.id]: [] };
			}

			localStorage.setItem('viewedVideos', JSON.stringify(viewedItems));
		});
	},
	/**
	 * returns the current user's parsed array of viewed videos
	 * @returns {Array}
	 */
	get() {
		try {
			return JSON.parse(localStorage.getItem('viewedVideos'))[this.id];
		} catch (e) {
			console.warn(e);
			return [];
		}
	},
	/**
	 * stringify and set viewed videos to local storage
	 * @param {Array} videos
	 */
	_set(videos) {
		try {
			let viewedVideos = JSON.parse(localStorage.getItem('viewedVideos'));
			viewedVideos[this.id] = videos;
			localStorage.setItem('viewedVideos', JSON.stringify(viewedVideos));
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
	markViewed($scope, video) {
		const viewedItems = this.get();
		const isViewed = viewedItems.includes(video.id);

		if (isViewed) return;

		viewedItems.push(video.id);
		this._set(viewedItems);

		$scope.WidgetFeed.videos.map(video => {
			if (viewedItems.includes(video.id)) {
				video.viewed = true;
			}
		});

		if (!$scope.$$phase) {
			$scope.$apply();
		}
	},
	/**
	 * maps through an array of videos
	 * marks videos that have been viewed
	 * @param {Array} videos
	 */
	findAndMarkViewed(videos) {
		return videos.map(video => {
			const isViewed = this.get().includes(video.id);
			video.viewed = isViewed ? true : false;
		});
	}
};
