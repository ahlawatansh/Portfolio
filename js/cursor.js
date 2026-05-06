// Custom Canvas Cursor
(function(){
  if(isMobile()) return;
  const canvas=document.getElementById('customCursor');
  const ctx=canvas.getContext('2d');
  let w,h,mx=0,my=0,cx=0,cy=0,size=10,targetSize=10;
  function resize(){w=canvas.width=window.innerWidth;h=canvas.height=window.innerHeight}
  resize();
  window.addEventListener('resize',debounce(resize,200));
  document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY});
  document.addEventListener('mouseover',e=>{
    if(e.target.closest('a,button,.project-card,.timeline__card,.skill-planet-card,.about__tool-tag,.about__stat,.contact__info-item'))targetSize=25;
  });
  document.addEventListener('mouseout',e=>{
    if(e.target.closest('a,button,.project-card,.timeline__card,.skill-planet-card,.about__tool-tag,.about__stat,.contact__info-item'))targetSize=10;
  });
  function draw(){
    cx=lerp(cx,mx,0.15);cy=lerp(cy,my,0.15);size=lerp(size,targetSize,0.12);
    ctx.clearRect(0,0,w,h);
    ctx.beginPath();ctx.arc(cx,cy,size,0,Math.PI*2);
    ctx.strokeStyle='rgba(221,14,63,0.5)';ctx.lineWidth=1.5;ctx.stroke();
    ctx.beginPath();ctx.arc(mx,my,3,0,Math.PI*2);
    ctx.fillStyle='#DD0E3F';ctx.fill();
    const g=ctx.createRadialGradient(cx,cy,0,cx,cy,size*2);
    g.addColorStop(0,'rgba(221,14,63,0.08)');g.addColorStop(1,'rgba(221,14,63,0)');
    ctx.beginPath();ctx.arc(cx,cy,size*2,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();
    requestAnimationFrame(draw);
  }
  draw();
})();
