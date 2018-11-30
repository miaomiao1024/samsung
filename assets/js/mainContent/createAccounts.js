mainApp.controller('createAccountsCtrl',function ($scope,$resource,$route) {
    $scope.$route = $route;

    //获取用户信息

    $scope.createAccounts = function () {

        console.log($scope.accountName);
        console.log($scope.accountPassword);
        console.log($scope.accountsEmail);
        console.log($scope.accountsActive);
        var jsonDate = JSON.stringify({
            "name":$scope.accountName,
            "password":$scope.accountPassword,
            "email":$scope.accountsEmail,
            "isActive":$scope.accountsActive,
        });
        console.log(jsonDate);

        var createAccountsInfo = $resource($scope.locationUrl+"/api/v1/accounts");
        createAccountsInfo.save({},jsonDate,function () {
            location.href="#accounts";
        },function () {
            console.log("error");
        });
    }




});