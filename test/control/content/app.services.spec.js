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
      Buildfire.datastore = jasmine.createSpyObj('Buildfire.datastore', ['get','insert','update', 'save', 'delete']);
    }));

    it('DataStore should exist and be an object', function () {
      expect(typeof DataStore).toEqual('object');
    });
    it('DataStore.get should exist and be a function', function () {
      expect(typeof DataStore.get).toEqual('function');
    });
    it('DataStore.save should exist and be a function', function () {
      expect(typeof DataStore.save).toEqual('function');
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
    it('Utils.extractChannelId should return an object', function () {
      var url1 = "https://www.youtube.com/channel/UCuTaETsuCOkJ0H_GAztWt0Q";
      var url2 = "https://www.youtube.com/user/gopromx";
      var url3 = "https://www.youtube.com/c/creatoracademy";
      var channelId = Utils.extractChannelId(url1);
      var username = Utils.extractChannelId(url2);
      var _username = Utils.extractChannelId(url3);
      expect(channelId).toEqual({channel :'UCuTaETsuCOkJ0H_GAztWt0Q'});
      expect(username).toEqual({user :'gopromx'});
      expect(_username).toEqual({c :'creatoracademy'});
    });
  });
});
