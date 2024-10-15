$(function($) {
    WindowHeight = $(window).height();
//    $('.drawr').css('height', WindowHeight); //メニューをwindowの高さいっぱいにする
     
    $(document).ready(function() {
        $('.navi_btn').click(function(){ //クリックしたら
      if($('.drawr').is(":animated")){
        return false;
      }else{
        $('.drawr').animate({width:'toggle'}); //animateで表示・非表示
        $(this).toggleClass('peke'); //toggleでクラス追加・削除
        return false;
      }
        });
    });
   
  //別領域をクリックでメニューを閉じる
  $(document).click(function(event) {
    if (!$(event.target).closest('.drawr').length) {
      $('.navi_btn').removeClass('peke');
      $('.drawr').hide();
    }
  });
   
});