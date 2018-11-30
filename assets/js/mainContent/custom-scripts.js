/*------------------------------------------------------
    Author : www.webthemez.com
    License: Commons Attribution 3.0
    http://creativecommons.org/licenses/by/3.0/
---------------------------------------------------------  */



(function ($) {
    //模拟下拉框
    $('.select input').on('click',function(){
        if($('.select .city').is('.hide')){
            $('.select .city').removeClass('hide');
        }else{
            $('.select .city').addClass('hide');
        }
    })
    $('.select ul li').on('click',function(){
        $('.select input').val($(this).html());
        $('.select .city').addClass('hide');
        $('.select input').css('border-bottom','1px solid $d6d6d6');
    })
    $('.select ul li').hover(
        function(){
            $(this).css({'background':'#E5EBF2','font-size':'14px'});
        },function(){
            $(this).css({'background':'#fff','font-size':'14px'});
        }
    )

    /*鼠标经过变色flex-box*/

    $('.flexBox').hover(function(){
            $(this).addClass('divOver');

        },function(){
            //鼠标离开时移除divOver样式
            $(this).removeClass('divOver');
        }
    );
    $('.bar').hover(function(){
            $(this).addClass('divOver');

        },function(){
            //鼠标离开时移除divOver样式
            $(this).removeClass('divOver');
        }
    );
    $('.rightButton').hover(function(){
            $(this).addClass('divBtn');

        },function(){
            //鼠标离开时移除divOver样式
            $(this).removeClass('divBtn');
        }
    );


    /*panel折叠框111111*/
    //初始状态
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

    /*webhooks创建框*/
    /*webhooks创建框*/
    $('#customHeader').hide();
    $('#customBody').hide();

    $('#showCustomBody').on('click',function () {
        $('#customBody').toggle();
    })
    $('#showCustomHeader').on('click',function () {
        $('#customHeader').toggle();
    })
    $('#deleteHeader').on('click',function () {
        $('#customHeader').hide();
    })

    $('#deleteBody').on('click',function () {
        $('#customBody').hide();
    })


    var mainApp = {

        initFunction: function () {
            /*menu
            ------------------------------------*/
            $('#main-menu').metisMenu();

            $(window).bind("load resize", function () {
                if ($(this).width() < 768) {
                    $('div.sidebar-collapse').addClass('collapse')
                } else {
                    $('div.sidebar-collapse').removeClass('collapse')
                }
            });


        },

        initialization: function () {
            mainApp.initFunction();

        }

    }


    $(document).ready(function () {
        mainApp.initFunction();
    });










}(jQuery));
