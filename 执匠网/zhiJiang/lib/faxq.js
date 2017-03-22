/**
 * Created by yuan on 2016/8/23.
 */

$(document).ready(function(){
    $(".na-cli").bind('click',function(){
        $('.las-xq').slideToggle();
        $('.na-img').toggleClass('na-imgtogg');
    });
    $('.pitch').click(function(){
        $('.CPM').fadeIn();
    });
    $('.yen').click(function(){
        $('.CPM').fadeOut();
    });
    $('.head-dsa').click(function(){
        $(this).find('span').toggleClass('back-naimg');
    })
});












