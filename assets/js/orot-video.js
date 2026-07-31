/* 오롯농장 상세페이지 영상 제어
   - 화면에 들어올 때만 로드·재생 (데이터·배터리 절약)
   - play()는 배경 탭 절전 정책 등으로 거절될 수 있으므로 재생 가능 시점과
     탭 복귀 시점에 다시 시도한다. load()는 play()를 중단시키므로 쓰지 않는다. */
(function () {
  'use strict';
  var vids = [].slice.call(document.querySelectorAll('.odoc video, .odhero video'));
  if (!vids.length) return;

  function tryPlay(v) {
    if (v.dataset.owant !== '1') return;
    var p = v.play();
    if (p && p.catch) p.catch(function () {});
  }

  vids.forEach(function (v) {
    v.muted = true;                       // 속성만으로는 부족한 브라우저 대비
    v.addEventListener('canplay', function () { tryPlay(v); });
  });

  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') vids.forEach(tryPlay);
  });

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting) {
          v.dataset.owant = '1';
          if (v.preload === 'none') v.preload = 'auto';
          tryPlay(v);
        } else {
          v.dataset.owant = '';
          if (!v.paused) v.pause();
        }
      });
    }, { rootMargin: '300px 0px', threshold: 0.01 });
    vids.forEach(function (v) { io.observe(v); });
  } else {
    vids.forEach(function (v) { v.dataset.owant = '1'; v.preload = 'auto'; v.autoplay = true; tryPlay(v); });
  }
})();
