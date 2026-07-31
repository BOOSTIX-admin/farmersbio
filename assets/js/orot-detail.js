/* 오롯농장 약콩낫또 상세페이지 — 공용 데이터 + 렌더러
   상세 슬라이스(860px) 사이 3개 영상 슬롯에 제조/시연 영상을 삽입한다.
   brand-welliz.html(모달)과 product-orot-*.html(단독 페이지)이 함께 사용. */
(function (global) {
  'use strict';

  var H = {
    black:  [1304, 1752, 1312, 1620, 1114, 1577, 1292, 1489, 960, 1434, 1370, 1217, 1506],
    yellow: [1304, 1752, 1312, 1621, 1113, 1578, 1292, 1488, 960, 1435, 1272, 1314, 1506]
  };

  function slices(key, from, to) {
    var out = [];
    for (var n = from; n <= to; n++) {
      out.push({
        t: 'img',
        src: 'img/orot/' + key + '/detail_' + (n < 10 ? '0' + n : n) + '.jpg',
        w: 860,
        h: H[key][n - 1]
      });
    }
    return out;
  }

  function vid(src, poster, label) {
    return { t: 'video', src: 'video/orot/' + src, poster: 'img/orot/poster/' + poster, label: label, w: 860, h: 484 };
  }

  function build(key, textureVid, mixVid, mixLabel) {
    return [].concat(
      [vid('hero.mp4', 'hero.jpg', '오롯농장 · 안동에서 콩부터 발효까지')],
      slices(key, 1, 3),
      [vid(textureVid + '.mp4', textureVid + '.jpg', '실처럼 이어지는 낫또 특유의 점성')],
      slices(key, 4, 6),
      [vid('andong.mp4', 'andong.jpg', '안동 자체 제조 공장 · HACCP 위생 라인')],
      slices(key, 7, 7),
      [vid(mixVid + '.mp4', mixVid + '.jpg', mixLabel)],
      slices(key, 8, 13)
    );
  }

  var DATA = {
    black: {
      name: '오롯농장 검정약콩낫또',
      desc: '국내산 검정약콩(쥐눈이콩)을 자체 개발 균주로 발효한 오롯농장 낫또.',
      blocks: build('black', 'black-texture', 'black-mix', '소스를 넣고 약 50번 충분히 젓기')
    },
    yellow: {
      name: '오롯농장 노랑약콩낫또',
      desc: '국내산 노랑약콩을 자체 개발 균주로 발효한 오롯농장 낫또.',
      blocks: build('yellow', 'yellow-texture', 'yellow-mix', '소스를 넣고 약 50번 충분히 젓기')
    }
  };

  /* 화면에 들어올 때만 재생 — 데이터 절약 + 모바일 배터리 보호 */
  var io = null;
  function observer() {
    if (io || !('IntersectionObserver' in global)) return io;
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting) {
          if (v.preload === 'none') { v.preload = 'auto'; v.load(); }
          var p = v.play(); if (p && p.catch) p.catch(function () {});
        } else if (!v.paused) { v.pause(); }
      });
    }, { rootMargin: '200px 0px', threshold: 0.01 });
    return io;
  }

  function render(key, mount, prefix) {
    var data = DATA[key];
    if (!data || !mount) return;
    prefix = prefix || '';
    mount.innerHTML = '';
    var frag = document.createDocumentFragment();

    data.blocks.forEach(function (b, i) {
      if (b.t === 'img') {
        var img = document.createElement('img');
        img.src = prefix + b.src;
        img.width = b.w; img.height = b.h;
        img.alt = data.name + ' 상세 이미지 ' + (i + 1);
        img.decoding = 'async';
        if (i > 1) img.loading = 'lazy';
        frag.appendChild(img);
      } else {
        var fig = document.createElement('figure');
        fig.className = 'odv';
        var v = document.createElement('video');
        v.muted = true; v.loop = true; v.playsInline = true; v.controls = false;
        v.setAttribute('muted', ''); v.setAttribute('playsinline', '');
        v.setAttribute('webkit-playsinline', '');
        v.preload = 'none';
        v.poster = prefix + b.poster;
        v.width = b.w; v.height = b.h;
        v.setAttribute('aria-label', b.label);
        var s = document.createElement('source');
        s.src = prefix + b.src; s.type = 'video/mp4';
        v.appendChild(s);
        fig.appendChild(v);
        if (b.label) {
          var cap = document.createElement('figcaption');
          cap.textContent = b.label;
          fig.appendChild(cap);
        }
        frag.appendChild(fig);
        var ob = observer();
        if (ob) ob.observe(v); else { v.preload = 'auto'; v.autoplay = true; }
      }
    });

    mount.appendChild(frag);
  }

  function stop(mount) {
    if (!mount) return;
    Array.prototype.forEach.call(mount.querySelectorAll('video'), function (v) {
      v.pause();
      if (io) io.unobserve(v);
    });
  }

  global.OrotDetail = { data: DATA, render: render, stop: stop };
})(window);
