angular.module('UpApp',['ngRoute','ngResource']).controller('signUpController',function ($scope) {
    /*
              用户注册

        */
    $('#name').on('input', function () {
        $("#name-input-warning").empty();
        var str = $(this).val();
        if (!str) {
            return;
        }
        var checkFirst = /^[a-zA-Z].*$/;
        var result = checkFirst.test(str);
        if (!result) {
            $("#name-input-warning").text("should start with character").css({"color":"red"});
            return;
        }
        if (str.length < 6) {
            $("#name-input-warning").text("the length should be over 6 characters").css({"color":"red"});
            return;
        }
        var format = /^[a-zA-Z][a-zA-Z0-9_-]{2,63}$/;
        if (!format.test(str)) {
            $("#name-input-warning").text("invalid format").css({"color":"red"});
            return;
        }
    });
    $('#email').on('input', function () {
        $("#emailWarning").empty();
        var str = $(this).val();
        if (!str) {
            return;
        }
        var checkFirst = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;//test()检测一个字符串是否匹配某个模式
        var result = checkFirst.test(str);
        if (!result) {
            $("#emailWarning").text("* Please enter a valid email address.").css({"color":"red"});
            return;
        }
    });
    console.log("sssss");

    $("#signUp").click(function () {
        console.log("success");
        var jsonData = {};
        jsonData.name = $('#name').val();
        jsonData.pwd = $('#password').val();
        jsonData.email = $('#email').val();
        console.log(jsonData);
        $.ajax({
            url:"https://registry-srcb-test.samsungcloud.org/api/v1/accounts",
            data:JSON.stringify(jsonData),
            contentType: "application/json; charset=utf-8",
            dataType:"text",
            async: false,
            type:"POST",
            success:function(msg) {
                console.log(msg);
                alert("注册成功！");
                window.location.href = "signIn.html";
                /*setTimeout(function () {
                    window.location.href = "signIn.html";
                },1000);*/
            },
            error:function(jqXHR){
                //console.log(jqXHR.responseText);
                var errors = JSON.parse(jqXHR.responseText)
                alert("Creation failed！\n\n"+errors.errors.detail);
            }
        });
    });
});