describe('Unit : youtubePlugin modal.removeCarouselImage.controller', function () {
    var RemoveImagePopup, modalInstance, imageInfo, $controller, $rootScope, q;
    beforeEach(module('youtubePluginContent'));

    beforeEach(inject(function (_$controller_, _$rootScope_, _$q_) {
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        q = _$q_;
        imageInfo = {
            action: null,
            imageUrl: "https://imagelibserver.s3.amazonaws.com/25935164-2add-11e5-9d04-02f7ca55c361/950a50c0-400a-11e5-9af5-3f5e0d725ccb.jpg",
            link: "https://www.facebook.com/SANDEEPCHHAPOLA",
            target: "",
            title: "Cool"
        };
        modalInstance = {                    // Create a mock object using spies
            close: jasmine.createSpy('modalInstance.close'),
            dismiss: jasmine.createSpy('modalInstance.dismiss')
        };
    }));

    beforeEach(function () {
        RemoveImagePopup = $controller('RemoveImagePopupCtrl', {
            $modalInstance: modalInstance,
            imageInfo: imageInfo,
            $q: q
        });
    });
    describe('Variable:RemoveImagePopup ', function () {
        it('it should pass if RemoveImagePopup is defined', function () {
            expect(RemoveImagePopup).not.toBeUndefined();
        });
    });
    describe('Variable:RemoveImagePopup.imageInfo ', function () {
        it('it should pass if RemoveImagePopup.imageInfo match the result', function () {
            expect(RemoveImagePopup.imageInfo).toEqual(imageInfo);
        });
    });
    describe('Function : RemoveImagePopup.ok ', function () {
        it('RemoveImagePopup.ok should exist and be a function', function () {
            expect(typeof RemoveImagePopup.ok).toEqual('function');
        });
        it('should pass after RemoveImagePopup.ok function call', function () {
            modalInstance.close.and.callFake(function (_info) {
                var deferred = q.defer();
                deferred.resolve(_info);
                return deferred.promise;
            });
            RemoveImagePopup.ok();
            $rootScope.$digest();
            expect(modalInstance.close).toHaveBeenCalled();
        });
    });
    describe('Function : RemoveImagePopup.cancel ', function () {
        it('RemoveImagePopup.cancel should exist and be a function', function () {
            expect(typeof RemoveImagePopup.cancel).toEqual('function');
        });
        it('should pass after RemoveImagePopup.cancel function call', function () {
            modalInstance.dismiss.and.callFake(function (_info) {
                var deferred = q.defer();
                deferred.resolve(_info);
                return deferred.promise;
            });
            RemoveImagePopup.cancel();
            $rootScope.$digest();
            expect(modalInstance.dismiss).toHaveBeenCalled();
        });
    });
});