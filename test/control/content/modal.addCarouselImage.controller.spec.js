describe('Unit : youtubePlugin modal.addCarouselImage.controller', function () {
    var ImageLibrary, $rootScope, $controller, scope, AddCarouselImagePopup, modalInstance, q, STATUS_CODE, STATUS_MESSAGES;
    beforeEach(module('youtubePluginContent'));

    beforeEach(inject(function (_$rootScope_, _$controller_, _$q_, _STATUS_CODE_, _STATUS_MESSAGES_) {
        $rootScope = _$rootScope_;
        scope = $rootScope.$new();
        $controller = _$controller_;
        STATUS_CODE = _STATUS_CODE_;
        STATUS_MESSAGES = _STATUS_MESSAGES_;
        q = _$q_;
        ImageLibrary = jasmine.createSpyObj('ImageLibrary', ['showDialog']);
        modalInstance = {                    // Create a mock object using spies
            close: jasmine.createSpy('modalInstance.close'),
            dismiss: jasmine.createSpy('modalInstance.dismiss'),
            result: {
                then: jasmine.createSpy('modalInstance.result.then')
            }
        };
    }));

    beforeEach(function () {
        AddCarouselImagePopup = $controller('AddCarouselImagePopupCtrl', {
            $modalInstance: modalInstance,
            ImageLibrary: ImageLibrary,
            $q: q
        });
    });

    describe('Units: units should be Defined', function () {
        it('it should pass if AddCarouselImagePopup is defined', function () {
            expect(AddCarouselImagePopup).not.toBeUndefined();
        });
        it('it should pass if ImageLibrary is defined', function () {
            expect(ImageLibrary).not.toBeUndefined();
        });
    });

    describe('Variable : AddCarouselImagePopup.imageInfo', function () {
        it('it should pass if AddCarouselImagePopup.imageInfo match the result', function () {
            expect(AddCarouselImagePopup.imageInfo).toEqual({
                imageUrl: '',
                title: '',
                link: '',
                target: '',
                action: null
            });
        });
    });
    describe('Variable : AddCarouselImagePopup.selectedAction', function () {
        it('it should pass if AddCarouselImagePopup.selectedAction match the result', function () {
            expect(AddCarouselImagePopup.selectedAction).toEqual({name: 'same', value: "Same Window"});
        });
    });
    describe('Variable : AddCarouselImagePopup.actionMenus', function () {
        it('it should pass if AddCarouselImagePopup.actionMenus match the result', function () {
            expect(AddCarouselImagePopup.actionMenus).toEqual([
                {name: 'same', value: "Same Window"},
                {name: 'new', value: "New Window"}
            ]);
        });
    });
    describe('Function : AddCarouselImagePopup.setTarget', function () {
        it('AddCarouselImagePopup.setTarget should exist and be a function', function () {
            expect(typeof AddCarouselImagePopup.setTarget).toEqual('function');
        });
        it('should pass after AddCarouselImagePopup.setTarget called successfully', function () {
            var selectedAction = {name: 'new', value: "New Window"};
            AddCarouselImagePopup.setTarget(selectedAction);
            $rootScope.$digest();
            expect(AddCarouselImagePopup.selectedAction).toEqual(selectedAction);
        });
    });
    describe('Function : AddCarouselImagePopup.ok ', function () {
        it('AddCarouselImagePopup.ok should exist and be a function', function () {
            expect(typeof AddCarouselImagePopup.ok).toEqual('function');
        });
        it('should fail after AddCarouselImagePopup.ok returned due to undefined "imageInfo"', function () {
            modalInstance.close.and.callFake(function (_imageInfo) {
                var deferred = q.defer();
                deferred.resolve(_imageInfo);
                return deferred.promise;
            });
            var imageInfo = {
                action: null,
                imageUrl: null,
                link: "https://www.facebook.com/SANDEEPCHHAPOLA",
                target: "",
                title: "Cool"
            };
            AddCarouselImagePopup.ok(imageInfo);
            $rootScope.$digest();
            expect(modalInstance.close).not.toHaveBeenCalled();
        });
        describe('AddCarouselImagePopup.ok switch coverage test', function () {
            beforeEach(function () {
                modalInstance.close.and.callFake(function (_imageInfo) {
                    var deferred = q.defer();
                    deferred.resolve(_imageInfo);
                    return deferred.promise;
                });
            });
            it('should covered switch first case', function () {
                AddCarouselImagePopup.selectedAction = {name: 'new', value: "New Window"};
                var imageInfo = {
                    action: null,
                    imageUrl: "https://imagelibserver.s3.amazonaws.com/25935164-2add-11e5-9d04-02f7ca55c361/950a50c0-400a-11e5-9af5-3f5e0d725ccb.jpg",
                    link: "https://www.facebook.com/SANDEEPCHHAPOLA",
                    target: "",
                    title: "Cool"
                };
                AddCarouselImagePopup.ok(imageInfo);
                $rootScope.$digest();
                expect(modalInstance.close).toHaveBeenCalledWith({
                    action: null,
                    imageUrl: "https://imagelibserver.s3.amazonaws.com/25935164-2add-11e5-9d04-02f7ca55c361/950a50c0-400a-11e5-9af5-3f5e0d725ccb.jpg",
                    link: "https://www.facebook.com/SANDEEPCHHAPOLA",
                    target: "_blank",
                    title: "Cool"
                });
            });
            it('should covered switch default case', function () {
                AddCarouselImagePopup.selectedAction = {name: 'same', value: "Same Window"};
                var imageInfo = {
                    action: null,
                    imageUrl: "https://imagelibserver.s3.amazonaws.com/25935164-2add-11e5-9d04-02f7ca55c361/950a50c0-400a-11e5-9af5-3f5e0d725ccb.jpg",
                    link: "https://www.facebook.com/SANDEEPCHHAPOLA",
                    target: "",
                    title: "Cool"
                };
                AddCarouselImagePopup.ok(imageInfo);
                $rootScope.$digest();
                expect(modalInstance.close).toHaveBeenCalledWith({
                    action: null,
                    imageUrl: "https://imagelibserver.s3.amazonaws.com/25935164-2add-11e5-9d04-02f7ca55c361/950a50c0-400a-11e5-9af5-3f5e0d725ccb.jpg",
                    link: "https://www.facebook.com/SANDEEPCHHAPOLA",
                    target: "_self",
                    title: "Cool"
                });
            });
        });
        it('should pass after AddCarouselImagePopup.ok called successfully', function () {
            modalInstance.close.and.callFake(function (_imageInfo) {
                var deferred = q.defer();
                deferred.resolve(_imageInfo);
                return deferred.promise;
            });
            var imageInfo = {
                action: null,
                imageUrl: "https://imagelibserver.s3.amazonaws.com/25935164-2add-11e5-9d04-02f7ca55c361/950a50c0-400a-11e5-9af5-3f5e0d725ccb.jpg",
                link: "",
                target: "",
                title: "Cool"
            };
            AddCarouselImagePopup.ok(imageInfo);
            $rootScope.$digest();
            expect(modalInstance.close).toHaveBeenCalledWith(imageInfo);
        });
    });
    describe('Function : AddCarouselImagePopup.cancel', function () {
        it('AddCarouselImagePopup.cancel should exist and be a function', function () {
            expect(typeof AddCarouselImagePopup.cancel).toEqual('function');
        });
        it('should pass after AddCarouselImagePopup.cancel called successfully', function () {
            modalInstance.dismiss.and.callFake(function (_info) {
                var deferred = q.defer();
                deferred.resolve(_info);
                return deferred.promise;
            });
            AddCarouselImagePopup.cancel();
            $rootScope.$digest();
            expect(modalInstance.dismiss).toHaveBeenCalled();
        });
    });
    describe('Function : AddCarouselImagePopup.selectImage', function () {
        it('AddCarouselImagePopup.selectImage should exist and be a function', function () {
            expect(typeof AddCarouselImagePopup.selectImage).toEqual('function');
        });

        it('it should Fail after  AddCarouselImagePopup.selectImage function call', function () {
            ImageLibrary.showDialog.and.callFake(function () {
                var deferred = q.defer();
                deferred.reject({
                    code: STATUS_CODE.UNDEFINED_OPTIONS,
                    message: STATUS_MESSAGES.UNDEFINED_OPTIONS
                });
                return deferred.promise;
            });
            AddCarouselImagePopup.imageInfo.imageUrl = '';
            AddCarouselImagePopup.selectImage();
            $rootScope.$digest();
            expect(AddCarouselImagePopup.imageInfo.imageUrl).toEqual('');
        });
        it('it should pass and set AddCarouselImagePopup.imageInfo.imageUrl to null after AddCarouselImagePopup.selectImage function call', function () {
            AddCarouselImagePopup.imageInfo.imageUrl = '';
            ImageLibrary.showDialog.and.callFake(function () {
                var deferred = q.defer();
                deferred.resolve({
                    "selectedFiles": [],
                    "selectedIcons": []
                });
                return deferred.promise;
            });
            AddCarouselImagePopup.selectImage();
            $rootScope.$digest();
            expect(AddCarouselImagePopup.imageInfo.imageUrl).toEqual(null);
        });
        it('it should pass if AddCarouselImagePopup.imageInfo.imageUrl is match the result after AddCarouselImagePopup.selectImage function call', function () {
            AddCarouselImagePopup.imageInfo.imageUrl = '';
            ImageLibrary.showDialog.and.callFake(function () {
                var deferred = q.defer();
                deferred.resolve({
                    "selectedFiles": ["https://imagelibserver.s3.amazonaws.com/25935164-2add-11e5-9d04-02f7ca55c361/950a50c0-400a-11e5-9af5-3f5e0d725ccb.jpg"],
                    "selectedIcons": []
                });
                return deferred.promise;
            });
            AddCarouselImagePopup.selectImage();
            $rootScope.$digest();
            expect(AddCarouselImagePopup.imageInfo.imageUrl).toEqual('https://imagelibserver.s3.amazonaws.com/25935164-2add-11e5-9d04-02f7ca55c361/950a50c0-400a-11e5-9af5-3f5e0d725ccb.jpg');
        });

    });
    describe('Function : AddCarouselImagePopup.removeImage', function () {
        it('AddCarouselImagePopup.removeImage should exist and be a function', function () {
            expect(typeof AddCarouselImagePopup.removeImage).toEqual('function');
        });
        it('should pass after AddCarouselImagePopup.removeImage called successfully', function () {
            AddCarouselImagePopup.imageInfo.imageUrl = "https://imagelibserver.s3.amazonaws.com/25935164-2add-11e5-9d04-02f7ca55c361/950a50c0-400a-11e5-9af5-3f5e0d725ccb.jpg";
            AddCarouselImagePopup.removeImage();
            $rootScope.$digest();
            expect(AddCarouselImagePopup.imageInfo.imageUrl).toEqual(null);
        });
    });
});