mainApp.controller('indexController',function ($scope,$resource,$route,$rootScope) {
    $scope.$route = $route;
    //初始存入---将选中值存入sessionStorage
    sessionStorage.setItem('name',$scope.userNamespace);
    $scope.tipIndex = false;
    $scope.paginationConf = {
        currentPage:0,//初始当前页码
        itemsPerPage:4,//初始每页显示多少条数据
        pagesLength:10,
        perPageOptions:[4,6,8,10,20],//选择每页显示多少条数据
        onChange: function () {
            var getDashboardRepos=$resource($scope.locationUrl+'/api/v1/repositories/'+$scope.userNamespace+"?page="+$scope.paginationConf.currentPage+"&size="+$scope.paginationConf.itemsPerPage);
            getDashboardRepos.get(function (resp) {
                if (resp.repositories.length){
                    $scope.paginationConf.totalItems = resp.total;
                    $scope.indexItem = resp.repositories;
                    $scope.organizationName = resp.repositories[0].namespace;
                } else {
                    $scope.organizationName=$scope.userNamespace;
                    $scope.tipIndex = true;
                }
            },function (err) {
                console.log(err);
            });
        }
    };
    $scope.paginationConf.onChange();
    /*==GET请求获取用户Repositories详情==*/
    $scope.tipIndex_search = false;
    /*==搜索功能==*/
    $scope.searchRepo = function () {
        if ($scope.searchInfo != ''){
            var getSearchRepo = $resource($scope.locationUrl+"/api/v1/repositories/"+$scope.userNamespace+"?page="+0+"&size="+99+"&search="+$scope.searchInfo);
            getSearchRepo.get(function (resp) {
                if (resp.repositories.length){
                    $scope.totalLength = resp.total;
                    $scope.indexItem = resp.repositories;
                } else {
                    $scope.indexItem = [];
                    $scope.tipIndex = true;
                    $scope.tipIndex_search = true;
                }
            },function (err) {
                console.log(err);
            });
        }
    };

    /*==GET获取org==*/
    var getDashboardOrg = $resource($scope.locationUrl+"/api/v1/accounts/"+$scope.userNamespace+"/organizations");
    getDashboardOrg.get(function (resp) {
        if (resp.organizations.length) {
            resp.organizations.unshift({"name":$scope.userNamespace});
            $scope.orgName = resp.organizations;
            sessionStorage.setItem('orgName',JSON.stringify(resp.organizations));
        }else {
            var Arr = [];
            Arr.push({"name":$scope.userNamespace});
            $scope.orgName = Arr;
            sessionStorage.setItem('orgName',JSON.stringify(resp.organizations));
        }
    },function (err) {
        console.log(err);
    });

     /*点击跳转到RopeDetail*/
    $scope.DashboardJumpRopeDetail = function(item){
        $rootScope.index_namespace = item.namespace;
        $rootScope.index_name = item.name;
        $rootScope.privateOrPublic = item.visibility;
        $rootScope.authority = true;//index界面显示的repo全部为admin权限；
        location.href = "#repoDetails";
    };

    /*==============鼠标经过动态变化flex-box================*/
    $scope.fadeSiblings = function(item){
        $scope.flexIndex = item;
    };
    $scope.reSiblings = function(){
        $scope.flexIndex = 1024;
    };
    $('.rightButton').hover(function(){
            $(this).addClass('divBtn');

        },function(){
            //鼠标离开时移除创建按钮divOver样式
            $(this).removeClass('divBtn');
        }
    );
    /*====================模拟下拉框=========================*/
    $('.select input').on('click',function(e){
        if($('.select .city').is('.hide')){
            $('.select .city').removeClass('hide');
            e.stopPropagation();
        }else{
            $('.select .city').addClass('hide');
        }
    });
    $('body').on('click',function(){
        $('.select .city').addClass('hide');
    });
    $scope.fadeOrg = function(item){
       $scope.orgIndex = item;
    };
    $scope.reOrg = function(){
        $scope.orgIndex = 1024;
    };


    /*====================repo.html=========================*/
    $scope.orgShow = function (org) {

        //console.log(org);
        sessionStorage.removeItem('creator');
        sessionStorage.setItem('creator',org.creator);

        //先删除之前存入的name
        sessionStorage.removeItem('name');
        //将重新选中值存入sessionStorage
        sessionStorage.setItem('name',org.name);
        $('.select .city').addClass('hide');

        if (org.name != $scope.userNamespace){
            location.href="#repo";
        }
        if (org.name == $scope.userNamespace) {
            location.href="#index";
        }
    };



    $scope.scrollWindow = function () {
        window.scrollTo(500,0);
    };

    $scope.reloadIndex = function () {
        window.location.reload()
    }


    /*$scope.getRepositories = function(page,size){
           $.ajax({
               url:$scope.locationUrl+"/api/v1/repositories/"+$scope.userNamespace+"?page="+page+"&size="+size,
               contentType: "application/json; charset=utf-8",
               async: false,
               type:"GET",
               beforeSend: function(request) {
                   request.setRequestHeader("Authorization", token);
               },
               success:function(msg) {
                   console.log("查看GET请求获取用户Repositories详情");
                   console.log(msg);
                   console.log(msg.repositories);
                   var item = msg;
                   $scope.indexItem = item.repositories;
                   $scope.totalLength = item.total;
                   if (item.repositories.length){
                       $scope.routeName = resp.repositories[0].namespace;
                       $scope.organizationName=$scope.routeName;
                   }else {
                       $scope.organizationName=$scope.userNamespace;
                       $scope.tipIndex = true;
                   }
               },
               error:function () {
                   console.log("获取失败！");
               }
           });
       };
       $scope.getRepositories(0,6);*/
    /*$scope.searchRepo = function(){
       $.ajax({
           url:$scope.locationUrl+"/api/v1/repositories/"+$scope.userNamespace+"?page="+0+"&size="+6+"&search="+$scope.searchInfo,
           contentType: "application/json; charset=utf-8",
           dataType:"text",
           async: false,
           type:"GET",
           beforeSend: function(request) {
               request.setRequestHeader("Authorization", token);
           },
           success:function(msg) {
               console.log(msg);
               var item = JSON.parse(msg);
               $scope.indexItem = item.repositories;
               $scope.totalLength = item.total;
               if (item.repositories.length){
                   $scope.routeName = item.repositories[0].namespace;
                   $scope.organizationName=$scope.routeName;
               }else {
                   $scope.organizationName=$scope.userNamespace;
                   $scope.tipIndex = true;
                   $scope.tipIndex_search = true;
               }
           },
           error:function () {
               console.log("获取失败！");
           }
       });


   };*/
    /*$scope.changeSize = function(){
        console.log($scope.selectedData);
        $scope.getRepositories(0,$scope.selectedData);
        $scope.option.curr = 1;
        $scope.option.all = Math.ceil($scope.totalLength/$scope.selectedData);
        console.log($scope.option.all);
    };*/
    /*$.ajax({
        url:$scope.locationUrl+"/api/v1/accounts/"+$scope.userNamespace+"/organizations",
        contentType: "application/json; charset=utf-8",
        dataType:"json",
        async: false,
        type:"GET",
        beforeSend: function(request) {
            request.setRequestHeader("Authorization", token);
        },
        success:function(msg) {
            if (msg.organizations.length){
                console.log("查看repo下返回的值：");
                console.log(msg.organizations[0]);
                console.log(msg.organizations[1]);
                msg.organizations.unshift({"name":$scope.userNamespace});
                $scope.orgName = msg.organizations;
                //将数组存入sessionStorage
                sessionStorage.setItem('orgName',JSON.stringify(msg.organizations));
            }else {
                var Arr = new Array();
                Arr.push({"name":$scope.userNamespace});
                $scope.orgName = Arr;

                //将数组存入sessionStorage
                sessionStorage.setItem('orgName',JSON.stringify(msg.organizations));
            }
        },
        error:function () {
            console.log("获取失败！");
        }
    });*/
    /*$scope.jumpCreateRepo = function(){
        //先删除之前存入的name
        sessionStorage.removeItem('name');
        //将重新选中值存入sessionStroage
        sessionStorage.setItem('name',$scope.userNamespace);
        location.href = "#createRepo";
    };
*/
    /*$scope.option = {
        curr: 1,  //当前页数
        all: Math.ceil($scope.totalLength/$scope.selectedData),  //总页数
        count: 10,  //最多显示的页数，默认为10
        //点击页数的回调函数，参数page为点击的页数
        click: function (page) {
            console.log(page);
            $scope.page = page -1;
            console.log($scope.selectedData);
            //这里可以写跳转到某个页面等...
            $scope.getRepositories($scope.page,$scope.selectedData);
        },
    };*/

});