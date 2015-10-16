describe('Unit : youtubePlugin widget.single.controller.js', function () {
  describe('Unit : when routeParams.videoId is undefined', function () {
    var WidgetSingle, $controller, routeParams, $scope;
    beforeEach(module('youtubePluginWidget'));
    beforeEach(inject(function (_$controller_, _$rootScope_) {
      $controller = _$controller_;
      $scope = _$rootScope_.$new();
      routeParams = {
        videoId: ""
      };
    }));

    beforeEach(function () {
      WidgetSingle = $controller('WidgetSingleCtrl', {
        $routeParams: routeParams,
        $scope: $scope
      });
    });

    describe('Function : WidgetSingle.getSingleVideoDetails Not Called', function () {
      it('it should if WidgetSingle.data is null', function () {
        expect(WidgetSingle.video).toEqual(null);
      });
    });
  });

  describe('Unit :  when routeParams.videoId is defined', function () {
    var WidgetSingle, YoutubeApi, $httpBackend, $scope, _url, videoItemDetailMock, YOUTUBE_KEYS, $rootScope, q, $controller, DataStore, routeParams, TAG_NAMES, STATUS_CODE, STATUS_MESSAGES, CONTENT_TYPE;
    beforeEach(module('youtubePluginWidget'));
    beforeEach(inject(function (_$rootScope_, _$q_, _$httpBackend_, _$controller_, _YOUTUBE_KEYS_, _DataStore_, _TAG_NAMES_, _STATUS_CODE_, _STATUS_MESSAGES_,_YoutubeApi_) {
      q = _$q_;
      $rootScope = _$rootScope_;
      $scope = _$rootScope_.$new();
      $controller = _$controller_;
      DataStore = _DataStore_;
      TAG_NAMES = _TAG_NAMES_;
      STATUS_CODE = _STATUS_CODE_;
      STATUS_MESSAGES = _STATUS_MESSAGES_;
      $httpBackend = _$httpBackend_;
      YOUTUBE_KEYS = _YOUTUBE_KEYS_;
      YoutubeApi = _YoutubeApi_;
      routeParams = {
        videoId: "U9kCY9psgOc"
      };
      YoutubeApi = jasmine.createSpyObj('YoutubeApi', ['getSingleVideoDetails']);
       }));

    beforeEach(function () {
      WidgetSingle = $controller('WidgetSingleCtrl', {
        $routeParams: routeParams,
        $q: q,
        $scope: $scope,
        DataStore: DataStore,
        TAG_NAMES: TAG_NAMES,
        STATUS_CODE: STATUS_CODE,
        STATUS_MESSAGES: STATUS_MESSAGES
      });
    });

    describe('Function : WidgetSingle.getSingleVideoDetails returns success', function () {
      it('DataStore.get should exist and be a function', function () {
        YoutubeApi.getSingleVideoDetails.and.callFake(function () {
          var deferred = q.defer();
          deferred.resolve();
          deferred.$promise = deferred.promise;
          return deferred;
        });
      })
    });
    describe('Units: units should be Defined', function () {
      it('it should pass if routeParams is defined', function () {
        expect(routeParams).toBeDefined();
      });
      it('it should pass if routeParams.videoId is defined', function () {
        expect(routeParams.videoId).toBeDefined();
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
      it('it should pass if STATUS_MESSAGES is defined', function () {
        expect(STATUS_MESSAGES).not.toBeUndefined();
      });
    });

    describe('Function : WidgetSingle.getSingleVideoDetails returns success', function () {
      beforeEach(function () {
        videoItemDetailMock = {
        etag: "sGDdEsjSJ_SnACpEvVQ6MtTzkrI/IxajpjgxoSVBKHzwLRKViG4vav4",
        id: "U9kCY9psgOc",
        kind: "youtube#video",
        snippet: {}
      };
        _url = 'https://plugin-proxy-server.herokuapp.com/video';
      $httpBackend.expectPOST(_url, {
        id: routeParams.videoId
      }).respond(videoItemDetailMock);

      $httpBackend.flush();
    });
   });

  });
});
