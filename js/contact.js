// Contact form + particle burst
(function(){
  const form=document.getElementById('contactForm');
  const canvas=document.getElementById('contactParticles');
  if(!form||!canvas) return;
  const ctx=canvas.getContext('2d');
  let particles=[];
  function resizeCanvas(){canvas.width=canvas.parentElement.clientWidth;canvas.height=canvas.parentElement.clientHeight}
  resizeCanvas();
  window.addEventListener('resize',debounce(resizeCanvas,200));

  function burst(x,y){
    for(let i=0;i<40;i++){
      const angle=Math.random()*Math.PI*2;
      const speed=Math.random()*4+2;
      particles.push({x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,life:1,size:Math.random()*4+2,color:`rgba(221,${Math.floor(14+Math.random()*30)},${Math.floor(50+Math.random()*20)},`});
    }
  }

  function animateParticles(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles=particles.filter(p=>p.life>0);
    particles.forEach(p=>{
      p.x+=p.vx;p.y+=p.vy;p.vy+=0.05;p.life-=0.015;
      ctx.beginPath();ctx.arc(p.x,p.y,p.size*p.life,0,Math.PI*2);
      ctx.fillStyle=p.color+p.life+')';ctx.fill();
    });
    if(particles.length>0) requestAnimationFrame(animateParticles);
  }

  form.addEventListener('submit',e=>{
    e.preventDefault();
    const name=form.querySelector('#name').value.trim();
    const email=form.querySelector('#email').value.trim();
    const message=form.querySelector('#message').value.trim();
    if(!name||!email||!message) return;

    // Open mailto with pre-filled data
    const subject=encodeURIComponent(`Portfolio Contact from ${name}`);
    const body=encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    window.location.href=`mailto:anshahlawat555@gmail.com?subject=${subject}&body=${body}`;

    const btn=form.querySelector('button[type="submit"]');
    const rect=btn.getBoundingClientRect();
    const cRect=canvas.getBoundingClientRect();
    burst(rect.left+rect.width/2-cRect.left,rect.top+rect.height/2-cRect.top);
    animateParticles();
    btn.innerHTML='Sent! ✓';
    btn.style.background='#22c55e';
    setTimeout(()=>{btn.innerHTML='Submit';btn.style.background='';form.reset()},3000);
  });
})();
