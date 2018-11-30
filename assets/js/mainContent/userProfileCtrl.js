mainApp.controller('userProfileController',function ($scope,$resource,$route,$rootScope) {
    $scope.$route = $route;
    var token = $scope.cookieToken;
    //获取用户信息
    $.ajax({
        url:$scope.locationUrl+"/api/v1/accounts/"+$scope.userNamespace,
        //contentType: "application/json; charset=utf-8",
        dataType:"json",
        async: false,
        type:"GET",
        beforeSend: function(request) {
            request.setRequestHeader("Authorization", token);
        },
        success:function(msg) {
            //console.log(msg[0]);isAdmin判断是否为超级用户
            $scope.userProfileName = msg[0].name;
            $scope.userProfileEmail = msg[0].email;
            $scope.userProfileCreateTime = msg[0].createTime;
        },
        error:function () {
            console.log("获取用户信息失败！");
        }
    });

    //获取用户信息organizations
    $scope.get_organization_info();
    /*跳转至repo界面时为name赋初值*/
    $scope.jumpRepo = function(org){
        console.log(org);
        //存入--
        sessionStorage.removeItem('creator');
        sessionStorage.setItem('creator',org.creator);
        //先删除之前存入的name
        sessionStorage.removeItem('name');
        //将重新选中值存入sessionStroage
        sessionStorage.setItem('name',org.name);
        location.href="#repo";
    };



});