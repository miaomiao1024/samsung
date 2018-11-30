mainApp.controller('repoDetailsCtrl',function ($scope,$route,$rootScope) {
    $scope.$route = $route;
    $scope.infoNamespace = $rootScope.index_namespace;
    $scope.reponame = $rootScope.index_name;
    $scope.privateOr = $rootScope.privateOrPublic.toUpperCase();
    $scope.teamsName = $rootScope.teams_name;//从repo页拿到的teamsName的数组
    $scope.judgmentAuthority = $rootScope.authority;//判断repo权限
    //console.log($scope.judgmentAuthority);
    var token = $scope.cookieToken;
    /*=============Repo Info折叠框===========*/
    $('#collapseBodyOne').show();
    $('#collapseBodyTwo').hide();
    $('#editBoxOne').show();

    $('#editBoxTwo').show();
    $('#BodyTwo').hide();
    $('#BodyOne').show();

    $('#editBoxOne').on('click',function () {
        $('#collapseBodyOne').hide();
        $('#editBoxOne').hide();
        $('#collapseBodyTwo').show();
    })
    $('#cancelForm').on('click',function(){
        $('#collapseBodyTwo').hide();
        $('#collapseBodyOne').show();
        $('#editBoxOne').show();
    })

    $('#editBoxTwo').on('click',function () {
        $('#BodyOne').hide();
        $('#editBoxTwo').hide();
        $('#BodyTwo').show();
    })
    $('#cancelText').on('click',function(){
        $('#BodyTwo').hide();
        $('#BodyOne').show();
        $('#editBoxTwo').show();
    })

    /*===============Get Repo Info==============*/
    $.ajax({
        url:$scope.locationUrl+"/api/v1/repositories/"+$scope.infoNamespace+"/"+$scope.reponame,
        contentType: "application/json; charset=utf-8",
        dataType:"json",
        async: false,
        type:"GET",
        beforeSend: function(request) {
            request.setRequestHeader("Authorization", token);
        },
        success:function(msg) {
            //console.log("后端返回字段");
            $scope.repoInfo = msg;
            //console.log(msg);
            if (msg.shortDescription.length == 0){
                $scope.msgShortDescription = "short Description";
            } else {
                $scope.msgShortDescription = msg.shortDescription;
            }
            if (msg.fullDescription.length == 0) {
                $scope.msgFullDescription = "full Description";
            }else {
                $scope.msgFullDescription = msg.fullDescription;
            }
            var converter = new showdown.Converter();
            document.getElementById("showResult").innerHTML = converter.makeHtml($scope.msgFullDescription);
            //$scope.REPOINFO = msg.visibility.toUpperCase();

        },
        error:function () {
            console.log("get repo info 失败！");
        }
    });
    /*权限判断是否显示Tags----Setting*/



    /*=============Setting折叠框===========*/
    $('#settingTwo').hide();
    $('#settingFour').hide();
    $('#makePubic').on('click',function () {
        $('#settingOne').hide();
        $('#settingTwo').show();
    });
    $('#canSettingTwo').on('click',function () {
        $('#settingOne').show();
        $('#settingTwo').hide();
    });
    $('#delSettingThree').on('click',function () {
        $('#settingThree').hide();
        $('#settingFour').show();
    });
    $('#canSettingFour').on('click',function () {
        $('#settingThree').show();
        $('#settingFour').hide();
    });


    /*markdown写转化函数*/
    $scope.convert = function (){
        var converter = new showdown.Converter();
        var text = document.getElementById("oriContent").value;
        $scope.html = converter.makeHtml(text);
        document.getElementById("result").innerHTML = $scope.html;
    }
    /*保存短说明*/
    $scope.saveShortDescription = function(){
        $scope.shortDescriptions = $("#showShortDescription").val();
        $scope.fullDescriptions = $scope.msgFullDescription;
        var jsonDate = JSON.stringify({"shortDescription":$scope.shortDescriptions,
            "fullDescription":$scope.fullDescriptions});
        console.log(jsonDate);
        $.ajax({
            url:$scope.locationUrl+"/api/v1/repositories/"+$scope.infoNamespace+"/"+$scope.reponame,
            data:jsonDate,
            contentType: "application/json; charset=utf-8",
            async: false,
            type:"PATCH",
            beforeSend: function(request) {
                request.setRequestHeader("Authorization", token);
            },
            success:function() {
                location.href="#repoDetails";
            },
            error:function(){
                alert("New failure！");
            }
        });
    }
    /*保存长说明*/
    $scope.saveFullDescription = function(){
        $scope.fullDescriptions = $("#oriContent").val();
        $scope.shortDescriptions = $scope.msgShortDescription;
        var jsonDate = JSON.stringify({"shortDescription":$scope.shortDescriptions,
            "fullDescription":$scope.fullDescriptions});
        console.log(jsonDate);
        $.ajax({
            url:$scope.locationUrl+"/api/v1/repositories/"+$scope.infoNamespace+"/"+$scope.reponame,
            data:jsonDate,
            contentType: "application/json; charset=utf-8",
            async: false,
            type:"PATCH",
            beforeSend: function(request) {
                request.setRequestHeader("Authorization", token);
            },
            success:function() {
                location.href="#repoDetails";
            },
            error:function(){
                alert("New failure！");
            }
        });
    }
    /*===============Get tags==============*/
    var SIZE = {
        K: 1024
        , M: 1048576
    };
    $scope.getTagSize = function (size) {
        var result = size;
        if (typeof (result) == 'string') {
            result = result.replace(/,/g, "");
        }
        result = parseInt(result);//parseInt可解析一个字符串，并返回一个整数
        if (result >= SIZE.M) {
            return (result / SIZE.M).toFixed(2) + "M";//toFixed() 方法可把 Number 四舍五入为指定小数位数的数字。
        }
        return (result / SIZE.K).toFixed(2) + "K";
    };

    $scope.showTags = function(){
        $.ajax({
            url:$scope.locationUrl+"/api/v1/repositories/"+$scope.infoNamespace+"/"+$scope.reponame+"/tags",
            contentType: "application/json; charset=utf-8",
            dataType:"json",
            async: false,
            type:"GET",
            beforeSend: function(request) {
                request.setRequestHeader("Authorization", token);
            },
            success:function(msg) {
                console.log(msg.tags.length);
                for (var i=0;i<msg.tags.length;i++){
                    var val = msg.tags[i].size;
                    //console.log(val);
                    var str = val.toString().replace(val,$scope.getTagSize(val));
                    //console.log(str);
                    msg.tags[i].size = str;
                }
                $scope.tags = msg.tags;
                //console.log($scope.tags[0]);
                if (msg.tags.length == 0){
                    $scope.tipRepoDetailTags = true;
                }
            },
            error:function () {
                console.log("失败！");
            }
        });
    };
    /*==================Repo Info COPY================*/
    $scope.copyInfo = function(){
        var copyInfo = document.getElementById("copyInfo").innerText;
        var replaceCopyInfo = document.getElementById("replaceCopyInfo");
        replaceCopyInfo.value = copyInfo;
        replaceCopyInfo.select(); // 选中文本
        document.execCommand("copy");
        alert("Successful copy");
    };


    /*==================Dashboard下的    GET  getRepositoryUserAccess  &     collaborators  PUT & DELETE=================*/
    $scope.visibilityCollaborators = false;
    $scope.showCollaborators = function(){
        //$scope.visibilityCollaborators = false;
        if ($scope.infoNamespace == $scope.userNamespace) {
            $scope.visibilityCollaborators = false;
            $.ajax({
                url:$scope.locationUrl+"/api/v1/repositories/"+$scope.infoNamespace+"/"+$scope.reponame+"/userAccess",
                contentType: "application/json; charset=utf-8",
                dataType:"json",
                async: false,
                type:"GET",
                beforeSend: function(request) {
                    request.setRequestHeader("Authorization", token);
                },
                success:function(msg) {
                    //console.log(msg);
                    //console.log(msg.users.length);
                    var len = msg.users.length;
                    var newArry = [];
                    for (var i=0;i<len;i++){
                        if (msg.users[i].permission == 4){
                            var news = {"userName":msg.users[i].userName,"permission":"Read-Only"};
                            newArry.push(news);
                        }else if (msg.users[i].permission == 6){
                            var news = {"userName":msg.users[i].userName,"permission":"Read-Write"};
                            newArry.push(news);
                        }else{
                            var news = {"userName":msg.users[i].userName,"permission":"Admin"};
                            newArry.push(news);
                        }
                    }
                    $scope.accessUserLevel = newArry;

                    if (len == 0){
                        $scope.tipRepoDetailColl = true;
                    }
                },
                error:function () {
                    console.log("失败！");
                }
            });
        }else {
            $scope.visibilityCollaborators = true;
            $.ajax({
                url:$scope.locationUrl+"/api/v1/repositories/"+$scope.infoNamespace+"/"+$scope.reponame+"/teamAccess",
                contentType: "application/json; charset=utf-8",
                dataType:"json",
                async: false,
                type:"GET",
                beforeSend: function(request) {
                    request.setRequestHeader("Authorization", token);
                },
                success:function(msg) {
                    $scope.accessTeamLevel = msg.teams;
                    if (msg.teams.length == 0){
                        $scope.tipRepoDetailColl = true;
                    }
                },
                error:function () {
                    console.log("GET collaborators失败！");
                }
            });

        }
    }

    $scope.submitCollUser = function(){
        $scope.userLevel = $("#userLevel").val();
        $scope.accessLevels = $("#accessLevel").val();
        var level = $scope.accessLevels;
        var jsonData = {
            accessLevel: level
        };
        jsonData = JSON.stringify(jsonData);
        $.ajax({
            url:$scope.locationUrl+"/api/v1/repositories/"+$scope.infoNamespace+"/"+$scope.reponame+"/userAccess/"+$scope.userLevel,
            data:jsonData,
            contentType: "application/json; charset=utf-8",
            async: false,
            type:"PUT",
            beforeSend: function(request) {
                request.setRequestHeader("Authorization", token);
            },
            success:function() {
                $scope.showCollaborators();
                $scope.tipRepoDetailColl = false;
            },
            error:function(){
                alert("New failure！");
        }
        });
    };
    $scope.deleteLevelUser = function (data) {
        // console.log(data);
        var result = confirm("confirm delete ?");
        if (result){
            $.ajax({
               url:$scope.locationUrl+"/api/v1/repositories/"+$scope.infoNamespace+"/"+$scope.reponame+"/userAccess/"+data.userName,
               contentType: "application/json; charset=utf-8",
               async: false,
               type:"DELETE",
                beforeSend: function(request) {
                    request.setRequestHeader("Authorization", token);
                },
               success:function() {
                   $scope.showCollaborators();
               },
               error:function(data,type, err){
                   alert("failed to delete");
                   console.log("ajax错误类型："+type);
                   console.log("err:"+err);
                   console.log("data:"+data);
               }
            });
        }
    }

    /*==================Organizations 下的 GET  getRepositoryUserAccess  &     collaborators  PUT & DELETE=================*/
    $scope.change = function(){
        $scope.changeTeam = $scope.selectedTeam;
    };
    $scope.submitCollTeam = function () {
        $scope.accessLevels = $("#accessLevelTeam").val();
        var level = $scope.accessLevels;
        var jsonData = {
            accessLevel: level
        };
        jsonData = JSON.stringify(jsonData);
        $.ajax({
            url:$scope.locationUrl+"/api/v1/repositories/"+$scope.infoNamespace+"/"+$scope.reponame+"/teamAccess/"+$scope.changeTeam,
            data:jsonData,
            contentType: "application/json; charset=utf-8",
            async: false,
            type:"PUT",
            beforeSend: function(request) {
                request.setRequestHeader("Authorization", token);
            },
            success:function() {
                $scope.showCollaborators();
                $scope.tipRepoDetailColl = false;
            },
            error:function(){
                alert("New failure！");
            }
        });
    }
    $scope.deleteLevelTeam = function (data) {
        //console.log(data);
        var result = confirm("confirm delete?");
        if (result){
            $.ajax({
                url:$scope.locationUrl+"/api/v1/repositories/"+$scope.infoNamespace+"/"+$scope.reponame+"/teamAccess/"+data.name,
                contentType: "application/json; charset=utf-8",
                async: false,
                type:"DELETE",
                beforeSend: function(request) {
                    request.setRequestHeader("Authorization", token);
                },
                success:function() {
                    $scope.showCollaborators();
                },
                error:function(data,type, err){
                    alert("failed to delete");
                    console.log("ajax错误类型："+type);
                    console.log("err:"+err);
                    console.log("data:"+data);
                }
            });
        }
    };


    /*----------------------------------webhooks界面展现效果------------------------------------------*/

    /*GET webhooks信息*/
    $scope.showWebhooks = function(){
        $scope.isshow_createWebhookbutton = false;
        $.ajax({
            url:$scope.locationUrl+"/api/v1/repositories/"+$scope.infoNamespace+"/"+$scope.reponame+"/webhooks",
            contentType: "application/json; charset=utf-8",
            dataType:"json",
            async: false,
            type:"GET",
            beforeSend: function(request) {
                request.setRequestHeader("Authorization", token);
            },
            success:function(msg) {
                $scope.webhookRepoShow = msg.webhooks;
                if (msg.webhooks.length == 0){
                    $scope.isshow_createWebhookbutton = true;
                }
            },
            error:function () {
                console.log("GET webhooks failure！");
            }
        });
    };


    /*==========创建webhook=============*/
    // 添加规格选项header
    $scope.showOperationHeader = false;
    var entityHeader = [];
    var entityLen = entityHeader.length;
    $scope.addHeadOpetion = function() {
        entityLen++;
        entityHeader.push({});
        $scope.headerOptionList = entityHeader;
    };

    // 删除规格选项header
    $scope.delHeadOpetion = function(index) {
        entityHeader.splice(index, 1);
        //删除并将值清空
        var headerName = "headerName_"+index;
        var headerValue = "headerValue_"+index;
        $("#" + headerName + "").val("");
        $("#" + headerValue + "").val("");
        entityLen--;
        if (entityHeader == 0){
            $scope.showOperationHeader = false;
        }
    };
    /*$scope.testtt = function(){
        for (var i = 0;i<entityLen;i++){
            console.log(entityLen);
            var headerName = "headerName_"+i;
            var headerValue = "headerValue_"+i;
            console.log(headerName);
            var key = $("#" + headerName + "").val();
            if (key !== ""){
                objHeader[key] = $("#" + headerValue + "").val();
                entityHeader.splice(0,1,objHeader);
            }
            console.log(entityHeader);
            console.log(entityHeader[0]);

        }
    };*/

    // 添加规格选项body
    $scope.showOperationBody = false;
    var entityBody = [];
    var entityLenBody = entityBody.length;
    $scope.addBodyOpetion = function() {
        entityLenBody++;
        entityBody.push({});
        $scope.bodyOptionList = entityBody;
    };
    // 删除规格选项body
    $scope.delBodyOpetion = function(index) {
        entityBody.splice(index, 1);
        entityLenBody--;
        var bodyName = "bodyName"+index;//删除并将值清空
        var bodyValue = "bodyValue"+index;
        $("#" + bodyName + "").val("");
        $("#" + bodyValue + "").val("");
        if (entityLenBody == 0){
            $scope.showOperationBody = false;
        }
    };

    //创建函数
    $scope.createWebhook = function () {
        var webhookDataJson = {};
        var select_built_body = {};
        var objHeader = {};
        webhookDataJson.name = $scope.webhookName;
        webhookDataJson.event = $scope.selectWebOption;
        webhookDataJson.method = "post";
        webhookDataJson.headers = objHeader;
        console.log(entityLen);
        for (var i = 0;i<entityLen;i++){
            var headerName = "headerName_"+i;
            var headerValue = "headerValue_"+i;
            var key = $("#" + headerName + "").val();
            if (key != ""){
                objHeader[key] = $("#" + headerValue + "").val();
                entityHeader.splice(0,1,objHeader);
            }
        }
        console.log(webhookDataJson.headers);
        webhookDataJson.url = $scope.webhookUrl;
        webhookDataJson.body = select_built_body;

        select_built_body.id = "";if ($("#checkboxId").is(':checked')){select_built_body.id = "id"}
        select_built_body.timestamp ="";if ($("#checkboxTimestamp").is(':checked')){select_built_body.timestamp = "timestamp"}
        select_built_body.action ="";if ($("#checkboxAction").is(':checked')){select_built_body.action = "action"}
        select_built_body.repository ="";if ($("#checkboxRepository").is(':checked')){select_built_body.repository = "repository"}
        select_built_body.tag ="";if ($("#checkboxTag").is(':checked')){select_built_body.tag = "tag"}
        select_built_body.request_addr ="";if ($("#checkboxRequest_addr").is(':checked')){select_built_body.request_addr = "request_addr"}
        select_built_body.request_useragent ="";if ($("#checkboxRequest_useragent").is(':checked')){select_built_body.request_useragent = "request_useragent"}
        for (var i = 0;i<entityLenBody;i++){
            var bodyName = "bodyName_"+i;
            var bodyValue = "bodyValue_"+i;
            var key = $("#" + bodyName + "").val();
            if (key != ""){
                select_built_body[key] = $("#" + bodyValue + "").val();
                entityBody.splice(0,1,select_built_body);
            }
        }
        console.log(select_built_body);
        console.log(webhookDataJson);
        $.ajax({
            url:$scope.locationUrl+"/api/v1/repositories/"+$scope.infoNamespace+"/"+$scope.reponame+"/webhooks",
            data:JSON.stringify(webhookDataJson),
            contentType: "application/json; charset=utf-8",
            async: false,
            type:"POST",
            beforeSend: function(request) {
                request.setRequestHeader("Authorization", token);
            },
            success:function() {
                console.log("create success");
                $scope.isshow_createWebhookForm = false;
                $scope.webhookName = "";
                $scope.webhookUrl = "";
                $scope.headerOptionList = [];
                $scope.bodyOptionList = [];
                $scope.showOperationHeader = false;
                $scope.showOperationBody = false;
                entityHeader = [];
                entityBody = [];
                entityLen = 0;
                entityLenBody = 0;
                $scope.showWebhooks();
            },
            error:function(){
                alert("New failure！");
            }
        });
    };

    /*=========================webhooks edit ======================*/
    //检查对象中有没有键值对
    function isEmptyObject(obj) {
        for (var key in obj) {
            return false;
        }
        return true;
    }

    // 添加规格选项edit header
    $scope.addEditHeadOpetion = function() {
        $scope.editHeaderOptionList.push({});
        //console.log($scope.editHeaderOptionList.length);
    };
    // 删除规格选项edit  header
    $scope.delEditHeadOpetion = function(index) {
        $scope.editHeaderOptionList.splice(index, 1);
        //删除并将值清空
        var viewEditHeaderName = "viewEditHeaderName_"+index;
        var viewEditHeaderValue = "viewEditHeaderValue_"+index;
        $("#" + viewEditHeaderName + "").val("");
        $("#" + viewEditHeaderValue + "").val("");
        if ($scope.editHeaderOptionList.length == 0){
            $scope.showViewEditHeader = false;
        }
    };

    // 添加规格选项edit body
    $scope.addEditBodyOpetion = function() {
        $scope.editBodyOptionList.push({});
        //console.log($scope.editBodyOptionList.length);
    };
    // 删除规格选项edit body
    $scope.delEditBodyOpetion = function(index) {
        $scope.editBodyOptionList.splice(index, 1);
        var viewEditBodyName = "viewEditBodyName_"+index;//删除并将值清空
        var viewEditBodyValue = "viewEditBodyValue_"+index;
        $("#" + viewEditBodyName + "").val("");
        $("#" + viewEditBodyValue + "").val("");
        if ($scope.editBodyOptionList.length == 0){
            $scope.showViewEditBody = false;
        }
    };




    //选中编辑的选中项
    $scope.webhooksEdit = function (item) {
        $.ajax({
            url:$scope.locationUrl+"/api/v1/repositories/"+$scope.infoNamespace+"/"+$scope.reponame+"/webhooks/"+item.name,
            contentType: "application/json; charset=utf-8",
            dataType:"json",
            async: false,
            type:"GET",
            beforeSend: function(request) {
                request.setRequestHeader("Authorization", token);
            },
            success:function(msg) {
                $scope.editWebhooksName = msg.name;
                $scope.editSeleteEvent = msg.event;
                $scope.editWebhooksUrl = msg.url;
                if (msg.body.id != ''){$scope.idCheckbox = true}else {$scope.idCheckbox = false}
                if (msg.body.timestamp != ''){$scope.timestampCheckbox = true}else {$scope.timestampCheckbox = false}
                if (msg.body.action != ''){$scope.actionCheckbox = true}else {$scope.actionCheckbox = false}
                if (msg.body.repository != ''){$scope.repositoryCheckbox = true}else {$scope.repositoryCheckbox = false}
                if (msg.body.tag != ''){$scope.tagCheckbox = true}else {$scope.tagCheckbox = false}
                if (msg.body.request_addr != ''){$scope.request_addrCheckbox = true}else {$scope.request_addrCheckbox = false}
                if (msg.body.request_useragent != ''){$scope.request_useragentCheckbox = true}else {$scope.request_useragentCheckbox = false}
                $scope.editHeaderOptionList = [];
                if (isEmptyObject(msg.headers)) {
                    $scope.showViewEditHeader = false;
                } else {
                    $scope.showViewEditHeader = true;
                    for (var key in msg.headers){
                        var editViewHeader={};
                        editViewHeader.key=key;
                        editViewHeader.value = msg.headers[key];
                        $scope.editHeaderOptionList.push(editViewHeader);
                    }
                }
                $scope.editBodyOptionList = [];
                if (Object.keys(msg.body).length >= 8){
                    $scope.showViewEditBody = true;
                    delete msg.body.id;
                    delete msg.body.timestamp;
                    delete msg.body.action;
                    delete msg.body.repository;
                    delete msg.body.tag;
                    delete msg.body.request_addr;
                    delete msg.body.request_useragent;
                    for (var key in msg.body){
                        var editViewBody={};
                        editViewBody.key = key;
                        editViewBody.value = msg.body[key];
                        $scope.editBodyOptionList.push(editViewBody);
                    }
                } else {
                    $scope.showViewEditBody = false;
                }
            },
            error:function () {
                console.log("GET webhooks edit failure！");
            }
        });
    };
    /*=========================save webhooks edit ======================*/
    $scope.saveEditWebhook = function(){
        var saveWebhookDataJson = {};
        var select_built_editBody = {};
        var objEditHeader = {};
        saveWebhookDataJson.name = $("#editWebhooksName").val();
        saveWebhookDataJson.event = $("#editSeleteEvent").val();
        saveWebhookDataJson.url = $("#editWebhooksUrl").val();
        saveWebhookDataJson.method = "post";
        saveWebhookDataJson.headers = objEditHeader;
        saveWebhookDataJson.body = select_built_editBody;

        var editHeaderOptionList = $scope.editHeaderOptionList.length;
        for (var l=0;l<editHeaderOptionList;l++){
            var viewEditHeaderName = "viewEditHeaderName_"+l;
            var viewEditHeaderValue = "viewEditHeaderValue_"+l;
            var key = $("#" + viewEditHeaderName + "").val();
            objEditHeader[key] = $("#" + viewEditHeaderValue + "").val();
        }

        if ($("#idCheckbox").is(':checked')){select_built_editBody.id = "id"}else {select_built_editBody.id = "";}
        if ($("#timestampCheckbox").is(':checked')){select_built_editBody.timestamp = "timestamp"}else{select_built_editBody.timestamp ="";}
        if ($("#actionCheckbox").is(':checked')){select_built_editBody.action = "action"}else{select_built_editBody.action ="";}
        if ($("#repositoryCheckbox").is(':checked')){select_built_editBody.repository = "repository"}else{select_built_editBody.repository ="";}
        if ($("#tagCheckbox").is(':checked')){select_built_editBody.tag = "tag"}else{select_built_editBody.tag ="";}
        if ($("#request_addrCheckbox").is(':checked')){select_built_editBody.request_addr = "request_addr"}else{select_built_editBody.request_addr ="";}
        if ($("#request_useragentCheckbox").is(':checked')){select_built_editBody.request_useragent = "request_useragent"}else{select_built_editBody.request_useragent ="";}

        var editBodyOptionList = $scope.editBodyOptionList.length;
        for (var j=0;j<editBodyOptionList;j++) {
            var viewEditBodyName = "viewEditBodyName_"+j;
            var viewEditBodyValue = "viewEditBodyValue_"+j;
            var key = $("#" + viewEditBodyName + "").val();
            select_built_editBody[key] = $("#" + viewEditBodyValue + "").val();
        }


        console.log(saveWebhookDataJson);
        $.ajax({
            url:$scope.locationUrl+"/api/v1/repositories/"+$scope.infoNamespace+"/"+$scope.reponame+"/webhooks/"+$scope.editWebhooksName,
            data:JSON.stringify(saveWebhookDataJson),
            contentType: "application/json; charset=utf-8",
            async: false,
            type:"POST",
            beforeSend: function(request) {
                request.setRequestHeader("Authorization", token);
            },
            success:function() {
                $scope.showWebhooks();
                $scope.isshow_itemEdit=false;
            },
            error:function(){
                alert("New failure！");
            }
        });


    };


    /*==========删除webhooks=======*/
    $scope.deleteWebhook = function (msg) {
        console.log(msg);
        $.ajax({
            url:$scope.locationUrl+"/api/v1/repositories/"+$scope.infoNamespace+"/"+$scope.reponame+"/webhooks/"+msg,
            contentType: "application/json; charset=utf-8",
            async: false,
            type:"DELETE",
            beforeSend: function(request) {
                request.setRequestHeader("Authorization", token);
            },
            success:function() {
                console.log("delete success！");
                $scope.showWebhooks();
            },
            error:function(data,type, err){
                alert("failed to delete");
                console.log("ajax错误类型："+type);
                console.log("err:"+err);
                console.log("data:"+data);
            }
        });

    };

    /*==========webhooks view history ==========*/
    $scope.webhookViewHistory = function (item) {

        console.log(item);
        $.ajax({
            url:$scope.locationUrl+"/api/v1/repositories/"+$scope.infoNamespace+"/"+$scope.reponame+"/webhooks/history/"+item.name,
            contentType: "application/json; charset=utf-8",
            dataType:"json",
            async: false,
            type:"GET",
            beforeSend: function(request) {
                request.setRequestHeader("Authorization", token);
            },
            success:function(msg) {
                console.log("msg view history success");
                console.log(msg.historys);
                $scope.viewHistoryArray = msg.historys;
                if (msg.historys.length == 0){
                    $scope.isshow_historyNews = false;
                }
            },
            error:function () {
                console.log("GET view history failure！");
            }
        });
    };
















    /*$scope.submitColl = function(){

        $scope.userName = $("#userName").val();
        $scope.accessLevels = $("#accessLevel").val();
        console.log($scope.userName);
        console.log($scope.accessLevels);
        var ee = {"accessLevel":$scope.accessLevels};
        console.log(ee);
        $http({
            method: 'PUT',
            url: "http://109.105.4.123:9090/api/v1/repositories/liucong/repository01/userAccess/miaomiao",
            data:ee,
            headers: {
                "Authorization": "Basic " + btoa(userNamedd + ":" + passdWorddd)
            },
        }).then(function successCallback() {
           console.log("成功");
        }, function errorCallback() {
            console.log("失败");
        });


    }*/


    /*$http({
        method: 'GET',
        url: 'http://109.105.4.123:9090/api/v1/repositories/liucong/repository01/userAccess',
        headers: {
            "Authorization": "Basic " + btoa(userNamedd + ":" + passdWorddd)
        },
    }).then(function successCallback(response) {
        console.log(response);
    }, function errorCallback() {
        console.log("GET失败");
    });*/









});