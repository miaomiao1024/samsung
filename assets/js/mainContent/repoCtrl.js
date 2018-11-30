mainApp.controller('repoController',function ($scope,$resource,$route,$rootScope) {

    var token = $scope.cookieToken;
    //读取浏览器sessionStorage存储的name//从Organization页面跳转显示下拉列表对应的name
    $scope.organizationName = sessionStorage.getItem("name");

    //取出orgName数组//从index界面已经获取下拉列表的内容；
    $scope.orgName = JSON.parse(sessionStorage.getItem('orgName'));

    //取出creator
    $scope.initCreator = sessionStorage.getItem("creator");


    $.ajax({
        url:$scope.locationUrl+"/api/v1/repositories/"+$scope.organizationName,
        contentType: "application/json; charset=utf-8",
        dataType:"json",
        async: false,
        type:"GET",
        beforeSend: function(request) {
            request.setRequestHeader("Authorization", token);
        },
        success:function(msg) {
            $scope.repoItem = msg.repositories;
            if(msg.repositories.length == 0){
                $scope.tipRepo = true;
            }

        },
        error:function () {
            console.log("Acquisition failed！");
        }
    });


    $scope.organizationJumpRopeDetail = function(data){
        $rootScope.index_namespace = data.namespace;
        $rootScope.index_name = data.name;
        $rootScope.privateOrPublic = data.visibility;
        /*判断repoDetail权限问题------------------判断repo的权限*/
        $.ajax({
            url:$scope.locationUrl+"/api/v1/accounts/"+$scope.userNamespace+"/repositoryAccess/"+data.namespace+"/"+data.name,
            contentType: "application/json; charset=utf-8",
            dataType:"json",
            async: false,
            type:"GET",
            beforeSend: function(request) {
                request.setRequestHeader("Authorization", token);
            },
            success:function(msg) {
                if(msg.accessLevel == "ADMIN"){
                    $rootScope.authority = true;
                }else {
                    $rootScope.authority = false;
                }
            },
            error:function () {
                console.log("get repoDetail 失败！");
            }
        });
        location.href = "#repoDetails";

    };
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
            $(this).removeClass('divBtn');
        }
    );



    $scope.orgShow = function (org) {
        //初始存入--
        sessionStorage.removeItem('creator');
        sessionStorage.setItem('creator',org.creator);

        $('.select .city').addClass('hide');
        //先删除之前存入的name
        sessionStorage.removeItem('name');
        //将重新选中值存入sessionStroage
        sessionStorage.setItem('name',org.name);

        if (org.name != $scope.userNamespace){
            location.href="#repo";
        }
        if (org.name == $scope.userNamespace) {
            location.href="#index";
        }
    };

    /*==============createTeam================*/
    var createTeamTab_description_is_valid = false;
    var createTeamTab_name_is_valid = false;


    $("#teamName").on('input',function () {
        $('#createTeam-warning').empty();
        createTeamTab_name_is_valid = true;
        if (createTeamTab_description_is_valid) {
            $("#createTeamButton").attr("disabled", false);
        }
    })

    $("#teamDescription").on('input',function () {
        $('#descriptionTeam-warning').empty();
        createTeamTab_description_is_valid = true;
        if (createTeamTab_name_is_valid) {
            $("#createTeamButton").attr("disabled", false);
        }
    });



     $scope.addTeam = function () {
         $scope.teamName = $("#teamName").val();
         $scope.teamDescription = $("#teamDescription").val();
         //console.log($scope.teamName);
         var jsonDate = JSON.stringify({"name":$scope.teamName,
             "description":$scope.teamDescription});
         console.log(jsonDate);
        $.ajax({
            url:$scope.locationUrl+"/api/v1/accounts/"+$scope.organizationName+"/teams",
            data:jsonDate,
            contentType: "application/json; charset=utf-8",
            async: false,
            type:"POST",
            beforeSend: function(request) {
                request.setRequestHeader("Authorization", token);
            },
            success:function() {
                history.go(-1);

            },
            error:function(){
                alert("New failure！");
            }
        });
    }
    $scope.backTeam = function () {
        location.href = "#repo";
    }
    /*======================================================Teams===========================================================*/
    $scope.getTeams = function() {
        $.ajax({
            url:$scope.locationUrl+"/api/v1/accounts/"+$scope.organizationName+"/teams",
            contentType: "application/json; charset=utf-8",
            dataType:"json",
            async: false,
            type:"GET",
            beforeSend: function(request) {
                request.setRequestHeader("Authorization", token);
            },
            success:function(msg) {
                $scope.rootTeamNames = msg.teams[0].name;
                $scope.teamNames = msg.teams;
                $rootScope.teams_name = msg.teams;

                $scope.changeTeamSelected =msg.teams[0].name;
                $scope.changeTeamDescription = msg.teams[0].description


            },
            error:function () {
                alert("Getting Team failed！");
            }
        });
    };
