mainApp.controller('accountsCtrl',function ($scope,$resource,$route) {
    $scope.$route = $route;

    //获取用户信息
    $scope.tipIndex = false;
    $scope.paginationConf = {
        currentPage:0,//初始当前页码
        itemsPerPage:10,//初始每页显示多少条数据
        pagesLength:10,
        perPageOptions:[10,15,20,25,30],//选择每页显示多少条数据
        onChange: function () {
            var getAccountInfo=$resource($scope.locationUrl+'/api/v1/accounts/?page='+$scope.paginationConf.currentPage+"&size="+$scope.paginationConf.itemsPerPage);
            getAccountInfo.get(function (resp) {
                $scope.paginationConf.totalItems = resp.total;
                $scope.accountInfo = resp.accounts;
            },function (err) {
                console.log(err);
            });
        }
    };
    $scope.paginationConf.onChange();

    /*$scope.getAllAccounts = function () {
        var getAccountInfo = $resource($scope.locationUrl+"/api/v1/accounts");
        getAccountInfo.query(function (resp) {
            console.log(resp[0]);
            $scope.accountInfo = resp;
        },function (jqHXR) {
            console.log(jqHXR);
        });
    };
    $scope.getAllAccounts();*/

    $scope.deleteAccounts = function (item) {
        var deleteOneAccounts = $resource($scope.locationUrl+"/api/v1/accounts/:name",{name:'@name'});
        deleteOneAccounts.delete({},{name:item},function () {
            $scope.paginationConf.onChange();
        },function () {
            console.log("error");
        })

    };


    $scope.changeStates = function (name,state) {
        console.log(name);
        console.log(state);
        var stateEnd;
        if(state == true){
            stateEnd = 'deactivate';
        }else {
            stateEnd = 'activate';
        }
        $scope.dataName = {'name': name};
        var changeAccountsStates = $resource($scope.locationUrl+"/api/v1/accounts/:name/:UndeterminedState",{name:'@name',UndeterminedState:'@UndeterminedState'});
        changeAccountsStates.put({},{name:name,UndeterminedState:stateEnd},function () {
            $scope.paginationConf.onChange();
        },function () {
            console.log("error");
        });
    }






});