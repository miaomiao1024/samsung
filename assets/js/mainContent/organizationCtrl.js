mainApp.controller('organizationController',function ($scope,$route){
    $scope.$route = $route;
    var token = $scope.cookieToken;
    //获取用户信息organizations
    $scope.get_organization_info();
    /*==============鼠标经过动态变化================*/
    $scope.fadeSiblings = function(item){
        $scope.divOverOrgIndex = item;
    };
    $scope.reSiblings = function(){
        $scope.divOverOrgIndex = 1024;
    };
    $('.rightButton').hover(function(){
            $(this).addClass('divBtn');

        },function(){
            //鼠标离开时移除创建按钮divOver样式
            $(this).removeClass('divBtn');
        }
    );

    /*跳转至repo界面时为name赋初值*/
    $scope.jumpRepo = function(org){
        //$rootScope.organization_namespace = org.name;
        //存入--
        sessionStorage.removeItem('creator');
        sessionStorage.setItem('creator',org.creator);


        //$rootScope.organization_creator = org.creator;
        //先删除之前存入的name
        sessionStorage.removeItem('name');
        //将重新选中值存入sessionStroage
        sessionStorage.setItem('name',org.name);
        location.href="#repo";
    };





/*
创建organization
 */
    /*约束name的输入值*/
    $('#createOrganizationName').on('input', function () {
        $("#createOrganizationForm-create-button").attr("disabled", true);
        $("#createOrganizationForm-name-warning").empty();
        $("#createOrganizationForm-create-button").attr("disabled", false);
    });
    /*创建organization*/
    $scope.createOrganization = function () {
        $scope.createOrganizationName = $("#createOrganizationName").val();
        //$scope.createOrganizationFullName = $("#createOrganizationFullName").val();//允许用户输入但不传入
        $scope.createOrganizationCompany = $("#createOrganizationCompany").val();
        $scope.createOrganizationLocation = $("#createOrganizationLocation").val();
        $scope.createOrganizationEmail = $("#createOrganizationEmail").val();
        $scope.createOrganizationWebsite = $("#createOrganizationWebsite").val();
        console.log($scope.createOrganizationName);
        var jsonDate = JSON.stringify({
            "name":$scope.createOrganizationName,
            "creator":$scope.userNamespace,
            "companyName":$scope.createOrganizationCompany,
            "location":$scope.createOrganizationLocation,
            "email":$scope.createOrganizationEmail,
            "website":$scope.createOrganizationWebsite,
        });
        console.log(jsonDate);
        $.ajax({
            url:$scope.locationUrl+"/api/v1/organizations",
            data:jsonDate,
            contentType: "application/json; charset=utf-8",
            async: false,
            type:"POST",
            beforeSend: function(request) {
                request.setRequestHeader("Authorization", token);
            },
            success:function() {
                location.href="#organization";
            },
            error:function(){
                alert("New failure！");
            }
        });
    }





});