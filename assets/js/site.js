// 파머스바이오 공통 스크립트
(function(){
  var hdr=document.getElementById('hdr');
  if(hdr && !hdr.classList.contains('static-solid')){
    var onScroll=function(){hdr.classList.toggle('solid',window.scrollY>8);};
    window.addEventListener('scroll',onScroll);onScroll();
  }
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}})},{threshold:.12});
  document.querySelectorAll('.rv').forEach(function(el,i){el.style.transitionDelay=(i%3*0.07)+'s';io.observe(el);});
  window.closeM=function(){var m=document.getElementById('mnav');if(m)m.classList.remove('open');};
  window.openM=function(){var m=document.getElementById('mnav');if(m)m.classList.add('open');};
  // ESC 키로 모바일 메뉴 닫기
  document.addEventListener('keydown',function(e){if(e.key==='Escape'||e.key==='Esc'){window.closeM();}});
  document.querySelectorAll('a.todo').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();alert('페이지 준비 중입니다.');});});
  document.querySelectorAll('nav.main .mi>a').forEach(function(a){if(a.getAttribute('href')==='#')a.addEventListener('click',function(e){e.preventDefault();});});

  // 개인정보처리방침 · 이용약관 → 페이지 내 모달(팝업)
  var M=null;
  function buildDocModal(){
    var ov=document.createElement('div');
    ov.id='docModal';
    ov.style.cssText='position:fixed;inset:0;z-index:400;background:rgba(20,22,44,.55);-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px);display:none;align-items:center;justify-content:center;padding:32px 16px';
    ov.innerHTML='<div style="background:#fff;border-radius:12px;width:100%;max-width:760px;height:min(84vh,880px);display:flex;flex-direction:column;overflow:hidden;box-shadow:0 30px 70px rgba(20,22,44,.3)">'
      +'<div style="display:flex;align-items:center;justify-content:space-between;padding:16px 24px;border-bottom:1px solid #E4DFD3;flex:0 0 auto"><b id="docTitle" style="font-size:16px;font-weight:800;letter-spacing:-.02em;color:#1C1A16"></b><button type="button" id="docX" aria-label="닫기" style="background:none;border:0;font-size:22px;line-height:1;color:#948F82;cursor:pointer;padding:4px">&#10005;</button></div>'
      +'<iframe id="docFrame" title="문서" style="flex:1 1 auto;width:100%;border:0;display:block"></iframe></div>';
    document.body.appendChild(ov);
    var frame=ov.querySelector('#docFrame');
    function close(){ov.style.display='none';frame.src='about:blank';document.body.style.overflow='';}
    ov.addEventListener('click',function(e){if(e.target===ov)close();});
    ov.querySelector('#docX').addEventListener('click',close);
    document.addEventListener('keydown',function(e){if(e.key==='Escape'||e.key==='Esc')close();});
    M={ov:ov,frame:frame,title:ov.querySelector('#docTitle'),close:close};
    return M;
  }
  function openDoc(href,label){
    if(!M)buildDocModal();
    M.title.textContent=label;
    M.frame.src=href+(href.indexOf('?')<0?'?embed=1':'&embed=1');
    M.ov.style.display='flex';
    document.body.style.overflow='hidden';
  }
  document.querySelectorAll('a[href$="privacy.html"],a[href$="terms.html"]').forEach(function(a){
    a.addEventListener('click',function(e){
      e.preventDefault();
      var href=a.getAttribute('href');
      var label=(a.textContent||'').trim() || (href.indexOf('privacy')>=0?'개인정보처리방침':'이용약관');
      openDoc(href,label);
    });
  });
})();
