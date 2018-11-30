mainApp.controller('changePasswordController',function ($scope,$route,$rootScope) {
    $scope.$route = $route;
    var token = $scope.cookieToken;

    $("#reNewPassword").blur(function(){
        if($("#reNewPassword").val()!=$("#newPassword").val()){
            alert("Inconsistent password entered twice");
            $("#reNewPassword").val("");
            $("#newPassword").val("");
        }
    })

    $scope.changePassword = function () {
        $scope.oldPassword = $("#oldPassword").val();
        $scope.newPassword = $("#newPassword").val();
        var jsonDate = JSON.stringify({
            "oldPassword":$scope.oldPassword,
            "newPassword":$scope.newPassword,
        });
        console.log(jsonDate);
        $.ajax({
            url:$scope.locationUrl+"/api/v1/accounts/"+$scope.userNamespace+"/changePassword",
            data:jsonDate,
            contentType: "application/json; charset=utf-8",
            async: false,
            type:"POST",
            beforeSend: function(request) {
                request.setRequestHeader("Authorization", token);
            },
            success:function() {
                alert("change success");
                location.href="signIn.html";
            },
            error:function(){
                alert("change failure！");
            }
        });


    }


});