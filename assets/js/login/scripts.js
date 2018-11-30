
//模拟type=password
/*var ArrPassword = [];
function foo(obj){
    var OldPassword = document.getElementById("Password").value;
    OldPassword = OldPassword.split("");
    var targetStr = OldPassword[OldPassword.length-1];

    if (typeof (targetStr) != 'undefined' && targetStr!= '*') {
        ArrPassword.push(targetStr);
    }
    var val=obj.value.replace(/[^\s\*]/g,'*');
    obj.value=val;
}*/

jQuery(document).ready(function() {
    $(document).keydown(function (event) {
        if(event.keyCode == 13){
            $("#signIn").click();
        }
    });

    /*
              用户登陆
    */
    $("#signIn").click(function () {
        //console.log(ArrPassword);
        /*var stringPassword = ArrPassword.join("");
        console.log(stringPassword);*/
        var name = $('#Username').val();
        var password = $('#Password').val();
        //ArrPassword.splice(0,ArrPassword.length);
        if (name && password){
            $.ajax({
                url:"https://registry-srcb-test.samsungcloud.org/token",
                async: false,
                type:"GET",
                headers: {
                    "Authorization": "Basic " + btoa(name + ":" + password)
                },
                success:function(msg) {
                    $.cookie("token",msg.token);//将token存入cookie
                    $.cookie("name",name);//将用户名存入cookie
                    var cookieToken = $.cookie("token");
                    var names = $.cookie("name");
                    console.log("登陆成功！");
                    //window.location.href = "user-management.html?_ijt="+name+"#/index";

                    $.ajax({
                        url:"https://registry-srcb-test.samsungcloud.org/api/v1/accounts/"+name,
                        dataType:"json",
                        async: false,
                        type:"GET",
                        headers: {
                            "Authorization": "Basic " + btoa(name + ":" + password)
                        },
                        success:function(mate) {
                            console.log(mate);
                            $.cookie("isAdmin",mate.isAdmin);
                            if (mate.isAdmin == true){
                                window.location.href = "system-management.html?_ijt="+name+"#/index";
                            }else{
                                window.location.href = "user-management.html?_ijt="+name+"#/index";
                            }
                            //window.location.href = "http://109.105.4.123:8080/web/v0/user-management.html?_ijt="+name+"#/index";
                            //window.open("http://localhost:63342/static/samsungCloud/user-management.html?_ijt="+msg.token+"#/index")
                        },
                        error:function(jqXHR){
                            console.log(jqXHR.responseText);
                        }
                    });

                },
                error:function(jqXHR){
                    console.log(jqXHR.responseText);
                    alert(jqXHR.responseText+"\n\nUsername or Password is incorrect");
                    $('#Password').val("");
                }
            });
        }


    });
    /*
        Fullscreen background
    */
    //$.backstretch("assets/img/backgrounds/1.jpg");
    $('#top-navbar-1').on('shown.bs.collapse', function(){
    	$.backstretch("resize");
    });
    $('#top-navbar-1').on('hidden.bs.collapse', function(){
    	$.backstretch("resize");
    });
    
    /*
        Form validation
    */
    $('.registration-form input[type="text"], .registration-form textarea').on('focus', function() {
    	$(this).removeClass('input-error');
    });
    
    $('.registration-form').on('submit', function(e) {
    	
    	$(this).find('input[type="text"], textarea').each(function(){
    		if( $(this).val() == "" ) {
    			e.preventDefault();
    			$(this).addClass('input-error');
    		}
    		else {
    			$(this).removeClass('input-error');
    		}
    	});
    	
    });

    $("input:text").click(function(){
        $(this).addClass('inputHover');
    });


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
                alert("registration success !");
                window.location.href = "signIn.html";
               /* setTimeout(function () {
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

    $("#plainPassword").blur(function(){
        if($("#password").val()!=$("#plainPassword").val()){
            $("#checkPassword").text("Inconsistent password entered twice").css({"color":"red"});
            //alert("Inconsistent password entered twice");
            $("#password").val("");
            $("#plainPassword").val("");
        }
    })















});
