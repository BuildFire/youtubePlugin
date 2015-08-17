'use strict';

(function (angular) {
  angular
    .module('youtubePluginContent')
    .controller('RemoveImagePopupCtrl', ['$scope', '$modalInstance', 'imageInfo', function ($scope, $modalInstance, imageInfo) {
      var RemoveImagePopup = this;
      if(imageInfo){
        RemoveImagePopup.imageInfo = imageInfo;
      }
      $scope.ok = function () {
        $modalInstance.close('yes');
      };
      $scope.cancel = function () {
        $modalInstance.dismiss('No');
      };
    }])
})(window.angular);
