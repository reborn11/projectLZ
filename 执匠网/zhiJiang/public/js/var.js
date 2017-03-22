/**
 * Created by yuan on 2016/8/16.
 */
//
//function box(){
//    var fontSize=$(window).width()/18;
//    $('html').css('font-size',fontSize);
//}
//setInterval("box()",0);

function box() {
    var fontSize = window.innerWidth / 18;
    var box = document.getElementsByTagName('html')[0];
    box.style.fontSize = fontSize + 'px';
}
box();
$('.amplify').click(function(){
    var str=$(this).attr('src');
    $('.ampl').fadeIn(300);
    $('.ampl img').attr('src',str);
});
$('.ampl').click(function(){
    $(this).fadeOut(300);
});

