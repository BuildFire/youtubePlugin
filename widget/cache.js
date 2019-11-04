//window.indexedDB.open does NOT work in iOS PWA. Error: "idbfactory.open() called in an invalid security context"
//So that's why we are doing here this if statement.

if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
  var cache = {
    storeName: 'cacheStore',
    init: function() {
      window.localStorage.setItem(this.storeName, '{}');
    },
    saveCache: function(object) {
      window.localStorage.setItem(this.storeName, JSON.stringify(object));
    },
    getCache: function(callback) {
      callback(null, JSON.parse(window.localStorage.getItem(this.storeName)));
    }
  };
} else {
  var cache = {
    db: null,
    dbName: "",
    indexName: "",
    objectStoreName: "",
    perm: "readwrite",
    init: function(options, callback) {
      if (!options || !callback) return;
      console.warn(options);
  
      options.dbName
        ? (this.dbName = options.dbName)
        : callback("DB Name required", null);
      options.indexName
        ? (this.indexName = options.indexName)
        : callback("Index Name required", null);
      options.objectStoreName
        ? (this.objectStoreName = options.objectStoreName)
        : callback("Object Store Name required", null);
      this.perm = options.perm ? options.perm : "readwrite";
      console.warn("cacheInit");
      var _this = this;
      var request = window.indexedDB.open(this.dbName, 3);
      request.onerror = function(event) {
        console.error(event);
      };
      // runs on init or version update
      request.onupgradeneeded = function(event) {
        _this.db = event.target.result;
        var objectStore = _this.db.createObjectStore(_this.objectStoreName);
        objectStore.createIndex(_this.indexName, _this.indexName, {
          unique: false
        });
      };
      request.onsuccess = function() {
        _this.db = request.result;
        callback(null);
      };
    },
    saveCache: function(object) {
      if (!this.db) throw new Error("Error saving cache: db ref not found");
      var cacheTransaction = this.db.transaction(this.objectStoreName, this.perm);
      var cacheObjStore = cacheTransaction.objectStore(this.objectStoreName);
      cacheObjStore.put(object, this.indexName);
    },
    getCache: function(callback) {
      if (!this.db) throw new Error("Error getting cache: db ref not found");
      var cacheTransaction = this.db.transaction(this.objectStoreName, this.perm);
      var cacheObjStore = cacheTransaction.objectStore(this.objectStoreName);
      var request = cacheObjStore.get(this.indexName);
      request.onsuccess = function(event) {
        callback(null, event.target.result);
      };
    }
  };
}
