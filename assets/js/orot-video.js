/* 오롯농장 상세페이지 영상 제어 (단독 페이지 · 모달 공용)
   - 화면에 들어올 때만 로드·재생 (데이터·배터리 절약)
   - play()는 배경 탭 절전 정책 등으로 거절될 수 있으므로 재생 가능 시점과
     탭 복귀 시점에 다시 시도한다. load()는 play()를 중단시키므로 쓰지 않는다. */
(function (global) {
  'use strict';

  var watched = [];
  var io = null;

  function tryPlay(v) {
    if (v.dataset.owant !== '1') return;
    var p = v.play();
    if (p && p.catch) p.catch(function () {});
  }

  function observer() {
    if (io || !('IntersectionObserver' in global)) return io;
    io = new IntersectionObserver(function (entries) {
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
    return io;
  }

  /* root 안의 영상을 감시 대상으로 등록. 모달처럼 나중에 삽입된 DOM에도 쓴다. */
  function init(root) {
    root = root || document;
    var vids = [].slice.call(root.querySelectorAll('.odoc video, .odhero video'));
    var ob = observer();
    vids.forEach(function (v) {
      if (v.dataset.oinit === '1') return;
      v.dataset.oinit = '1';
      v.muted = true;                    // 속성만으로 부족한 브라우저 대비
      v.addEventListener('canplay', function () { tryPlay(v); });
      watched.push(v);
      if (ob) ob.observe(v);
      else { v.dataset.owant = '1'; v.preload = 'auto'; v.autoplay = true; tryPlay(v); }
    });
    return vids.length;
  }

  function stop(root) {
    root = root || document;
    [].slice.call(root.querySelectorAll('video')).forEach(function (v) {
      v.dataset.owant = '';
      v.pause();
      if (io) io.unobserve(v);
      var i = watched.indexOf(v);
      if (i > -1) watched.splice(i, 1);
    });
  }

  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') watched.forEach(tryPlay);
  });

  global.OrotVideo = { init: init, stop: stop };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { init(document); });
  } else {
    init(document);
  }
})(window);
