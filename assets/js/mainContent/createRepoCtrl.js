mainApp.controller('createRepoController',function ($scope,$route) {
    $scope.$route = $route;

    var token = $scope.cookieToken;
    //读取浏览器sessionStorage存储的name
    $scope.namespaceSelect = sessionStorage.getItem("name");

    //取出orgName数组
    $scope.orgName = JSON.parse(sessionStorage.getItem('orgName'));

    $('#createRepoForm-name-input').on('input', function () {
        $("#createRepoButton").attr("disabled", true);
        $("#createRepoForm-name-input-warning").empty();
        $("#createRepoButton").attr("disabled", false);
    });
    $("input").on('focus',function(){
        $('#createRepoButton-warning').empty();
    });

    $scope.selectNamespace = function(select){
        console.log(select);
        $scope.namespaceSelect = select.name;
    };

    /*markdown写转化函数*/
    $scope.convert = function (){
        var converter = new showdown.Converter();
        var text = document.getElementById("createRepoForm-fullDescription").value;
        $scope.html = converter.makeHtml(text);
        document.getElementById("createResult").innerHTML = $scope.html;
    };

    $scope.createRepo = function () {
        //console.log(selectNamespace);
        var jsonData = {};
        jsonData.name = $('#createRepoForm-name-input').val();
        jsonData.shortDescription = $('#createRepoForm-shortDescription').val();
        jsonData.fullDescription = $('#createRepoForm-fullDescription').val();
        jsonData.visibility = $('#selectPrivate_Public').val();
        console.log(jsonData);
        $.ajax({
            url:$scope.locationUrl+"/api/v1/repositories/"+$scope.namespaceSelect,
            data:JSON.stringify(jsonData),
            contentType: "application/json; charset=utf-8",
            async: false,
            type:"POST",
            beforeSend: function(request) {
                request.setRequestHeader("Authorization", token);
            },
            success:function() {
                if ($scope.namespaceSelect == $scope.userNamespace) {
                    location.href="#index";
                }else {
                    location.href="#repo";
                }
            },
            error:function(){
                alert("New failure！");
            }
        });
    }




});