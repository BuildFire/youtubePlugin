var cache = {
  storeName: 'cacheStore',
  saveCache: function(object) {
    window.buildfire.localStorage.setItem(`${this.storeName}_${window.bfInstanceId}`, JSON.stringify(object), () => {});
  },
  getCache: function(callback) {
    window.buildfire.localStorage.getItem(`${this.storeName}_${window.bfInstanceId}`, (error, value) => {
      if (error) return callback(error, null);
      callback(null, JSON.parse((typeof value === 'undefined') ? null : value));
    });
  }
};