/*初始判断是否显示创建按钮*/
    $.ajax({
        url:$scope.locationUrl+"/api/v1/accounts/"+$scope.userNamespace+"/repositoryNamespaceAccess/"+$scope.organizationName,
        contentType: "application/json; charset=utf-8",
        dataType:"json",
        async: false,
        type:"GET",
        beforeSend: function(request) {
            request.setRequestHeader("Authorization", token);
        },
        success:function(msg) {

            if(msg.accessLevel == "ADMIN"){
                $scope.visibleBtnCreateRepo = true;
                $scope.visibleBtnCreateTeam = false;
            }else {
                $scope.visibleBtnCreateTeam = false;
                $scope.visibleBtnCreateRepo = false;
            }

        },
        error:function () {
            console.log("get repoDetail 失败！");
        }
    });
    $scope.showCreateRepo = function () {
        $.ajax({
            url:$scope.locationUrl+"/api/v1/accounts/"+$scope.userNamespace+"/repositoryNamespaceAccess/"+$scope.organizationName,
            contentType: "application/json; charset=utf-8",
            dataType:"json",
            async: false,
            type:"GET",
            beforeSend: function(request) {
                request.setRequestHeader("Authorization", token);
            },
            success:function(msg) {
                if(msg.accessLevel == "ADMIN"){
                    $scope.visibleBtnCreateRepo = true;
                    $scope.visibleBtnCreateTeam = false;
                }else {
                    $scope.visibleBtnCreateTeam = false;
                    $scope.visibleBtnCreateRepo = false;
                }

            },
            error:function () {
                console.log("get repoDetail 失败！");
            }
        });


    };
    /*点击 Teams*/
    $scope.showCreateTeams = function () {

        /*
            获取namespace权限=====根据namespace权限判断显示teams的样式
        */
        console.log("查看是否显示对应的namespace名字：");
        console.log($scope.organizationName);
        $.ajax({
            url:$scope.locationUrl+"/api/v1/accounts/"+$scope.userNamespace+"/repositoryNamespaceAccess/"+$scope.organizationName,
            contentType: "application/json; charset=utf-8",
            dataType:"json",
            async: false,
            type:"GET",
            beforeSend: function(request) {
                request.setRequestHeader("Authorization", token);
            },
            success:function(msg) {
                if(msg.accessLevel == "ADMIN"){
                    $scope.getTeams();
                    $scope.editTeam("owners",0);
                    $scope.showTeam = false;
                    $scope.visibleBtnCreateTeam = true;
                    $scope.visibleBtnCreateRepo = false;
                }else {
                    $scope.showTeam = true;
                    $scope.getTeams();
                    $scope.visibleBtnCreateTeam = false;
                    $scope.visibleBtnCreateRepo = false;
                }
            },
            error:function () {
                console.log("get repoDetail 失败！");
            }
        });

    };



    /*
    点击Choose Team显示Edit readTeam 和 Team members
    */
    $scope.editTeam = function (rep,i) {
        console.log(rep);
        $scope.visible = false;//禁用delete按钮
        $scope.showDeleteIcon = 99999;
        //console.log(rep);
        var repName = rep;
        $scope.deleteTeamName = rep;
        if (rep === $scope.rootTeamNames){
            //console.log(rep.name);
            $scope.showDeleteIcon = 0;
        }else{
            $scope.visible = true;
        }
        $scope.fabricIsSelected = i;//显示选中图标
        $.ajax({
            url:$scope.locationUrl+"/api/v1/accounts/"+$scope.organizationName+"/teams/"+repName,
            contentType: "application/json; charset=utf-8",
            dataType:"json",
            async: false,
            type:"GET",
            beforeSend: function(request) {
                request.setRequestHeader("Authorization", token);
            },
            success:function(msg) {
                $scope.editTeamName = msg.name;
                $scope.reTeamDescription = msg.description;
            },
            error:function () {
                alert("Failed to get Edit readTea details！");
            }
        });

        $.ajax({
            url:$scope.locationUrl+"/api/v1/accounts/"+$scope.organizationName+"/teams/"+repName+"/members",
            contentType: "application/json; charset=utf-8",
            dataType:"json",
            async: false,
            type:"GET",
            beforeSend: function(request) {
                request.setRequestHeader("Authorization", token);
            },
            success:function(msg) {
                //console.log(msg.members[0]);
                $scope.teamMember = msg.members;
            },
            error:function () {
                alert("Failed to get Team members");
            }
        });
    };



    /*删除 Edit readTeam*/

    $scope.deleteEditTeam = function () {
        var result = confirm("Make sure to delete this team？");
        if (result){
            $.ajax({
                url:$scope.locationUrl+"/api/v1/accounts/"+$scope.organizationName+"/teams/"+$scope.deleteTeamName,
                contentType: "application/json; charset=utf-8",
                dataType:"text",
                async: false,
                type:"DELETE",
                beforeSend: function(request) {
                    request.setRequestHeader("Authorization", token);
                },
                success:function() {
                    $scope.showCreateTeams();
                },
                error:function () {
                    alert("failed to delete！");
                }
            });
        }
    };

    $scope.saveEditTeam = function () {
        $scope.reTeamDescription = $('#reTeamDescription').val();
        //console.log($scope.reTeamDescription);
        var jsonDate = JSON.stringify({"description":$scope.reTeamDescription});
        //console.log(jsonDate);
        $.ajax({
            url:$scope.locationUrl+"/api/v1/accounts/"+$scope.organizationName+"/teams/"+$scope.deleteTeamName,
            data:jsonDate,
            contentType: "application/json; charset=utf-8",
            async: false,
            type:"PATCH",
            beforeSend: function(request) {
                request.setRequestHeader("Authorization", token);
            },
            success:function() {
                alert("save success");
                $scope.editTeam("owners",0);
            },
            error:function(msg){
                console.log(msg);
                alert("Save failed！");
            }
        });
    };


    /*添加 和 删除 Team members*/
    $scope.createTeamMember = function(){
        $scope.addTeamMember = $("#teamMembers").val();
        console.log($scope.addTeamMember);
        console.log($scope.deleteTeamName);
            $.ajax({
                url:$scope.locationUrl+"/api/v1/accounts/"+$scope.organizationName+"/teams/"+$scope.deleteTeamName+"/members/"+$scope.addTeamMember,
                contentType: "application/json; charset=utf-8",
                async: false,
                type:"PUT",
                beforeSend: function(request) {
                    request.setRequestHeader("Authorization", token);
                },
                success:function() {
                    $scope.editTeam("owners",0);
                },
                error:function(){
                    alert("New failure！");
                }
            });
    };
    $scope.deleteTeamMember = function (member) {
        //console.log(member);
        $scope.deleteTeamMember = member.name;
        var result = confirm("Make sure to delete this teamMember？");
        if (result){
            $.ajax({
                url:$scope.locationUrl+"/api/v1/accounts/"+$scope.organizationName+"/teams/"+$scope.deleteTeamName+"/members/"+$scope.deleteTeamMember,
                contentType: "application/json; charset=utf-8",
                dataType:"text",
                async: false,
                type:"DELETE",
                beforeSend: function(request) {
                    request.setRequestHeader("Authorization", token);
                },
                success:function() {
                    $scope.editTeam("owners",0);
                },
                error:function () {
                    alert("failed to delete!");
                }
            });
        }
    };










});