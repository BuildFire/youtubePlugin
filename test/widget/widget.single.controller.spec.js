describe('Unit : youtubePlugin widget.single.controller.js', function () {
    describe('Unit : when routeParams.videoId is undefined', function () {
        var WidgetSingle, $controller, routeParams;
        beforeEach(module('youtubePluginWidget'));
        beforeEach(inject(function (_$controller_) {
            $controller = _$controller_;
            routeParams = {
                videoId: ""
            };
        }));

        beforeEach(function () {
            WidgetSingle = $controller('WidgetSingleCtrl', {
                $routeParams: routeParams
            });
        });

        describe('Function : WidgetSingle.addItemListBackgroundImage returns success', function () {
            it('it should if WidgetSingle.data is null', function () {
                expect(WidgetSingle.data).toEqual(null);
            });
        });
    });

    describe('Unit :  when routeParams.videoId is defined', function () {
        var WidgetSingle, YoutubeApi, $httpBackend, _url, videoItemDetailMoke, YOUTUBE_KEYS, $rootScope, q, $controller, DataStore, routeParams, TAG_NAMES, STATUS_CODE, STATUS_MESSAGES, CONTENT_TYPE;
        beforeEach(module('youtubePluginWidget'));
        beforeEach(inject(function (_$rootScope_, _$q_, _$httpBackend_, _$controller_, _YOUTUBE_KEYS_, _DataStore_, _TAG_NAMES_, _STATUS_CODE_, _STATUS_MESSAGES_) {
            q = _$q_;
            $rootScope = _$rootScope_;
            $controller = _$controller_;
            DataStore = _DataStore_;
            TAG_NAMES = _TAG_NAMES_;
            STATUS_CODE = _STATUS_CODE_;
            STATUS_MESSAGES = _STATUS_MESSAGES_;
            $httpBackend = _$httpBackend_;
            YOUTUBE_KEYS = _YOUTUBE_KEYS_;
            routeParams = {
                videoId: "U9kCY9psgOc"
            };
        }));

        beforeEach(function () {
            WidgetSingle = $controller('WidgetSingleCtrl', {
                $routeParams: routeParams,
                $q: q,
                DataStore: DataStore,
                TAG_NAMES: TAG_NAMES,
                STATUS_CODE: STATUS_CODE,
                STATUS_MESSAGES: STATUS_MESSAGES
            });
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

        describe('Function : WidgetSingle.addItemListBackgroundImage returns success', function () {
            beforeEach(function () {
                videoItemDetailMoke = {
                    etag: "sGDdEsjSJ_SnACpEvVQ6MtTzkrI/IxajpjgxoSVBKHzwLRKViG4vav4",
                    id: "U9kCY9psgOc",
                    kind: "youtube#video",
                    snippet: {}
                };
                _url = 'https://www.googleapis.com/youtube/v3/videos?part=snippet&id=' + routeParams.videoId + '&key=' + YOUTUBE_KEYS.API_KEY;
                $httpBackend.expectGET(_url).respond({
                    items: [videoItemDetailMoke]
                });
                $httpBackend.flush();
            });
            it('it should if WidgetSingle.data is not null', function () {
                expect(WidgetSingle.video).toEqual(videoItemDetailMoke);
            });
        });
        describe('Function : WidgetSingle.addItemListBackgroundImage returns error', function () {
            beforeEach(function () {
                var deferred = q.defer();
                deferred.reject(new Error({
                    code: STATUS_CODE.UNDEFINED_VIDEO_ID,
                    message: STATUS_CODE.UNDEFINED_VIDEO_ID
                }));
                _url = 'https://www.googleapis.com/youtube/v3/videos?part=snippet&id=' + routeParams.videoId + '&key=' + YOUTUBE_KEYS.API_KEY;
                $httpBackend.expectGET(_url).respond(deferred.promise);
                $httpBackend.flush();
            });
            it('it should pass if WidgetSingle.data is null', function () {
                expect(WidgetSingle.data).toEqual(null);
            });
        });
    });
});
