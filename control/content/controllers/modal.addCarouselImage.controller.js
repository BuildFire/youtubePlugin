'use strict';

(function (angular) {
    angular
        .module('youtubePluginContent')
        .controller('AddCarouselImagePopupCtrl', ['$scope', '$modalInstance', 'Buildfire', function ($scope, $modalInstance, Buildfire) {
            var AddCarouselImagePopup = this;
            AddCarouselImagePopup.imageInfo = {
                imageUrl: '',
                title: '',
                link: '',
                target: ''
            };
            AddCarouselImagePopup.selectedAction = {name: 'same', value: "Same Window"};
            AddCarouselImagePopup.actionMenus = [
                {name: 'same', value: "Same Window"},
                {name: 'new', value: "New Window"}
            ];
            AddCarouselImagePopup.setTarget = function (action) {
                AddCarouselImagePopup.selectedAction = action;
            };
            AddCarouselImagePopup.ok = function (imageInfo) {
                if (!imageInfo.imageUrl) {
                    return;
                }
                if (imageInfo.link) {
                    switch (AddCarouselImagePopup.selectedAction.name) {
                        case "new":
                            imageInfo.target = '_blank';
                            break;
                        default :
                            imageInfo.target = '_self';
                            break;
                    }
                }
                $modalInstance.close(imageInfo);
            };
            AddCarouselImagePopup.cancel = function () {
                $modalInstance.dismiss('You have canceled.');
            };
            var options = {showIcons: false, multiSelection: false};
            var callback = function (error, result) {
                if (error) {
                    console.error('Error:', error);
                } else {
                    AddCarouselImagePopup.imageInfo.imageUrl = result.selectedFiles && result.selectedFiles[0] || null;
                    $scope.$digest();
                }
            };

            AddCarouselImagePopup.selectImage = function () {
                Buildfire.imageLib.showDialog(options, callback);
            };
            AddCarouselImagePopup.removeImage = function () {
                AddCarouselImagePopup.imageInfo.imageUrl = null;
            };

        }])
})(window.angular);
