// 파머스바이오 공통 스크립트
(function(){
  'use strict';
  var hdr=document.getElementById('hdr');
  if(hdr && !hdr.classList.contains('static-solid')){
    var onScroll=function(){hdr.classList.toggle('solid',window.scrollY>8);};
    window.addEventListener('scroll',onScroll);onScroll();
  }
  var revealEls=document.querySelectorAll('.rv');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}})},{threshold:.12});
    revealEls.forEach(function(el,i){el.style.transitionDelay=(i%3*0.07)+'s';io.observe(el);});
  }else{revealEls.forEach(function(el){el.classList.add('in');});}

  var mnav=document.getElementById('mnav');
  var menuOpeners=document.querySelectorAll('[onclick*="openM"]');
  var pageRegions=document.querySelectorAll('main,footer');
  var lastMenuFocus=null;
  if(mnav){mnav.setAttribute('aria-hidden','true');}
  menuOpeners.forEach(function(btn){btn.setAttribute('aria-controls','mnav');btn.setAttribute('aria-expanded','false');});
  function focusables(root){return Array.prototype.slice.call(root.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])')).filter(function(el){var style=window.getComputedStyle(el);return style.display!=='none'&&style.visibility!=='hidden';});}
  window.closeM=function(restoreFocus){
    if(!mnav)return;
    mnav.classList.remove('open');mnav.setAttribute('aria-hidden','true');document.body.style.overflow='';
    pageRegions.forEach(function(region){region.removeAttribute('aria-hidden');region.inert=false;});
    menuOpeners.forEach(function(btn){btn.setAttribute('aria-expanded','false');});
    if(restoreFocus!==false&&lastMenuFocus){lastMenuFocus.focus();}
  };
  window.openM=function(){
    if(!mnav)return;
    lastMenuFocus=document.activeElement;mnav.classList.add('open');mnav.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';
    pageRegions.forEach(function(region){region.setAttribute('aria-hidden','true');region.inert=true;});
    menuOpeners.forEach(function(btn){btn.setAttribute('aria-expanded','true');});
    var items=focusables(mnav);if(items.length)setTimeout(function(){items[0].focus();},0);
  };
  document.addEventListener('keydown',function(e){
    if(!mnav||!mnav.classList.contains('open'))return;
    if(e.key==='Escape'||e.key==='Esc'){e.preventDefault();window.closeM();return;}
    if(e.key==='Tab'){var items=focusables(mnav);if(!items.length)return;var first=items[0],last=items[items.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}
  });
  document.querySelectorAll('a.todo').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();alert('페이지 준비 중입니다.');});});
  document.querySelectorAll('nav.main .mi>a').forEach(function(a){if(a.getAttribute('href')==='#')a.addEventListener('click',function(e){e.preventDefault();});});

  // 개인정보처리방침 · 이용약관 → 페이지 내 모달(팝업)
  var M=null;
  function buildDocModal(){
    var ov=document.createElement('div');
    ov.id='docModal';
    ov.style.cssText='position:fixed;inset:0;z-index:400;background:rgba(20,22,44,.55);-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px);display:none;align-items:center;justify-content:center;padding:32px 16px';
    ov.innerHTML='<div role="dialog" aria-modal="true" aria-labelledby="docTitle" style="background:#fff;border-radius:12px;width:100%;max-width:760px;height:min(84vh,880px);display:flex;flex-direction:column;overflow:hidden;box-shadow:0 30px 70px rgba(20,22,44,.3)">'
      +'<div style="display:flex;align-items:center;justify-content:space-between;padding:16px 24px;border-bottom:1px solid #E4DFD3;flex:0 0 auto"><b id="docTitle" style="font-size:16px;font-weight:800;letter-spacing:-.02em;color:#1C1A16"></b><button type="button" id="docX" aria-label="닫기" style="background:none;border:0;font-size:22px;line-height:1;color:#948F82;cursor:pointer;padding:4px">&#10005;</button></div>'
      +'<iframe id="docFrame" title="문서" style="flex:1 1 auto;width:100%;border:0;display:block"></iframe></div>';
    document.body.appendChild(ov);
    var frame=ov.querySelector('#docFrame');
    function close(){ov.style.display='none';frame.src='about:blank';document.body.style.overflow='';if(M&&M.lastFocus)M.lastFocus.focus();}
    ov.addEventListener('click',function(e){if(e.target===ov)close();});
    ov.querySelector('#docX').addEventListener('click',close);
    document.addEventListener('keydown',function(e){
      if(ov.style.display!=='flex')return;
      if(e.key==='Escape'||e.key==='Esc'){e.preventDefault();close();return;}
      if(e.key==='Tab'){var items=focusables(ov);if(!items.length)return;var first=items[0],last=items[items.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}
    });
    M={ov:ov,frame:frame,title:ov.querySelector('#docTitle'),close:close};
    return M;
  }
  function openDoc(href,label){
    if(!M)buildDocModal();
    M.lastFocus=document.activeElement;
    M.title.textContent=label;
    M.frame.src=href+(href.indexOf('?')<0?'?embed=1':'&embed=1');
    M.ov.style.display='flex';
    document.body.style.overflow='hidden';
    M.ov.querySelector('#docX').focus();
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
