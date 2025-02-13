$(function() {
			$('.show_more').click(function() {
				var show_text = $(this).parent('.block-ranking-txt').find('.text');
				var small_height = 200 //This is initial height.
				var original_height = show_text.css({
					height: 'auto'
				}).height();

				if (show_text.hasClass('open')) {
					/*CLOSE*/
					show_text.height(original_height).animate({
						height: small_height
					}, 300);
					show_text.removeClass('open');
					$(this).text('続きを読む').removeClass('active');
				} else {
					/*OPEN*/
					show_text.height(small_height).animate({
						height: original_height
					}, 300, function() {
						show_text.height('auto');
					});
					show_text.addClass('open');
					$(this).text('閉じる').addClass('active');
				}
			});
		})

		jQuery(function ($) {
		$('.js-accordion-title').on('click', function () {
		  /*クリックでコンテンツを開閉*/
		  $(this).next().slideToggle(200);
		  /*矢印の向きを変更*/
		  $(this).toggleClass('open', 200);
		});

		});
