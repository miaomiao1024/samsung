angular.module('InApp',['ngRoute','ngResource']).controller('signInController',function ($scope) {

    /*
              用户登陆
    */
    console.log("sssss");
    $scope.signIn = function(){
        var name = $('#Username').val();
        var password = $('#Password').val();

        if (name && password){
            $.ajax({
                url:"https://registry-srcb-test.samsungcloud.org/token",
                async: false,
                type:"GET",
                headers: {
                    "Authorization": "Basic " + btoa(name + ":" + password)
                },
                success:function(msg) {
                    console.log(msg);//返回token;
                    console.log(msg.token);
                    $scope.tokens = msg.token;
                    console.log($scope.tokens);
                    console.log("登陆成功！");
                    //window.location.href = "http://localhost:63342/static/samsungCloud/user-management.html?_ijt="+name+"#/index";
                    //window.open("http://localhost:63342/static/samsungCloud/user-management.html?_ijt="+msg.token+"#/index")
                },
                error:function(jqXHR){
                    console.log(jqXHR.responseText);
                    alert(jqXHR.responseText+"\n\nUsername or Password is incorrect");
                }
            });
        }

    }
    console.log("sssss");
    /*$("#signIn").click(function () {
        var name = $('#Username').val();
        var password = $('#Password').val();

        if (name && password){
            $.ajax({
                url:"https://registry-srcb-test.samsungcloud.org/token",
                async: false,
                type:"GET",
                headers: {
                    "Authorization": "Basic " + btoa(name + ":" + password)
                },
                success:function(msg) {
                    console.log(msg);//返回token;
                    console.log(msg.token);
                    $scope.tokens = msg.token;
                    console.log($scope.tokens);
                    console.log("登陆成功！");
                    //window.location.href = "http://localhost:63342/static/samsungCloud/user-management.html?_ijt="+name+"#/index";
                    //window.open("http://localhost:63342/static/samsungCloud/user-management.html?_ijt="+msg.token+"#/index")
                },
                error:function(jqXHR){
                    console.log(jqXHR.responseText);
                    alert(jqXHR.responseText+"\n\nUsername or Password is incorrect");
                }
            });
        }


    })*/
});