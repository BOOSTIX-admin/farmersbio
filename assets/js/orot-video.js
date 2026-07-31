/* 오롯농장 상세페이지 영상 제어 (단독 페이지 · 모달 공용)
   - 화면에 들어올 때만 로드·재생 (데이터·배터리 절약)
   - play()는 배경 탭 절전 정책 등으로 거절될 수 있으므로 재생 가능 시점과
     탭 복귀 시점에 다시 시도한다. load()는 play()를 중단시키므로 쓰지 않는다.
   - 모달은 닫을 때 stop()으로 관찰을 끊고 다시 열 때 init()으로 되돌린다.
     그래서 "리스너를 붙였는가(obound)"와 "지금 관찰 중인가"를 분리해서 관리한다. */
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

  /* root 안의 영상을 감시 대상으로 등록.
     이미 등록됐던 영상도 다시 observe 한다 — stop() 이후 재오픈 시 필요하다.
     observe()를 중복 호출하는 것은 무해하고, 재관찰하면 현재 교차 상태로 콜백이
     한 번 더 불려서 화면 안에 있으면 즉시 다시 재생된다. */
  function init(root) {
    root = root || document;
    var vids = [].slice.call(root.querySelectorAll('.odoc video, .odhero video'));
    var ob = observer();

    vids.forEach(function (v) {
      if (v.dataset.obound !== '1') {          // 리스너는 요소당 한 번만
        v.dataset.obound = '1';
        v.muted = true;                        // 속성만으로 부족한 브라우저 대비
        v.addEventListener('canplay', function () { tryPlay(v); });
      }
      if (watched.indexOf(v) === -1) watched.push(v);

      if (ob) {
        ob.observe(v);
      } else {
        v.dataset.owant = '1';
        v.preload = 'auto';
        v.autoplay = true;
        tryPlay(v);
      }
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
