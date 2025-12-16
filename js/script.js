/*
	script.js
	メインJS：3
	20220414 FN
*/

// クエリ引き回し
$(function () {

	var url_current = location.href; // 現URL取得
	if (url_current.match(/\?/)) {

		var query_area = '';
		var query_ads = '';
		var query_link = '';
		var query_form = '';

		query_get = url_current.split("?"); // クエリ取得（?以降）
		query_array = query_get[1].split("&"); // &で分離
		query_array.forEach (query_value => {
			query_data = query_value.split("=");
			if (query_data[0] == 'area') {
				query_area += '&' + query_data[0] + '=' + query_data[1]; // 分岐用（エリア）
			} else if (query_data[0] == 'ads') {
				query_ads += '&' + query_data[0] + '=' + query_data[1]; // 分岐用（広告）
			} else if (query_data[0].match(/^(?!search).*$/) && query_data[0] != 'page' && query_data[0] != 'sort' && query_data[0] != '' && query_data[1] != '') {
				query_link += '&' + query_data[0] + '=' + query_data[1]; // その他クエリ（検索クエリとページャー、空文字を除外）
			}
			if (query_data[0].match(/^(?!search).*$/) && query_data[0] != 'page' && query_data[0] != 'sort' && query_data[0] != '' && query_data[1] != '') {
				query_form += '<input type="hidden" name="' + query_data[0] + '" value="' + query_data[1] + '">'; // フォーム用
			}
		});

		if ((query_area) || (query_ads) || (query_link)) {

			// 自ドメイン
			domain = new RegExp(document.domain);

			// 全てのaタグを処理
			$('a').each(function() {
				var url_href = $(this).attr('href');
				if(typeof url_href !== "undefined") { // 正しいaタグか
					if (url_href.match(/^(?!http).*$/) || url_href.match(domain)) { // 外部URLか（http記述があっても自ドメインは適用）

						var query = '';

						if (url_href.match(/\?/)) { // URLにクエリがあるか
							if (url_href === "/" || url_href === "./") { // areaのみ除外する
								if (url_href.match(/ads=/)) {
									query = query_link;
								} else {
									query = query_link + query_ads;
								}
							} else {
								if (url_href.match(/area=/) && url_href.match(/ads=/)) {
									query = query_link;
								} else if (url_href.match(/area=/)) {
									query = query_link + query_ads;
								} else if (url_href.match(/ads=/)) {
									query = query_link + query_area;
								} else {
									query = query_link + query_area + query_ads;
								}
							}
						} else {
							if (query_link) {
								if (url_href === "/" || url_href === "./") { // areaのみ除外する
									query = '?' + query_link.slice(1) + query_ads;
								} else {
									query = '?' + query_link.slice(1) + query_area + query_ads;
								}
							} else {
								if (!query_area || url_href === "/" || url_href === "./") { // areaのみ除外する
									if (query_ads) {
										query = '?' + query_ads.slice(1);
									}
								} else {
									query = '?' + query_area.slice(1) + query_ads;
								}								
							}
						}

						// クエリに#アンカーが含まれる場合は削除する
						anker = query.match(/#+.*/)
						if (anker) query = query.replace(anker[0], "");
						anker = query.match(/%23+.*/) // URLエンコードも対応
						if (anker) query = query.replace(anker[0], "");

						// リンクの#アンカーをチェック
						anker = url_href.match(/#+.*/);
						if (anker) {
							url_href = url_href.replace(anker[0], "");
							$(this).attr('href', url_href + query + anker[0]); // クエリ付与（アンカーを最後に）
						} else {
							$(this).attr('href', url_href + query); // クエリ付与
						}

					}
				}
			});

			// フォーム用書き換え（9個まで対応）
			for (i = 1; i < 10; i++){
				if (document.getElementById('query_hidden_' + i)) {
					document.getElementById('query_hidden_' + i).innerHTML = query_form;
				}
			}

		}

	}

});

// ラジオボタン解除
var remove = 0;
function radioDeselection(already, numeric) {
	if(remove == numeric) {
		already.checked = false;
		remove = 0;
	} else {
		remove = numeric;
	}
}

// 並び替え
function sort_change(search_link, value) {

	if (value) {
		if (search_link) {
			value = search_link + '&sort=' + value;
		} else {
			value = '?sort=' + value;
		}
	} else {
		if (search_link) {
			value = search_link;
		} else {
			value = '?sort=';
		}
	}

	// クエリ引き回し
	var url_current = location.href; // 現URL
	var query_link = '';
	if (url_current.match(/\?/)) {
		query_get = url_current.split("?"); // クエリ取得（?以降）
		query_array = query_get[1].split("&"); // &で分離
		query_array.forEach (query_value => {
			query_data = query_value.split("=");
			if (query_data[0].match(/^(?!search).*$/) && query_data[0] != 'page' && query_data[0] != 'sort' && query_data[0] != '' && query_data[1] != '') { // 検索クエリとページャー、空文字を除外
				query_link += '&' + query_data[0] + '=' + query_data[1]; // リンク用
			}
		});
	}

	// クエリ取得（key）
	var params = (new URL(document.location)).searchParams;
	var query = '';
	for(var prm of params){
		if (prm[0].match(/key/)) {
			query += '&' + prm[0] + '=' + prm[1];
		}
	}

	location.href = value + query_link + query;
}

// 検索
function search_form(sort_link, search_mode) {
	var value = document.getElementsByName("search1[]");
	var search = '';
	let count = 0;
	for (i = 1; i < value.length/2+1; i++){
		if(document.getElementById(search_mode+"_check_1_"+i).checked) {
			search += "&search1[]=" + i;
			count++;
		}
	}
	if (search) {
		search += "&mode=" + search_mode;
		if (count == 1) search = search.replace("[]", "");
		if (sort_link) {
			value = sort_link + search;
		} else {
			value = search.replace("&", "?");
		}
	} else {
		if (sort_link) {
			value = sort_link;
		} else {
			value = '?search=';
		}
	}

	// クエリ取得（key）
	var params = (new URL(document.location)).searchParams;
	var query = '';
	for(var prm of params){
		if (prm[0].match(/key/)) {
			query += '&' + prm[0] + '=' + prm[1];
		}
	}

	location.href = value + query;
}



$(function() {

//画像リンクフェード効果
/* $('a img')//.not('.logo img')
.hover(function() {
	$(this).animate({opacity:0.7},200);
}, function() {
	$(this).animate({opacity:1},200);
}); */

  //■page topボタン
  var topBtn=$('#pageTop');
  topBtn.hide();
  //◇ボタンの表示設定
  $(window).scroll(function(){
    if($(this).scrollTop()>80){
      //---- 画面を80pxスクロールしたら、ボタンを表示する
      topBtn.fadeIn();
    }else{
      //---- 画面が80pxより上なら、ボタンを表示しない
      topBtn.fadeOut();
    }
  });
  // ◇ボタンをクリックしたら、スクロールして上に戻る
  topBtn.click(function(){
    $('body,html').animate({
    scrollTop: 0},500);
    return false;
  });

});

//比較表自動更新記述用
function updated_at() {
        var date = new Date();
        var y = date.getFullYear();
        var m = date.getMonth();
        if (m == 0) {
                m = 12;
                y--;
        }
        return y + "年" + m + "月"+"現在、各サイトに記載されていた情報を参考にしています。";
}

jQuery.easing.quart = function (x, t, b, c, d) {
    return -c * ((t=t/d-1)*t*t*t - 1) + b;
};

$(function() {

    //ヘッダーナビ用
  $(".func-nav-aco").on("click", function(){
if($(this).next("ul").css('display') == 'block') {
$(this).next("ul").slideToggle("normal");
} else {
$(".nav-aco ul").slideUp();
$(this).next("ul").slideToggle("normal");
}
});

$(function() {
    var $headerNav = $('.header-nav');
    var startPos = 0;
    $(window).scroll(function() {
        var currentPos = $(this).scrollTop();
        if (Math.abs(startPos - currentPos) < 20) return;
        if (currentPos > startPos) {
            if (currentPos >= 10) {
                $headerNav.slideUp('fast');
            }
        } else {
           $headerNav.slideDown('fast');
        }
        startPos = currentPos;
    });
});

  /**
   * アコーディオン
   */
  $("a.toggle").click(function() {

    var self = $(this);

    var target = self.attr("href");
    var $target = $(target);
    $target.slideToggle();

    self.toggleClass("open");

    return false;

  });

  /**
   * スムーススクロール
   */
  $('a[href^=#]').click(doScroll);

  function doScroll() {

    // 条件に合うものは処理しない
    var self = $(this);
    if(self.hasClass("toggle")) {
      return false;
    }

    var target = $(this).attr('href');
    if(target != "#"){
      target = $(target).offset().top;
      var offset = Number($("#container").css("padding-top").replace("px", ""));
      target -= offset;
      $("html, body").animate({ scrollTop: target}, 500, "quart");
    }else{
      $("html, body").animate({ scrollTop: 0}, 300, "quart");
    }
    return false;
  }

});


jQuery (function ($) {
    // footer offset
    if ($('#footer-bar').length) {
        $('.foffset').css('padding-top', $('#footer-bar').height() + 'px');
        $(window).resize(function () {
            $('.foffset').css('padding-top', $('#footer-bar').height() + 'px');
        });
    }

    // footer bar
    if ($('#footer-bar').length) {
        $(window).on('scroll', function () {
            if ($(this).scrollTop() > 400 && $('#footer-bar').hasClass('default')) {
                $('#footer-bar').removeClass('default').addClass('scrolled').css('bottom' , '0px');
            } else if ($(this).scrollTop() <= 400 && $('#footer-bar').hasClass('scrolled')) {
                $('#footer-bar').removeClass('scrolled').addClass('default').css('bottom' , '-140px');
            }
        });
    }
});


//   document.addEventListener('DOMContentLoaded', function () {
//     const sideBanner = document.querySelector('.bnr_fixed_side');
//     const fv = document.querySelector('.fv_image'); // ← FVのクラス名に合わせる

//     if (!sideBanner) return;

//     const EXTRA_OFFSET = 100; // FVを抜けてからさらに少し下がったら出す

//     function toggleSideBanner() {
//       const fvHeight = fv ? fv.offsetHeight : 0;
//       const scrollY = window.scrollY || window.pageYOffset;

//       if (scrollY > fvHeight + EXTRA_OFFSET) {
//         sideBanner.classList.add('is-visible');
//       } else {
//         sideBanner.classList.remove('is-visible');
//       }
//     }

//     toggleSideBanner();
//     window.addEventListener('scroll', toggleSideBanner, { passive: true });
//   });

document.addEventListener('DOMContentLoaded', function () {
    // ターゲットとなるCTA要素（下部固定されるバー）
    const fixedCta = document.querySelector('.fixed_cta'); 

    // 処理対象の要素を配列に格納し、存在しない要素（null）を除外
    const targets = [fixedCta, sideBanner].filter(el => el !== null); 

    // 処理対象の要素が一つもなければ終了
    if (targets.length === 0) return;

    // --- FV要素の決定ロジックの変更 ---
    // 優先順位を設けて、いずれかの要素を取得する
    // 1. .fv_image が存在するか確認
    let fvElement = document.querySelector('.fv');

    const EXTRA_OFFSET = 100; // FVを抜けてからさらに少し下がったら出す

    function toggleSideBanner() {

	const fvHeight = fv ? fv.offsetHeight : 0;

	const scrollY = window.scrollY || window.pageYOffset;



	if (scrollY > fvHeight + EXTRA_OFFSET) {

	sideBanner.classList.add('is-visible');

	} else {

	sideBanner.classList.remove('is-visible');

	}

	}

    // 初期状態のチェック
    toggleBanners();
    
    // スクロールイベントリスナーを設定
    window.addEventListener('scroll', toggleBanners, { passive: true });
});


/* 表高さ揃えjs */
// $(window).on('load resize', function() {

// h = 0,
// hnos = 0,
// hs = 0;
// var hnostag = "#result .result-area .no-scroll table tr:";
// var hstag = "#result .result-area .scroll table tr:";

// $("#result .result-area table").each(function(){
// number = 1;
// $("tr",this).each(function(){

// nthchild = 'nth-child(' + number + ')';
// hnos = $(hnostag + nthchild).removeAttr("style").height();
// hs = $(hstag + nthchild).removeAttr("style").height();

// if(hnos > hs){h = hnos}
// else{h = hs}

// $(hnostag + nthchild).css("height", h + "px");
// $(hstag + nthchild).css("height", h + "px");

// number++;

// });
// });

// });
