/**
 * Created by yuan on 2016/8/22.
 */

$(document).ready(function () {

    var str=$('.head-yu').length;
    if (str>2) {
        $('.head-ch').hide();
    } else {
        $('.head-ch').show();

    }

    $('.head-n').click(function(){
        if (str>2) {
            $('.head-ch').show();
        }
    });

    var str1=$('.ad').length;

    if (str1>2) {
        $('.head-dashi').hide();
    } else {
        $('.head-dashi').show();

    }
    $('.head-o').click(function(){
        if (str>2) {
            $('.head-dashi').show();
        }
    });







    $(".head-t li").first().addClass('back-color');
    $(".head-u li").first().addClass('back-color');

    $(".head-t li").bind('click', function () {

        var str = $(this).offset().left;

        $('.head-t span').animate({left: str}, 300);

        $(this).addClass('back-color').siblings().removeClass('back-color');

    });

    $(".head-u li").bind('click', function () {

        var str = $(this).offset().left;

        $('.head-u span').animate({left: str}, 300);

        $(this).addClass('back-color').siblings().removeClass('back-color');

    });
    $('.ead').click(function(){
        $('.sele-hide').fadeOut(200);
    });
    $('.ea').click(function(){
        $('.sele-hide').fadeIn(200);
    });

    $('.head-n,.head-o').click(function(){
        $(this).parent().remove()
    });

    $('.head-qux').click(function(){
        $('.gai-haed').fadeOut(200);
        $('.haed-sty').animate({bottom:-8.40001344+'rem'},200);
    });
    $('.xuaz,.gai-haed').click(function(){
        $('.gai-haed').fadeOut(200);
        $('.haed-sty').animate({bottom:-8.40001344+'rem'},200);
    });
    $('.head-ch').click(function(){
        $('.haed-sty').animate({bottom:0},200);
        $('.gai-haed').fadeIn(200);
    });

});









