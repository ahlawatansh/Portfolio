// Contact form — popup choice: Gmail or WhatsApp
(function(){
  const form=document.getElementById('contactForm');
  const canvas=document.getElementById('contactParticles');
  const modal=document.getElementById('sendModal');
  if(!form||!canvas||!modal) return;

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

  // Store form data between submit and choice
  let pendingData={name:'',email:'',message:''};

  // --- Modal helpers ---
  function openModal(){
    modal.classList.add('active');
    document.body.style.overflow='hidden';
  }
  function closeModal(){
    modal.classList.remove('active');
    document.body.style.overflow='';
  }

  // Close on backdrop click
  document.getElementById('sendModalBackdrop').addEventListener('click',closeModal);
  // Close on X button
  document.getElementById('sendModalClose').addEventListener('click',closeModal);
  // Close on Escape key
  document.addEventListener('keydown',e=>{if(e.key==='Escape') closeModal();});

  // --- Form submit: show popup ---
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const name=form.querySelector('#name').value.trim();
    const email=form.querySelector('#email').value.trim();
    const message=form.querySelector('#message').value.trim();
    if(!name||!email||!message) return;

    // Save form data
    pendingData={name,email,message};

    // Particle burst
    const btn=form.querySelector('button[type="submit"]');
    const rect=btn.getBoundingClientRect();
    const cRect=canvas.getBoundingClientRect();
    burst(rect.left+rect.width/2-cRect.left,rect.top+rect.height/2-cRect.top);
    animateParticles();

    // Open the choice modal
    openModal();
  });

  // --- Gmail button ---
  document.getElementById('sendViaGmail').addEventListener('click',()=>{
    const subject=encodeURIComponent(`Portfolio Contact from ${pendingData.name}`);
    const body=encodeURIComponent(`Hi Ansh Ahlawat,\nI am ${pendingData.name},\nEmail - ${pendingData.email},\nMessage - ${pendingData.message}`);
    window.open(`mailto:anshahlawat555@gmail.com?subject=${subject}&body=${body}`,'_self');
    closeModal();
    resetForm();
  });

  // --- WhatsApp button ---
  document.getElementById('sendViaWhatsApp').addEventListener('click',()=>{
    const text=encodeURIComponent(`Hi Ansh Ahlawat,\nI am ${pendingData.name},\nEmail - ${pendingData.email},\nMessage - ${pendingData.message}`);
    window.open(`https://wa.me/917357133910?text=${text}`,'_blank');
    closeModal();
    resetForm();
  });

  function resetForm(){
    const btn=form.querySelector('button[type="submit"]');
    btn.innerHTML='Sent! ✓';
    btn.style.background='#22c55e';
    setTimeout(()=>{btn.innerHTML='Submit';btn.style.background='';form.reset();},3000);
  }
})();
