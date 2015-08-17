describe('Unit : youtubePlugin content.home.controller.js', function () {
    var scope, $rootScope, $controller, Buildfire, TAG_NAMES, STATUS_CODE, CONTENT_TYPE;
    beforeEach(module('youtubePluginContent'));

    beforeEach(inject(function (_$rootScope_, _$controller_, _Buildfire_, _TAG_NAMES_, _STATUS_CODE_, _CONTENT_TYPE_) {
        $rootScope = _$rootScope_;
        scope = $rootScope.$new();
        $controller = _$controller_;
        Buildfire = _Buildfire_;
        TAG_NAMES = _TAG_NAMES_;
        STATUS_CODE = _STATUS_CODE_;
        CONTENT_TYPE = _CONTENT_TYPE_;
    }));

    beforeEach(function () {
        ContentHome = $controller('ContentHomeCtrl', {
            $scope: scope,
            Buildfire: Buildfire,
            TAG_NAMES: TAG_NAMES,
            STATUS_CODE: STATUS_CODE,
            CONTENT_TYPE: CONTENT_TYPE
        });
        it('it should pass if Home is defined', function () {
            expect(ContentHome).not.toBeUndefined();
        });
        it('it should pass if Buildfire is defined', function () {
            expect(Buildfire).not.toBeUndefined();
        });
        it('it should pass if TAG_NAMES is defined', function () {
            expect(TAG_NAMES).not.toBeUndefined();
        });
        it('it should pass if STATUS_CODE is defined', function () {
            expect(STATUS_CODE).not.toBeUndefined();
        });
        it('it should pass if CONTENT_TYPE is defined', function () {
            expect(CONTENT_TYPE).not.toBeUndefined();
        });
        it('it should pass if openAddImagePopUp function is defined', function () {
            expect(ContentHome.openAddImagePopUp).not.toBeUndefined();
        });
    });

    describe('ContentHome.masterData', function () {
        it('it should pass if ContentHome.masterData match the result', function () {
            expect(ContentHome.masterData).toEqual({
                "content": {
                    "images": [],
                    "description": '<p><br data-mce-bogus="1"></p>',
                    "rssUrl": "",
                    "type": CONTENT_TYPE.SINGLE_VIDEO
                },
                "design": {
                    "itemListLayout": "",
                    "itemListBgImage": "",
                    "itemDetailsBgImage": ""
                }
            });
        });
    });

    describe('ContentHome.CONTENT_TYPE', function () {
        it('it should pass if ContentHome.CONTENT_TYPE is defined', function () {
            expect(ContentHome.CONTENT_TYPE).toBeDefined();
        });
    });

    describe('ContentHome.data', function () {
        it('it should pass if ContentHome.data is null', function () {
            expect(ContentHome.data).toEqual({
              "content": {
                "images": [],
                "description": '<p><br data-mce-bogus="1"></p>',
                "rssUrl": "",
                "type": CONTENT_TYPE.SINGLE_VIDEO
              },
              "design": {
                "itemListLayout": "",
                "itemListBgImage": "",
                "itemDetailsBgImage": ""
              }
            });
        });
    });

    describe('Function : ContentHome.changeContentType', function () {
        it('ContentHome.changeContentType should exist and be a function', function () {
            expect(typeof ContentHome.changeContentType).toEqual('function');
        });
        it('it should pass if ContentHome.data.content.type is equals to CONTENT_TYPE.CHANNEL_FEED after passing parameter "Channel Feed" to ContentHome.changeContentType', function () {
            ContentHome.data = {
                "content": {
                    "images": [],
                    "description": '<p><br data-mce-bogus="1"></p>',
                    "rssUrl": "",
                    "type": ''
                },
                "design": {
                    "itemListLayout": "",
                    "itemListBgImage": "",
                    "itemDetailsBgImage": ""
                }
            };
            ContentHome.changeContentType("Channel Feed");
            $rootScope.$digest();
            expect(ContentHome.data.content.type).toEqual(CONTENT_TYPE.CHANNEL_FEED);
        });
        it('it should pass if ContentHome.data.content.type is equals to CONTENT_TYPE.SINGLE_VIDEO after passing parameter "Single Video" to ContentHome.changeContentType', function () {
            ContentHome.data = {
                "content": {
                    "images": [],
                    "description": '<p><br data-mce-bogus="1"></p>',
                    "rssUrl": "",
                    "type": ''
                },
                "design": {
                    "itemListLayout": "",
                    "itemListBgImage": "",
                    "itemDetailsBgImage": ""
                }
            };
            ContentHome.changeContentType(CONTENT_TYPE.SINGLE_VIDEO);
            $rootScope.$digest();
            expect(ContentHome.data.content.type).toEqual("Single Video");
        });
    });

})
;
