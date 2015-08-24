describe('Unit : youtubePlugin design.home.controller.js', function () {
    var scope, DesignHome, $rootScope, q, $controller, DataStore, ImageLibrary, TAG_NAMES, STATUS_CODE, STATUS_MESSAGES, CONTENT_TYPE;
    beforeEach(module('youtubePluginDesign'));

    beforeEach(inject(function (_$rootScope_, _$q_, _$controller_, _DataStore_, _ImageLibrary_, _TAG_NAMES_, _CONTENT_TYPE_, _STATUS_CODE_, _STATUS_MESSAGES_) {
        $rootScope = _$rootScope_;
        q = _$q_;
        scope = $rootScope.$new();
        $controller = _$controller_;
        DataStore = _DataStore_;
        TAG_NAMES = _TAG_NAMES_;
        CONTENT_TYPE = _CONTENT_TYPE_;
        STATUS_CODE = _STATUS_CODE_;
        STATUS_MESSAGES = _STATUS_MESSAGES_;
        ImageLibrary = jasmine.createSpyObj('ImageLibrary', ['showDialog']);

    }));

    beforeEach(function () {
        DesignHome = $controller('DesignHomeCtrl', {
            $scope: scope,
            $q: q,
            DataStore: DataStore,
            ImageLibrary: ImageLibrary,
            TAG_NAMES: TAG_NAMES,
            CONTENT_TYPE: CONTENT_TYPE
        });
    });

    describe('Units: units should be Defined', function () {
        it('it should pass if DataStore is defined', function () {
            expect(DataStore).not.toBeUndefined();
        });
        it('it should pass if ImageLibrary is defined', function () {
            expect(ImageLibrary).not.toBeUndefined();
        });
        it('it should pass if TAG_NAMES is defined', function () {
            expect(TAG_NAMES).not.toBeUndefined();
        });
        it('it should pass if CONTENT_TYPE is defined', function () {
            expect(CONTENT_TYPE).not.toBeUndefined();
        });
    });

    describe('DesignHome.masterData', function () {
        it('it should pass if DesignHome.masterData match the result', function () {
            expect(DesignHome.masterData).toEqual({
                "content": {
                    "carouselImages": [],
                    "description": '<p>&nbsp;<br></p>',
                    "rssUrl": "",
                    "type": ""
                },
                "design": {
                    "itemListLayout": "",
                    "itemListBgImage": "",
                    "itemDetailsBgImage": ""
                }
            });
        });
    });
    describe('Variable Unit: DesignHome.data', function () {
        it('it should pass if DesignHome.data match the result', function () {
            expect(DesignHome.data).toEqual({
                "content": {
                    "carouselImages": [],
                    "description": '<p>&nbsp;<br></p>',
                    "rssUrl": "",
                    "type": ""
                },
                "design": {
                    "itemListLayout": "",
                    "itemListBgImage": "",
                    "itemDetailsBgImage": ""
                }
            });
        });
    });
    describe('Variable Unit: DesignHome.layouts', function () {
        it('it should pass if DesignHome.layouts match the result', function () {
            expect(DesignHome.layouts).toEqual({
                listLayouts: [
                    {name: "List_Layout_1"},
                    {name: "List_Layout_2"},
                    {name: "List_Layout_3"},
                    {name: "List_Layout_4"}
                ]
            });
        });
    });


    describe('Function :DesignHome.changeListLayout', function () {
        it('DesignHome.changeListLayout should exist and be a function', function () {
            expect(typeof DesignHome.changeListLayout).toEqual('function');
        });
        it('it should pass if DesignHome.data.design.itemListLayout is equals to "List_Layout_4" after passing parameter "List_Layout_4" to DesignHome.changeListLayout', function () {
            DesignHome.changeListLayout('List_Layout_4');
            $rootScope.$digest();
            expect(DesignHome.data.design.itemListLayout).toEqual('List_Layout_4');
        });
    });

    describe('Function :DesignHome.addItemDetailsBackgroundImage', function () {
        it('DesignHome.addItemDetailsBackgroundImage should exist and be a function', function () {
            expect(typeof DesignHome.addItemDetailsBackgroundImage).toEqual('function');
        });
        it('it should Fail after DesignHome.addItemDetailsBackgroundImage function call', function () {
            ImageLibrary.showDialog.and.callFake(function () {
                var deferred = q.defer();
                deferred.reject({
                    code: STATUS_CODE.UNDEFINED_OPTIONS,
                    message: STATUS_MESSAGES.UNDEFINED_OPTIONS
                });
                return deferred.promise;
            });
            DesignHome.addItemDetailsBackgroundImage();
            $rootScope.$digest();
            expect(DesignHome.data.design.itemDetailsBgImage).toEqual('');
        });
        it('it should pass if DesignHome.data.design.itemDetailsBgImage is match the result after DesignHome.addItemDetailsBackgroundImage function call', function () {
            ImageLibrary.showDialog.and.callFake(function () {
                var deferred = q.defer();
                deferred.resolve({
                    "selectedFiles": ["https://imagelibserver.s3.amazonaws.com/25935164-2add-11e5-9d04-02f7ca55c361/950a50c0-400a-11e5-9af5-3f5e0d725ccb.jpg"],
                    "selectedIcons": []
                });
                return deferred.promise;
            });
            DesignHome.addItemDetailsBackgroundImage();
            $rootScope.$digest();
            expect(DesignHome.data.design.itemDetailsBgImage).toEqual('https://imagelibserver.s3.amazonaws.com/25935164-2add-11e5-9d04-02f7ca55c361/950a50c0-400a-11e5-9af5-3f5e0d725ccb.jpg');
        });
    });

    describe('Function :DesignHome.removeItemDetailsBackgroundImage', function () {
        it('DesignHome.removeItemDetailsBackgroundImage should exist and be a function', function () {
            expect(typeof DesignHome.removeItemDetailsBackgroundImage).toEqual('function');
        });
        it('it should pass if DesignHome.data.design.itemDetailsBgImage is equals to null after function DesignHome.removeItemDetailsBackgroundImage call', function () {
            DesignHome.removeItemDetailsBackgroundImage();
            $rootScope.$digest();
            expect(DesignHome.data.design.itemDetailsBgImage).toEqual(null);
        });
    });

    describe('Function :DesignHome.addItemListBackgroundImage', function () {
        it('DesignHome.addItemListBackgroundImage should exist and be a function', function () {
            expect(typeof DesignHome.addItemListBackgroundImage).toEqual('function');
        });
        it('it should Fail after DesignHome.addItemListBackgroundImage function call', function () {
            ImageLibrary.showDialog.and.callFake(function () {
                var deferred = q.defer();
                deferred.reject({
                    code: STATUS_CODE.UNDEFINED_OPTIONS,
                    message: STATUS_MESSAGES.UNDEFINED_OPTIONS
                });
                return deferred.promise;
            });
            DesignHome.addItemListBackgroundImage();
            $rootScope.$digest();
            expect(DesignHome.data.design.itemListBgImage).toEqual('');
        });
        it('it should pass if DesignHome.data.design.itemDetailsBgImage is match the result after DesignHome.addItemListBackgroundImage function call', function () {
            ImageLibrary.showDialog.and.callFake(function () {
                var deferred = q.defer();
                deferred.resolve({
                    "selectedFiles": ["https://imagelibserver.s3.amazonaws.com/25935164-2add-11e5-9d04-02f7ca55c361/950a50c0-400a-11e5-9af5-3f5e0d725ccb.jpg"],
                    "selectedIcons": []
                });
                return deferred.promise;
            });
            DesignHome.addItemListBackgroundImage();
            $rootScope.$digest();
            expect(DesignHome.data.design.itemListBgImage).toEqual('https://imagelibserver.s3.amazonaws.com/25935164-2add-11e5-9d04-02f7ca55c361/950a50c0-400a-11e5-9af5-3f5e0d725ccb.jpg');
        });
    });

    describe('Function :DesignHome.removeItemListBackgroundImage', function () {
        it('DesignHome.removeItemListBackgroundImage should exist and be a function', function () {
            expect(typeof DesignHome.removeItemListBackgroundImage).toEqual('function');
        });
        it('it should pass if  DesignHome.data.design.itemListBgImage is equals to null after function DesignHome.removeItemListBackgroundImage call', function () {
            DesignHome.removeItemListBackgroundImage();
            $rootScope.$digest();
            expect(DesignHome.data.design.itemListBgImage).toEqual(null);
        })
    });

})
;
