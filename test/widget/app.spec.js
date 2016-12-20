describe('Unit: youtubePlugin widget app', function () {
  describe('Unit: app routes', function () {
    beforeEach(module('youtubePluginWidget'));
    var location, route, rootScope, Buildfire;
    beforeEach(inject(
      function (_$location_, _$route_, _$rootScope_) {
        location = _$location_;
        route = _$route_;
        rootScope = _$rootScope_;
        Buildfire = {
          imageLib:{
            local:{
              resizeImage:function(){}
            }
          }
        }
      }));

    describe('Unit test for resolve in path /', function () {
      beforeEach(inject(
        function ($httpBackend) {
          $httpBackend.expectGET('/')
            .respond(200);
        }));
    });
    describe('video route', function () {
      beforeEach(inject(
        function ($httpBackend) {
          $httpBackend.expectGET('templates/Item_Details.html')
            .respond(200);
          $httpBackend.expectGET('/video/:videoId')
            .respond(200);
        }));

      it('should load the home page on successful load of location path /video/:videoId', function () {
        location.path('/video/:videoId');
        rootScope.$digest();
        expect(route.current.controller).toBe('WidgetSingleCtrl')
      });
    });
  });
  describe('Unit: getImageUrl filter', function () {
    beforeEach(module('youtubePluginWidget'));
    var filter;
    beforeEach(inject(function (_$filter_) {
      filter = _$filter_;
    }));

    it('it should pass if "getImageUrl" filter returns resized image url', function () {
      var result;
      result = filter('getImageUrl')('https://imagelibserver.s3.amazonaws.com/25935164-2add-11e5-9d04-02f7ca55c361/950a50c0-400a-11e5-9af5-3f5e0d725ccb.jpg', 88, 124, 'resize');
      expect(result).toEqual("http://s7obnu.cloudimage.io/s/resizenp/88x124/https://imagelibserver.s3.amazonaws.com/25935164-2add-11e5-9d04-02f7ca55c361/950a50c0-400a-11e5-9af5-3f5e0d725ccb.jpg");
    });
    it('it should pass if "getImageUrl" filter returns cropped image url', function () {
      var result;
      result = filter('getImageUrl')('https://imagelibserver.s3.amazonaws.com/25935164-2add-11e5-9d04-02f7ca55c361/950a50c0-400a-11e5-9af5-3f5e0d725ccb.jpg', 88, 124, 'crop');
      expect(result).toEqual('http://s7obnu.cloudimage.io/s/crop/88x124/https://imagelibserver.s3.amazonaws.com/25935164-2add-11e5-9d04-02f7ca55c361/950a50c0-400a-11e5-9af5-3f5e0d725ccb.jpg');
    });
  });
  describe('Unit: returnYoutubeUrl filter', function () {
    beforeEach(module('youtubePluginWidget'));
    var filter, $sce;
    beforeEach(inject(function (_$filter_, _$sce_) {
      filter = _$filter_;
      $sce = _$sce_;
    }));

    it('it should pass if "returnYoutubeUrl" filter returns youtube video embed url', function () {
      var result;
      result = filter('returnYoutubeUrl')('wTcNtgA6gHs');
      expect(result.$$unwrapTrustedValue()).toEqual("https://www.youtube.com/embed/wTcNtgA6gHs?enablejsapi=1");
    });
  });
  describe('Unit: backgroundImage directive', function () {
    describe('backgroundImage directive have assigned a url value', function () {
      var $compile, $rootScope, backgroundImage, $scope;
      beforeEach(module('youtubePluginWidget'));
      beforeEach(inject(function (_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();
      }));
      beforeEach(function () {
        backgroundImage = $compile('<div background-image="https://imagelibserver.s3.amazonaws.com/25935164-2add-11e5-9d04-02f7ca55c386/6256a8e0-4b0e-11e5-8618-af6c4fe89f23.png"></div>')($scope);
        $rootScope.$digest();
      });

      it('it should pass and background of div should be given image url', function () {
        expect(backgroundImage.css('background')).toEqual('rgb(1, 1, 1) url(http://s7obnu.cloudimage.io/s/resizenp/342x770/https://imagelibserver.s3.amazonaws.com/25935164-2add-11e5-9d04-02f7ca55c386/6256a8e0-4b0e-11e5-8618-af6c4fe89f23.png) repeat fixed 50% 0%');
      });
    });
    describe('backgroundImage directive have assigned a false value', function () {
      var $compile, $rootScope, backgroundImage, $scope;
      beforeEach(module('youtubePluginWidget'));
      beforeEach(inject(function (_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();
      }));
      beforeEach(function () {
        backgroundImage = $compile('<div background-image=""></div>')($scope);
        $rootScope.$digest();
      });

      it('it should pass and background of div should be none', function () {
        expect(backgroundImage.css('background')).toEqual('none');
      });
    });
  });
  describe('Unit: buildFireCarousel directive', function () {
    var $compile, $rootScope, buildFireCarousel, $scope;
    beforeEach(module('youtubePluginWidget'));
    beforeEach(inject(function (_$compile_, _$rootScope_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      $scope = _$rootScope_.$new();
    }));
    beforeEach(function () {
      buildFireCarousel = $compile('<div buildFireCarousel=""></div>')($scope);
      $rootScope.$digest();
    });

    it('it should be defined', function () {
      expect(buildFireCarousel).toBeDefined();
    });
  });
  describe('Unit: triggerNgRepeatRender directive', function () {
    var  $scope;
    beforeEach(module('youtubePluginWidget'));
    beforeEach(inject(function (_$rootScope_) {
      $scope =  _$rootScope_.$new();
    }));
  });
});