describe('Unit : youtubePlugin content.home.controller.js', function () {
    var scope, $rootScope, $controller, Buildfire, ActionItems, TAG_NAMES, STATUS_CODE, STATUS_MESSAGES, CONTENT_TYPE, q;
    beforeEach(module('youtubePluginContent'));

    beforeEach(inject(function (_$rootScope_, _$q_, _$controller_, _Buildfire_, _TAG_NAMES_, _STATUS_CODE_, _STATUS_MESSAGES_, _CONTENT_TYPE_) {
        $rootScope = _$rootScope_;
        q = _$q_;
        scope = $rootScope.$new();
        $controller = _$controller_;
        Buildfire = _Buildfire_;
        TAG_NAMES = _TAG_NAMES_;
        STATUS_CODE = _STATUS_CODE_;
        STATUS_MESSAGES = _STATUS_MESSAGES_;
        CONTENT_TYPE = _CONTENT_TYPE_;
        ActionItems = jasmine.createSpyObj('ActionItems', ['showDialog']);
    }));

    beforeEach(function () {
        ContentHome = $controller('ContentHomeCtrl', {
            $scope: scope,
            $q: q,
            Buildfire: Buildfire,
            TAG_NAMES: TAG_NAMES,
            ActionItems: ActionItems,
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
                content: {
                    images: [],
                    description: '<p><br data-mce-bogus="1"></p>',
                    rssUrl: '',
                    type: ''
                },
                design: {
                    itemListLayout: '',
                    itemListBgImage: '',
                    itemDetailsBgImage: ''
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
        it('it should pass if ContentHome.data is match the result', function () {
            expect(ContentHome.data).toEqual({
                content: {
                    images: [],
                    description: '<p><br data-mce-bogus="1"></p>',
                    rssUrl: '',
                    type: ''
                },
                design: {
                    itemListLayout: '',
                    itemListBgImage: '',
                    itemDetailsBgImage: ''
                }
            });
        });
    });

    describe('Function :ContentHome.addActionForImage', function () {
        it('ContentHome.addActionForImage should exist and be a function', function () {
            expect(typeof ContentHome.addActionForImage).toEqual('function');
        });
        it('it should Fail after ContentHome.addActionForImage function call', function () {
            ActionItems.showDialog.and.callFake(function () {
                var deferred = q.defer();
                deferred.reject({
                    code: STATUS_CODE.UNDEFINED_DATA,
                    message: STATUS_MESSAGES.UNDEFINED_DATA
                });
                return deferred.promise;
            });
            var index = 0;
            ContentHome.data.content.images[index] = {
                action: null,
                imageUrl: "https://imagelibserver.s3.amazonaws.com/25935164-2add-11e5-9d04-02f7ca55c361/950a50c0-400a-11e5-9af5-3f5e0d725ccb.jpg",
                link: "",
                target: "",
                title: "456"
            };
            ContentHome.addActionForImage(index);
            $rootScope.$digest();
            expect(ContentHome.data.content.images[index].action).toEqual(null);
        });
        it('it should pass after ContentHome.addActionForImage function call', function () {
            ActionItems.showDialog.and.callFake(function () {
                var deferred = q.defer();
                deferred.resolve({
                    action: "linkToApp",
                    deepLinkUrl: "https://www.facebook.com/photo.php?fbid=919186044777018&set=a.147969041898726.25954.100000568920267&type=1&theater",
                    title: "Facebook"
                });
                return deferred.promise;
            });
            var index = 1;
            ContentHome.data.content.images[index] = {
                action: null,
                imageUrl: "https://imagelibserver.s3.amazonaws.com/25935164-2add-11e5-9d04-02f7ca55c361/950a50c0-400a-11e5-9af5-3f5e0d725ccb.jpg",
                link: "",
                target: "",
                title: "456"
            };
            ContentHome.addActionForImage(index);
            $rootScope.$digest();
            expect(ContentHome.data.content.images[index].action).toEqual({
                action: "linkToApp",
                deepLinkUrl: "https://www.facebook.com/photo.php?fbid=919186044777018&set=a.147969041898726.25954.100000568920267&type=1&theater",
                title: "Facebook"
            });
        });
    });

    describe('Function : ContentHome.editActionForImage', function () {
        it(' ContentHome.editActionForImage should exist and be a function', function () {
            expect(typeof  ContentHome.editActionForImage).toEqual('function');
        });
        it('it should Fail after  ContentHome.editActionForImage function call', function () {
            ActionItems.showDialog.and.callFake(function () {
                var deferred = q.defer();
                deferred.reject({
                    code: STATUS_CODE.UNDEFINED_DATA,
                    message: STATUS_MESSAGES.UNDEFINED_DATA
                });
                return deferred.promise;
            });
            var index = 0, action='linkToApp';
            ContentHome.data.content.images[index] = {
                action: {
                    action: "linkToApp",
                    deepLinkUrl: "https://www.facebook.com/photo.php?fbid=919186044777018&set=a.147969041898726.25954.100000568920267&type=1&theater",
                    title: "Facebook"
                },
                imageUrl: "https://imagelibserver.s3.amazonaws.com/25935164-2add-11e5-9d04-02f7ca55c361/950a50c0-400a-11e5-9af5-3f5e0d725ccb.jpg",
                link: "",
                target: "",
                title: "456"
            };
            ContentHome.editActionForImage(action, index);
            $rootScope.$digest();
            expect(ContentHome.data.content.images[index].action).toEqual({
                action: "linkToApp",
                deepLinkUrl: "https://www.facebook.com/photo.php?fbid=919186044777018&set=a.147969041898726.25954.100000568920267&type=1&theater",
                title: "Facebook"
            });
        });
        it('it should pass after  ContentHome.editActionForImage function call', function () {
            ActionItems.showDialog.and.callFake(function () {
                var deferred = q.defer();
                deferred.resolve({
                    action: "linkToSocialGoogle",
                    title: "Google",
                    url: "https://plus.google.com/u/2/101180567076806428698/photos/photo/6072539713203294850?pid=6072539713203294850&oid=101180567076806428698"
                });
                return deferred.promise;
            });
            var index = 0, action = 'linkToApp';
            ContentHome.data.content.images[index] = {
                action: {
                    action: "linkToApp",
                    deepLinkUrl: "https://www.facebook.com/photo.php?fbid=919186044777018&set=a.147969041898726.25954.100000568920267&type=1&theater",
                    title: "Facebook"
                },
                imageUrl: "https://imagelibserver.s3.amazonaws.com/25935164-2add-11e5-9d04-02f7ca55c361/950a50c0-400a-11e5-9af5-3f5e0d725ccb.jpg",
                link: "",
                target: "",
                title: "456"
            };
            ContentHome.editActionForImage(action, index);
            $rootScope.$digest();
            expect(ContentHome.data.content.images[index].action).toEqual({
                action: "linkToSocialGoogle",
                title: "Google",
                url: "https://plus.google.com/u/2/101180567076806428698/photos/photo/6072539713203294850?pid=6072539713203294850&oid=101180567076806428698"
            });
        });
    });
});
