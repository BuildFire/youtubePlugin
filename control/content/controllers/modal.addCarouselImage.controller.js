'use strict';

(function (angular) {
    angular
        .module('youtubePluginContent')
        .controller('AddCarouselImagePopupCtrl', ['$modalInstance', 'ImageLibrary', function ($modalInstance, ImageLibrary) {
            var AddCarouselImagePopup = this;
            AddCarouselImagePopup.imageInfo = {
                imageUrl: '',
                title: '',
                link: '',
                target: '',
                action: null
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

            AddCarouselImagePopup.selectImage = function () {
                var options = {showIcons: false, multiSelection: false}
                    , success = function (result) {
                        AddCarouselImagePopup.imageInfo.imageUrl = result.selectedFiles && result.selectedFiles[0] || null;
                    }
                    , error = function (error) {
                        console.error('AddCarouselImagePopup Error:', error);
                    };
                ImageLibrary.showDialog(options).then(success, error);
            };
            AddCarouselImagePopup.removeImage = function () {
                AddCarouselImagePopup.imageInfo.imageUrl = null;
            };

        }])
})(window.angular);
