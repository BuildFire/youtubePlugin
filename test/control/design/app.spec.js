describe('Unit : youtubePlugin design app.js', function () {
  describe('Unit: app routes', function () {
    beforeEach(module('youtubePluginDesign'));
    var location, route, rootScope;
    beforeEach(inject(function (_$location_, _$route_, _$rootScope_) {
      location = _$location_;
      route = _$route_;
      rootScope = _$rootScope_;
    }));
    describe('Home route', function () {
      beforeEach(inject(
        function ($httpBackend) {
          $httpBackend.expectGET('templates/home.html')
            .respond(200);
          $httpBackend.expectGET('/')
            .respond(200);
        }));

      it('should load the home page on successful load of location path /', function () {
        location.path('/');
        rootScope.$digest();
        expect(route.current.controller).toBe('DesignHomeCtrl')
      });
    });
  });

  describe('Unit: getImageUrl filter', function () {
    beforeEach(module('youtubePluginDesign'));
    var filter;
    beforeEach(inject(function (_$filter_) {
      filter = _$filter_;
    }));

    it('it should returns resized image url', function () {
      var reSizedImage;
      reSizedImage = filter('getImageUrl')('https://www.facebook.com/photo.php?fbid=1008284442533844&set=a.359021657460129.98766.100000568920267&type=1&theater', 88, 124, 'resize');
      expect(reSizedImage).toEqual('http://s7obnu.cloudimage.io/s/resizenp/88x124/https://www.facebook.com/photo.php?fbid=1008284442533844&set=a.359021657460129.98766.100000568920267&type=1&theater');
    });
    it('it should pass if "getImageUrl" filter returns cropped image url', function () {
      var croppedImage;
      croppedImage = filter('getImageUrl')('https://www.facebook.com/photo.php?fbid=1008284442533844&set=a.359021657460129.98766.100000568920267&type=1&theater', 88, 124, 'crop');
      expect(croppedImage).toEqual('http://s7obnu.cloudimage.io/s/crop/88x124/https://www.facebook.com/photo.php?fbid=1008284442533844&set=a.359021657460129.98766.100000568920267&type=1&theater');
    });
  });
});