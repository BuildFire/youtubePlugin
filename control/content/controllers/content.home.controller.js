'use strict';

(function (angular, window) {
  angular
    .module('youtubePluginContent')
    .controller('ContentHomeCtrl', ['$scope',
      function ($scope) {
          /*
           * Go pull any previously saved data
           * */
          buildfire.datastore.get(function (err, result) {
            if (result) {
              $scope.data = result.data;
              $scope.id = result.id;
              $scope.$digest();
              if (tmrDelay)clearTimeout(tmrDelay);
            }
            /*
             * watch for changes in data and trigger the saveDataWithDelay function on change
             * */
            $scope.$watch('data', saveDataWithDelay, true);
          });

          /*
           * Call the datastore to save the data object
           */
          var saveData = function (newObj) {

            if (newObj == undefined)return;
            if ($scope.frmMain.$invalid) {
              console.warn('invalid data, no save');
              return;
            }

            buildfire.datastore.save(newObj, function (err, result) {
              if (err || !result)
                alert(JSON.stringify(err));
              else
                console.log('data saved');
            });
          };

          /*
           * create an artificial delay so api isnt called on every character entered
           * */
          var tmrDelay = null;
          var saveDataWithDelay = function (newObj,oldObj) {
            if(newObj == oldObj)
              return;
            if (tmrDelay)clearTimeout(tmrDelay);
            tmrDelay = setTimeout(function () {
              saveData(newObj);
            }, 500);
          };

          /*
           * this is a way you can update only one property without sending the entire object
           * */
          $scope.approve = function () {
            if ($scope.id)
              buildfire.datastore.update($scope.id, {$set: {"content.approvedOn": new Date()}});
          };


          /*
           * Open Image Lib
           */
          $scope.openImageLib = function () {
            buildfire.imageLib.showDialog({showIcons: false, multiSelection: false}, function (error, result) {
              if (result && result.selectedFiles && result.selectedFiles.length > 0) {
                $scope.data.content.bgURL = result.selectedFiles[0];
                $scope.$apply();
              }
            });
          };

          /*
           * Open action dialog
           */
          $scope.openActionDialog = function () {
            var actionItem = {
              title: "build fire",
              "url": "https://www.facebook.com/buildfireapps",
              action: "linkToWeb",
              openIn: "browser",
              actionName: "Link to Web Content"
            };
            var options = {showIcon: true};
            buildfire.actionItems.showDialog(null, options, function (err, actionItem) {
              if (err)
                console.log(err);
              else {
                debugger;
                if (!$scope.data.actionItems)
                  $scope.data.actionItems = [];
                $scope.data.actionItems.push(actionItem);
                $scope.$apply();
              }

            });
          };

          $scope.resizeImage = function(url){
            if(!url)
              return "";
            else
              return buildfire.imageLib.resizeImage(url,{width:32});
          }
      }]);
})(window.angular, window);
