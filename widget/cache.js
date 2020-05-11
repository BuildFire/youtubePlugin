var cache = {
  storeName: "cacheStore",
  platform: buildfire.getContext().device.platform,
  saveCache: function (object) {
    //Use filestorage for mobile devices
    if (this.platform !== "web") {
      let options = {
        path: "/data/youtubePlugin/",
        fileName: `cache_${window.bfInstanceId}.txt`,
        content: JSON.stringify(object),
      };

      buildfire.services.fileSystem.fileManager.writeFileAsText(options, () => {});
    } else {
      window.buildfire.localStorage.setItem(
        `${this.storeName}_${window.bfInstanceId}`,
        JSON.stringify(object),
        () => {}
      );
    }
  },
  getCache: function (callback) {
    //Use filestorage for mobile devices
    if (this.platform !== "web") {
      var options = {
        path: "/data/youtubePlugin/",
        fileName: `cache_${window.bfInstanceId}.txt`,
      };

      buildfire.services.fileSystem.fileManager.readFileAsText(options, (error, value) => {
        if (error) return callback(error, null);
        callback(null, JSON.parse(typeof value === "undefined" ? null : value));
      });
    } else {
      window.buildfire.localStorage.getItem(
        `${this.storeName}_${window.bfInstanceId}`,
        (error, value) => {
          if (error) return callback(error, null);
          callback(
            null,
            JSON.parse(typeof value === "undefined" ? null : value)
          );
        }
      );
    }
  },
};
