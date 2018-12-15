const viewedVideos = {
	/**
	 * If localStorage is not set, initialize viewed videos as an empty array
	 */
	init() {
		let viewedItems = JSON.parse(localStorage.getItem('viewedVideos'));
		const storageInitialized = viewedItems && viewedItems.length ? true : false;
		if (storageInitialized) return;

		localStorage.setItem('viewedVideos', '[]');
	},
	/**
	 * returns a parsed array of viewed videos
	 * @returns {Array}
	 */
	get() {
		return JSON.parse(localStorage.getItem('viewedVideos'));
	},
	/**
	 * stringify and set viewed videos to local storage
	 * @param {Array} videos
	 */
	set(videos) {
		localStorage.setItem('viewedVideos', JSON.stringify(videos));
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
		this.set(viewedItems);

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
