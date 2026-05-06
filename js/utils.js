// Utility functions
function lerp(a,b,t){return a+(b-a)*t}
function clamp(v,min,max){return Math.min(Math.max(v,min),max)}
function debounce(fn,d){let t;return function(...a){clearTimeout(t);t=setTimeout(()=>fn.apply(this,a),d)}}
function isMobile(){return window.innerWidth<=768||'ontouchstart' in window}
function splitTextToChars(el){
  const text=el.textContent;
  el.innerHTML='';
  el.setAttribute('aria-label',text);
  [...text].forEach(c=>{
    const span=document.createElement('span');
    span.classList.add('char');
    span.textContent=c===' '?'\u00A0':c;
    el.appendChild(span);
  });
  return el.querySelectorAll('.char');
}
