'use strict';

(function (angular) {
    angular
        .module('youtubePluginWidget')
        .controller('NoInternetFoundCtrl', ['$scope', '$modalInstance',
            function ($scope, $modalInstance, eventsManualData) {
                var NoInternetFound = this;
                NoInternetFound.ok = function () {
                    $modalInstance.close('yes');
                };
                NoInternetFound.cancel = function () {
                    $modalInstance.dismiss('No');
                };
            }]);
})(window.angular);
