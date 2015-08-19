'use strict';

(function (angular) {
  angular
    .module('youtubePluginContent')
    .controller('RemoveImagePopupCtrl', ['$modalInstance', 'imageInfo', function ($modalInstance, imageInfo) {
      var RemoveImagePopup = this;
      if(imageInfo){
        RemoveImagePopup.imageInfo = imageInfo;
      }
        RemoveImagePopup.ok = function () {
        $modalInstance.close('yes');
      };
        RemoveImagePopup.cancel = function () {
        $modalInstance.dismiss('No');
      };
    }])
})(window.angular);
