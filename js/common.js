

$(document).ready(function () {
  $(".review_trigger").each(function () {
    if ($(this).hasClass("active")) {
      $(this).next(".review_content").css("display", "block");
    } else {
      $(this).next(".review_content").css("display", "none");
    }
  });

  // クリックイベントの設定
  $(".review_trigger").click(function () {
    const content = $(this).next(".review_content");
    if (content.css("display") == "none") {
      $(this).addClass("active");
      content.slideDown("fast");
    } else {
      $(this).removeClass("active");
      content.slideUp("fast");
    }
  });
});


$(function () {
new ScrollHint('.js-scrollable', {
      suggestiveShadow: true,
      i18n: {
          scrollable: 'スクロールできます'
      }
});
});

$(function () {
	var BtmBtn = $('.fixed_cta');
	BtmBtn.hide();
	$(window).scroll(function () {
		if ($(this).scrollTop() > 500) {
			BtmBtn.fadeIn();
		} else {
			BtmBtn.fadeOut();
		}
	});
});

$(function() {
    var height=$(".fixed_cta").height();
    $("body").css("padding-bottom", height);
    $(".page_top").css("bottom", height + 10);
});

$(function(){
	setTimeout(function(){
		$('.fixed_cta2').fadeIn();
	},60000);
});

$(function(){
	$('.fixed_cta2 .close').click(function() {
		$('.fixed_cta2').fadeToggle('fade');
	});
});




let section10Swipers = [];

function initSection10Swipers() {
  const isMobile = window.innerWidth <= 768;
  const swiperSections = document.querySelectorAll('.section10-swiper');

  swiperSections.forEach((section, index) => {
    const itemsEl = section.querySelector('.items');
    const slides = section.querySelectorAll('.item');
    const paginationEl = section.querySelector('.swiper-pagination');
    const prevEl = section.querySelector('.swiper-button-prev');
    const nextEl = section.querySelector('.swiper-button-next');

    // Swiperがすでに初期化されているか
    const alreadyInited = section.classList.contains('swiper-initialized');

    if (isMobile && !alreadyInited) {
      // クラス追加
      itemsEl.classList.add('swiper-wrapper');
      slides.forEach(slide => slide.classList.add('swiper-slide'));
      section.classList.add('swiper');

      // Swiper初期化
      const swiper = new Swiper(section, {
        slidesPerView: 1,
        spaceBetween: 10,
        centeredSlides: true,
        pagination: {
          el: paginationEl,
          clickable: true,
        },
        navigation: {
          nextEl: nextEl,
          prevEl: prevEl,
        },
      });

      section10Swipers[index] = swiper;

    } else if (!isMobile && alreadyInited && section10Swipers[index]) {
      // Swiper破棄（PC表示）
      section10Swipers[index].destroy(true, true);
      section10Swipers[index] = null;

      itemsEl.classList.remove('swiper-wrapper');
      slides.forEach(slide => slide.classList.remove('swiper-slide'));
      section.classList.remove('swiper');
    }
  });
}

// タブ切り替え処理
document.addEventListener('DOMContentLoaded', function () {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const swiperSections = document.querySelectorAll('.section10-swiper');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      // ボタン切替
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetId = btn.getAttribute('data-tab');

      // コンテンツ切替
      swiperSections.forEach(section => {
        if (section.id === targetId) {
          section.style.display = 'block';
        } else {
          section.style.display = 'none';
        }
      });

      // Swiper再初期化（モバイルのみ）
      setTimeout(() => {
        initSection10Swipers();
      }, 100);
    });
  });
});

window.addEventListener('load', initSection10Swipers);
window.addEventListener('resize', initSection10Swipers);




document.addEventListener('DOMContentLoaded', function () {
  const toggleBtns = document.querySelectorAll('.accordion_toggle');

  toggleBtns.forEach(function (toggleBtn) {
    const content = toggleBtn.nextElementSibling; // アコーディオンの中身

    // 初期状態で .open クラスがあれば開く
    const isInitiallyOpen = toggleBtn.classList.contains('open') || toggleBtn.classList.contains('active');
    if (isInitiallyOpen) {
      content.style.display = 'block';
    }

    // クリックイベントでトグル動作
    toggleBtn.addEventListener('click', function () {
      const isOpen = content.style.display === 'block';
      content.style.display = isOpen ? 'none' : 'block';
      toggleBtn.classList.toggle('open', !isOpen);
    });
  });
});


document.addEventListener('DOMContentLoaded', function () {
  document.addEventListener('click', function(e){
    const btn = e.target.closest('.toggle-button');
    if(!btn) return;

    // 同じ親要素内の .toggle-content を取得（直後でなくてもOK）
    const content = btn.parentElement.querySelector('.toggle-content');
    if(!content) return;

    const willOpen = content.hasAttribute('hidden');
    if (willOpen) {
      content.removeAttribute('hidden');
      content.style.display = 'block';     // 古いCSSの display:none を上書き
      btn.textContent = '日程を隠す';
      btn.setAttribute('aria-expanded','true');
    } else {
      content.setAttribute('hidden','');
      content.style.display = '';          // インラインstyleをクリア
      btn.textContent = '日程を表示';
      btn.setAttribute('aria-expanded','false');
    }
  });
});


