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


document.addEventListener('DOMContentLoaded', function () {
  const cta = document.querySelector('.fixed_cta');
  if (!cta) return;

  const showAfter = 300;     // 何pxスクロールで表示するか
  const hideBottom = 80;     // 最下部から何px以内で隠すか（調整用）

  // フッター要素（Elementorで付けた .site-footer があれば優先）
  const footer = document.querySelector('.site-footer') || document.querySelector('footer');

  // ページ最下部判定
  const isNearBottom = () => {
    const scrollBottom = window.scrollY + window.innerHeight;
    const docHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    );
    return (docHeight - scrollBottom) <= hideBottom;
  };

  // スクロール量＋最下部で表示制御
  const updateByScroll = () => {
    // フッターが見えてる間は強制非表示（IntersectionObserverからセットされる）
    if (cta.dataset.footerHidden === "1") {
      cta.classList.remove('is-visible');
      return;
    }

    // 最下部付近なら非表示
    if (isNearBottom()) {
      cta.classList.remove('is-visible');
      return;
    }

    // 通常の表示条件
    if (window.scrollY > showAfter) cta.classList.add('is-visible');
    else cta.classList.remove('is-visible');
  };

  updateByScroll();
  window.addEventListener('scroll', updateByScroll, { passive: true });
  window.addEventListener('resize', updateByScroll);

  // フッターが画面に入ったらCTAを強制的に隠す（併用OK）
  if (footer && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          cta.classList.remove('is-visible');
          cta.dataset.footerHidden = "1";
        } else {
          cta.dataset.footerHidden = "0";
          updateByScroll(); // フッターから離れたら再判定
        }
      });
    }, { root: null, threshold: 0.01 });

    observer.observe(footer);
  }
});