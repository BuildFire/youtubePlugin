describe('Unit : youtubePlugin content services', function () {
  describe('Unit: Buildfire Provider', function () {
    var Buildfire;
    beforeEach(module('youtubePluginContent'));

    beforeEach(inject(function (_Buildfire_) {
      Buildfire = _Buildfire_;
    }));

    it('Buildfire should exist and be an object', function () {
      expect(typeof Buildfire).toEqual('object');
    });
  });
  describe('Unit : DataStore Factory', function () {
    var DataStore, Buildfire, STATUS_MESSAGES, STATUS_CODE, q;
    beforeEach(module('youtubePluginContent'));
    beforeEach(inject(function (_DataStore_, _STATUS_CODE_, _STATUS_MESSAGES_) {
      DataStore = _DataStore_;
      STATUS_CODE = _STATUS_CODE_;
      STATUS_MESSAGES = _STATUS_MESSAGES_;
      Buildfire = {
        datastore: {}
      };
      Buildfire.datastore = jasmine.createSpyObj('Buildfire.datastore', ['get', 'bulkInsert', 'insert', 'search', 'update', 'save', 'delete']);
    }));

    it('DataStore should exist and be an object', function () {
      expect(typeof DataStore).toEqual('object');
    });
    it('DataStore.get should exist and be a function', function () {
      expect(typeof DataStore.get).toEqual('function');
    });
    it('DataStore.getById should exist and be a function', function () {
      expect(typeof DataStore.getById).toEqual('function');
    });
    it('DataStore.insert should exist and be a function', function () {
      expect(typeof DataStore.insert).toEqual('function');
    });
    it('DataStore.bulkInsert should exist and be a function', function () {
      expect(typeof DataStore.bulkInsert).toEqual('function');
    });
    it('DataStore.search should exist and be a function', function () {
      expect(typeof DataStore.search).toEqual('function');
    });
    it('DataStore.update should exist and be a function', function () {
      expect(typeof DataStore.update).toEqual('function');
    });
    it('DataStore.save should exist and be a function', function () {
      expect(typeof DataStore.save).toEqual('function');
    });
    it('DataStore.deleteById should exist and be a function', function () {
      expect(typeof DataStore.deleteById).toEqual('function');
    });
  });
  describe('Unit : ImageLibrary Factory', function () {
    var ImageLibrary, Buildfire, STATUS_MESSAGES, STATUS_CODE, q;
    beforeEach(module('youtubePluginContent'));

    beforeEach(inject(function (_ImageLibrary_, _STATUS_CODE_, _STATUS_MESSAGES_, _$q_) {
      ImageLibrary = _ImageLibrary_;
      STATUS_CODE = _STATUS_CODE_;
      STATUS_MESSAGES = _STATUS_MESSAGES_;
      Buildfire = {
        imageLib: {}
      };
      Buildfire.imageLib = jasmine.createSpyObj('Buildfire.imageLib', ['showDialog']);
    }));

    it('Buildfire should exist and be an object', function () {
      expect(typeof Buildfire).toEqual('object');
    });
    it('Buildfire.imageLib should exist and be an object', function () {
      expect(typeof Buildfire.imageLib).toEqual('object');
    });
    it('ImageLibrary should exist and be an object', function () {
      expect(typeof ImageLibrary).toEqual('object');
    });
    it('ImageLibrary.showDialog should exist and be a function', function () {
      expect(typeof ImageLibrary.showDialog).toEqual('function');
    });
  });
  describe('Unit : ActionItems Factory', function () {
    var ActionItems, Buildfire, STATUS_MESSAGES, STATUS_CODE, q;
    beforeEach(module('youtubePluginContent'));

    beforeEach(inject(function (_ActionItems_, _STATUS_CODE_, _STATUS_MESSAGES_, _$q_) {
      ActionItems = _ActionItems_;
      STATUS_CODE = _STATUS_CODE_;
      STATUS_MESSAGES = _STATUS_MESSAGES_;
      Buildfire = {
        actionItems: {}
      };
      Buildfire.actionItems = jasmine.createSpyObj('Buildfire.actionItems', ['showDialog']);
    }));

    it('Buildfire should exist and be an object', function () {
      expect(typeof Buildfire).toEqual('object');
    });
    it('Buildfire.actionItems should exist and be an object', function () {
      expect(typeof Buildfire.actionItems).toEqual('object');
    });
    it('Buildfire.actionItems.showDialog should exist and be a function', function () {
      expect(typeof Buildfire.actionItems.showDialog).toEqual('function');
    });
    it('ActionItems should exist and be an object', function () {
      expect(typeof ActionItems).toEqual('object');
    });
    it('ActionItems.showDialog should exist and be a function', function () {
      expect(typeof ActionItems.showDialog).toEqual('function');
    });
  });
  describe('Unit : Utils Factory', function () {
    var Utils;
    beforeEach(module('youtubePluginContent'));

    beforeEach(inject(function (_Utils_) {
      Utils = _Utils_;
    }));
    it('Utils should exist and be an object', function () {
      expect(typeof Utils).toEqual('object');
    });
    it('Utils.extractSingleVideoId should exist and be a function', function () {
      expect(typeof Utils.extractSingleVideoId).toEqual('function');
    });
    it('Utils.extractChannelId should exist and be a function', function () {
      expect(typeof Utils.extractChannelId).toEqual('function');
    });
    it('Utils.extractSingleVideoId should return a valid videoId', function () {
      var url = "https://www.youtube.com/watch?v=0wYYjQJcGW8";
      var videoId = Utils.extractSingleVideoId(url);
      expect(videoId).toEqual('0wYYjQJcGW8');
    });
    it('Utils.extractChannelId should return a valid channelId', function () {
      var url = "https://www.youtube.com/channel/UC4PooiX37Pld1T8J5SYT-SQ";
      var channelId = Utils.extractChannelId(url);
      expect(channelId).toEqual('UC4PooiX37Pld1T8J5SYT-SQ');
    });
  });
});
