/**
 * Created by yuan on 2016/8/17.
 */


$(function(){
    $('.nav:first').addClass('heade-color');
    $('.nav').bind('click',function(){
        $(this).addClass('heade-color').siblings().removeClass('heade-color');
    });
    $('.nav-a').bind('click',function(){
        $('.recom').show().siblings().hide();
    });
    $('.nav-b').bind('click',function(){
        $('.Ranking').show().siblings().hide();
    });
    $('.nav-c').bind('click',function(){
        $('.New').show().siblings().hide();
    })
});

