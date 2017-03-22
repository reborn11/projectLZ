/**
 * Created by yuan on 2016/8/22.
 */
$(document).ready(function () {

    var box=$('.sto-last li').length;

    if (box==0){
        $('.custo-first').show();
        $('.sto-last').hide()
    } else {
        $('.custo-first').hide();
        $('.sto-last').show()
    };

    $('.head:first').addClass('back-Col');

    $('.head').bind('click', function () {

        var str = $(this).offset().left;

        $(this).addClass('back-Col').siblings().removeClass('back-Col');
        $('header>span').animate({left: str}, 300);
    });

    $(".head-custo").bind('click', function () {
        $('.con-custo').show().siblings().hide();
    });

    $(".head-cust").bind('click', function () {
        $('.in-custom').show().siblings().hide();
    });

    $(".head-Done").bind('click', function () {
        $('.had-done').show().siblings().hide();
    });

});

