describe("Unit : youtubePlugin widget.feed.controller.js", function () {
  var WidgetFeed, $controller, DataStore, $scope, TAG_NAMES, STATUS_CODE, YoutubeApi, Location, $routeParams, VIDEO_COUNT,$rootScope;

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
    $rootScope = _$rootScope_;
    $routeParams = {
      playlistId: ''
    };
    YoutubeApi = jasmine.createSpyObj('YoutubeApi', ['getFeedVideos']);
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

  describe('Function : WidgetFeed.safeHtml function', function () {
    it('it should if WidgetFeed.safeHtml  returns $sce.trustAsHtml', function () {
      var html = '<p>&nbsp;Buildfire<br></p>';
      var trustAsHtml = WidgetFeed.safeHtml(html);
      $rootScope.$digest();
      expect(typeof trustAsHtml).toEqual('object');
    });
  });

  describe('Function : WidgetFeed.getFeedVideos returns success', function () {
    it('It should mock the getFeedVideos function', function () {
      YoutubeApi.getFeedVideos.and.callFake(function () {
        var deferred = q.defer();
        deferred.resolve();
        deferred.$promise = deferred.promise;
        return deferred;
      });
    });
  });

  describe('Function :  WidgetFeed.showDescription function', function () {
    it('it should pass if WidgetFeed.showDescription called and returns true', function () {
      var description = '<p>&nbsp; Buildfire <br></p>';
      var isDescription = WidgetFeed.showDescription(description);
      $rootScope.$digest();
      expect(isDescription).toEqual(true);
    });
    it('it should pass if WidgetFeed.showDescription called and returns false', function () {
      var description = '<p>&nbsp;<br></p>';
      var isDescription = WidgetFeed.showDescription(description);
      $rootScope.$digest();
      expect(isDescription).toEqual(false);
    });
  });
});