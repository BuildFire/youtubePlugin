describe("Unit : youtubePlugin widget.feed.controller.js", function () {
  var WidgetFeed, $controller, DataStore, $scope, TAG_NAMES, STATUS_CODE, YoutubeApi, Location, $routeParams, VIDEO_COUNT;

  beforeEach(module('youtubePluginWidget'));

  beforeEach(inject(function (_$controller_, _$rootScope_, _DataStore_, _TAG_NAMES_, _STATUS_CODE_, _YoutubeApi_, _Location_, _VIDEO_COUNT_) {
    $controller = _$controller_;
    $scope = _$rootScope_.$new();
    DataStore = _DataStore_;
    TAG_NAMES = _TAG_NAMES_;
    STATUS_CODE = _STATUS_CODE_;
    YoutubeApi = _YoutubeApi_;
    Location = _Location_;
    VIDEO_COUNT = _VIDEO_COUNT_;
    $routeParams = {
      playlistId: ''
    };
  }));

  beforeEach(function () {
    WidgetFeed = $controller('WidgetFeedCtrl', {
      $scope: $scope
    });
  });

  describe('Unit : units should be Defined', function () {
    it('it should pass if WidgetFeed is defined', function () {
      expect(WidgetFeed).toBeDefined();
    });
    it('it should pass if DataStore is defined', function () {
      expect(DataStore).not.toBeUndefined();
    });
    it('it should pass if TAG_NAMES is defined', function () {
      expect(TAG_NAMES).not.toBeUndefined();
    });
    it('it should pass if STATUS_CODE is defined', function () {
      expect(STATUS_CODE).not.toBeUndefined();
    });
    it('it should pass if YoutubeApi is defined', function () {
      expect(YoutubeApi).not.toBeUndefined();
    });
    it('it should pass if Location is defined', function () {
      expect(Location).not.toBeUndefined();
    });
    it('it should pass if $routeParams is defined', function () {
      expect($routeParams).not.toBeUndefined();
    });
    it('it should pass if $routeParams.playlistId is defined', function () {
      expect($routeParams.playlistId).not.toBeUndefined();
    });
    it('it should pass if VIDEO_COUNT is defined', function () {
      expect(VIDEO_COUNT).not.toBeUndefined();
    });
  });
});