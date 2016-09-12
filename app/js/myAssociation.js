app.controller('MyAssociation', ['$scope', '$resource', 'Session', '$location', 'ngDialog', '$colorThief', 'Upload', 'fileUpload', '$loadingOverlay', function($scope, $resource, Session, $location, ngDialog, $colorThief, Upload, fileUpload, $loadingOverlay) {
  var Association = $resource('https://api.thomasmorel.io/association/:id?token=:token', null, {
  'update': { method:'PUT' }
});

  if(Session.getToken() == null || Session.getAssociation() == null){
    $location.path('/login')
  }

  $scope.isActive = function (viewLocation) {
    return viewLocation === $location.path();
};

  function distance(v1, v2){
      var i, d = 0;
      for (i = 0; i < v1.length; i++) {
          d += (v1[i] - v2[i])*(v1[i] - v2[i]);
      }
      return Math.sqrt(d);
  };

    $scope.$watch('coverPicture', function() {
      if ($scope.coverPicture && $scope.coverPicture != $scope.oldAssociation.coverPicture){

        var preview = document.querySelector('coverPicture');
        var file    = $scope.coverPicture
        var reader  = new FileReader();

        $("#img").on('load',function(){
          if ($scope.coverPicture && $scope.coverPicture != $scope.oldAssociation.coverPicture){
            var colorThief = new ColorThief()
            var palette = colorThief.getPalette(preview, 5, 1);
            $scope.$apply(function (){
              $scope.palette = palette
              $scope.selectColor(1)
            });
          }
        });

        reader.onloadend = function () {
          preview.src = reader.result
        }

        if (file) {
          reader.readAsDataURL(file);
        }
      }
    });

    $scope.$watch('profilePicture', function() {
      if ($scope.profilePicture && $scope.profilePicture != $scope.oldAssociation.profilePicture){

        var preview = document.querySelector('profilePicture');
        var file    = $scope.profilePicture
        var reader  = new FileReader();

        $("#img").on('load',function(){
          if ($scope.profilePicture && $scope.profilePicture != $scope.oldAssociation.profilePicture){
            var colorThief = new ColorThief()
            var palette = colorThief.getPalette(preview, 5, 1);
            $scope.$apply(function (){
              $scope.palette = palette
              $scope.selectColor(1)
            });
          }
        });

        reader.onloadend = function () {
          preview.src = reader.result
        }

        if (file) {
          reader.readAsDataURL(file);
        }
      }
    });

     $scope.selectColor = function(radio){
       var bgColor, fgColor = []
       bgColor = $scope.palette[radio]
       var d1 = distance(bgColor, [51,51,51])
       var d2 = distance(bgColor, [255,255,255])
       fgColor = (d1 > d2 ? [51,51,51] : [255,255,255])
       $scope.currentAssociation.bgColor = rgbToHex(bgColor[0],bgColor[1],bgColor[2])
       $scope.currentAssociation.fgColor = rgbToHex(fgColor[0],fgColor[1],fgColor[2])
     }

     $scope.removeCoverPicture = function(){
       $scope.file = null
       $scope.palette = null
     }

     $scope.removeProfilePicture = function(){
       $scope.profilePicture = null
     }

    function rgbToHex(r, g, b) {
        return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

  Association.get({id:Session.getAssociation(), token:Session.getToken()}, function(assos) {
    $scope.profilePicture = 'https://cdn.thomasmorel.io/' + assos.profilePicture
    assos.profilePicture = 'https://cdn.thomasmorel.io/' + assos.profilePicture
    $scope.coverPicture = 'https://cdn.thomasmorel.io/' + assos.coverPicture
    assos.coverPicture = 'https://cdn.thomasmorel.io/' + assos.coverPicture
    $scope.oldAssociation = assos
    $scope.currentAssociation = assos
  }, function(error) {
      Session.destroyCredentials()
      $location.path('/login')
  });

  $scope.updateAssociation = function() {
    $loadingOverlay.show()
    $("html, body").animate({ scrollTop: 0 }, "slow");
    Association.update({id:Session.getAssociation(), token:Session.getToken()}, $scope.currentAssociation, function(assos) {
      if($scope.coverPicture != $scope.oldAssociation.coverPicture){
        var file = $scope.coverPicture;
        var uploadUrl = 'https://api.thomasmorel.io/association/' + $scope.currentAssociation.ID + '/image?token=' + Session.getToken();
        $scope.promise = fileUpload.uploadFileToUrl(file, uploadUrl, function(success){
          $loadingOverlay.hide()
          if(success){
            ngDialog.open({
                template: "<h2 style='text-align:center;'>L'association a bien été mise à jour</h2>",
                plain: true,
                className: 'ngdialog-theme-default'
            });
          }else{
            ngDialog.open({
                template: "<h2 style='text-align:center;'>Une erreur s'est produite :/</h2>",
                plain: true,
                className: 'ngdialog-theme-default'
            });
          }
        });
      }
      if($scope.profilePicture != $scope.oldAssociation.profilePicture){
        var file = $scope.profilePicture;
        var uploadUrl = 'https://api.thomasmorel.io/association/' + $scope.currentAssociation.ID + '/image?token=' + Session.getToken();
        $scope.promise = fileUpload.uploadFileToUrl(file, uploadUrl, function(success){
          $loadingOverlay.hide()
          if(success){
            ngDialog.open({
                template: "<h2 style='text-align:center;'>L'association a bien été mise à jour</h2>",
                plain: true,
                className: 'ngdialog-theme-default'
            });
          }else{
            ngDialog.open({
                template: "<h2 style='text-align:center;'>Une erreur s'est produite :/</h2>",
                plain: true,
                className: 'ngdialog-theme-default'
            });
          }
        });
      }else{
        $loadingOverlay.hide()
        ngDialog.open({
            template: "<h2 style='text-align:center;'>L'association a bien été mise à jour</h2>",
            plain: true,
            className: 'ngdialog-theme-default'
        });
      }
    }, function(error) {
        Session.destroyCredentials()
        $location.path('/login')
    });
  }

}]);
