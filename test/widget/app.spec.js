describe('Unit: youtubePlugin widget app', function () {
    describe('Unit: app routes', function () {
        beforeEach(module('youtubePluginWidget'));
        var location, route, rootScope;
        beforeEach(inject(
            function (_$location_, _$route_, _$rootScope_) {
                location = _$location_;
                route = _$route_;
                rootScope = _$rootScope_;
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
});