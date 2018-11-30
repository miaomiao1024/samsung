var mainApp = angular.module('mainApp',['ngRoute','ngResource','tm.pagination']);
mainApp
    .controller('userHistoryController',function ($scope,$route) {
        $scope.$route = $route;
    })
    .controller('replicationController',function ($scope,$route) {
        $scope.$route = $route;
    })
    .controller('createController',function ($scope,$route) {
        $scope.$route = $route;
    });

mainApp.config(["$locationProvider",'$routeProvider', function ($locationProvider,$routeProvider) {
    $locationProvider.hashPrefix('');
    $routeProvider.
    when('/index', {
        templateUrl: 'index.html',
        controller: 'mainCtrl'
    }).
    when('/organization', {
        templateUrl: 'organization.html',
        controller: 'mainCtrl'
        }).
    when('/userHistory', {
        templateUrl: 'userHistory.html',
        controller: 'mainCtrl'
        }).
    when('/replication', {
        templateUrl: 'replication.html',
        controller: 'mainCtrl'
        }).
    when('/repo', {
        templateUrl: 'repo.html',
        controller: 'mainCtrl'
    }).
    when('/repoDetails', {
        templateUrl: 'repoDetails.html',
        controller: 'mainCtrl'
    }).
    when('/createRepo', {
        templateUrl: 'createRepo.html',
        controller: 'mainCtrl'
    }).
    when('/createOrgan', {
        templateUrl: 'createOrgan.html',
        controller: 'mainCtrl'
    }).
    when('/createReplication', {
        templateUrl: 'createReplication.html',
        controller: 'mainCtrl'
    }).
    when('/changePassword', {
        templateUrl: 'changePassword.html',
        controller: 'mainCtrl'
    }).
    when('/userProfile', {
        templateUrl: 'userProfile.html',
        controller: 'mainCtrl'
    }).
    when('/help', {
        templateUrl: 'help.html',
        controller: 'mainCtrl'
    }).
    when('/createTeam', {
        templateUrl: 'createTeam.html',
        controller: 'mainCtrl'
    }).
    when('/createAccounts', {
        templateUrl: 'createAccounts.html',
        controller: 'mainCtrl'
    }).
    when('/accounts', {
        templateUrl: 'accounts.html',
        controller: 'mainCtrl'
    });

    if($.cookie("isAdmin") == true){
        console.log("系统权限跳转");
        $routeProvider
            .otherwise({
                redirectTo:"/accounts"
            });
    }else{
        console.log("用户权限跳转");
        $routeProvider
            .otherwise({
                redirectTo:"/index"
            });
    }


    }]);


mainApp.controller('mainCtrl',function($scope,$location,$resource){  //页面的控制函数；
    $scope.$location = $location;//路由跳转；
    $scope.locationUrl = "https://registry-srcb-test.samsungcloud.org";


    /*============Menu鼠标移入/出动画效果===============*/
    var href  = window.location.hash;//获取或设置页面的标签值
    var hrefClass = href.substring(2,href.length);//提取字符串中介于两个指定下标之间的字符
    console.log(hrefClass);
    //var hrefClass=hrefClass.replace("/","");
    $("#"+hrefClass).css("background","#225081");
    $("#"+hrefClass).siblings().css("background","");


    $scope.visibleBtn = false;//repo界面控制按钮显示情况；
    //读取cookie
    $scope.cookieToken = $.cookie("token");
    $scope.cookieToken = "Bearer "+$.cookie("token");
    $scope.userNamespace = $.cookie("name");//登陆用户名

    /*获取Organizations信息*/
    $scope.get_organization_info = function(){
       var getOrganizationInfo = $resource($scope.locationUrl+"/api/v1/accounts/"+$scope.userNamespace+"/organizations") ;
        getOrganizationInfo.get(function (resp) {
            $scope.organizationName = resp.organizations;
            if(resp.organizations.length == "0"){
                $scope.tipOrganization = true;
            }
        },function (err) {
            console.log(err);
        })
    };
    /*$scope.get_organization_info = function(){
        $.ajax({
            url:$scope.locationUrl+"/api/v1/accounts/"+$scope.userNamespace+"/organizations",
            contentType: "application/json; charset=utf-8",
            dataType:"json",
            async: false,
            type:"GET",
            beforeSend: function(request) {
                request.setRequestHeader("Authorization", $scope.cookieToken);
            },
            success:function(msg) {
                $scope.organizationName = msg.organizations;
                if(msg.organizations.length == "0"){
                    $scope.tipOrganization = true;
                }
            },
            error:function () {
                console.log("获取organization失败！");
            }
        });

    };*/




});