// Main App Orchestrator
(function(){
  const preloader=document.getElementById('preloader');
  const preloaderFill=document.getElementById('preloaderFill');
  const preloaderChars=preloader.querySelectorAll('.preloader__text span');

  gsap.registerPlugin(ScrollTrigger);

  gsap.to(preloaderChars,{y:0,stagger:0.08,duration:0.6,ease:'power3.out',delay:0.2});
  gsap.to(preloaderFill,{width:'100%',duration:2.0,ease:'power2.inOut',delay:0.3,onComplete:()=>{
    gsap.to(preloader,{yPercent:-100,duration:0.8,ease:'power3.inOut',onComplete:()=>{
      preloader.style.display='none';
      initSite();
    }});
  }});

  function initSite(){
    // Lenis
    const lenis=new Lenis({autoRaf:true});
    lenis.on('scroll',ScrollTrigger.update);
    gsap.ticker.add(t=>lenis.raf(t*1000));
    gsap.ticker.lagSmoothing(0);

    // --- Hero Animations (split layout) ---
    gsap.to('.hero__text-side',{opacity:1,y:0,duration:0.8,ease:'power3.out',delay:0.1});
    gsap.to('.hero__photo-side',{opacity:1,y:0,duration:0.9,ease:'power3.out',delay:0.3});
    gsap.to('.hero__experience-badge',{opacity:1,x:0,duration:0.7,ease:'power3.out',delay:0.7});
    gsap.to('#scrollHint',{opacity:1,duration:0.6,ease:'power3.out',delay:1.0});

    // Hero continuous parallax on scroll (no opacity change — prevents vanishing on scroll back up)
    gsap.to('.hero__text-side',{y:-80,scrollTrigger:{trigger:'#hero',start:'top top',end:'bottom top',scrub:1}});
    gsap.to('.hero__photo-side',{y:-40,scrollTrigger:{trigger:'#hero',start:'top top',end:'bottom top',scrub:1}});

    // --- About: continuous parallax ---
    gsap.to('.about__text-block',{opacity:1,y:0,duration:0.8,ease:'power3.out',scrollTrigger:{trigger:'.about__text-block',start:'top 80%'}});
    gsap.to('.about__stats-card',{opacity:1,y:0,duration:0.8,delay:0.2,ease:'power3.out',scrollTrigger:{trigger:'.about__stats-card',start:'top 80%'}});
    // Continuous parallax on about section elements while scrolling
    gsap.to('.about__text-block',{y:-30,scrollTrigger:{trigger:'#about',start:'top bottom',end:'bottom top',scrub:1}});
    gsap.to('.about__stats-card',{y:-50,scrollTrigger:{trigger:'#about',start:'top bottom',end:'bottom top',scrub:1}});
    gsap.to('.section-bg-grid',{y:-60,scrollTrigger:{trigger:'#about',start:'top bottom',end:'bottom top',scrub:1}});

    // --- Skills: continuous parallax ---
    gsap.to('.radar-bg-glow',{y:-40,scrollTrigger:{trigger:'#skills',start:'top bottom',end:'bottom top',scrub:1}});
    gsap.to('.radar-wrapper',{y:-25,scrollTrigger:{trigger:'#skills',start:'top bottom',end:'bottom top',scrub:1}});
    gsap.to('.skills__header',{y:-15,scrollTrigger:{trigger:'#skills',start:'top bottom',end:'bottom top',scrub:1}});

    // --- Experience: continuous parallax ---
    document.querySelectorAll('.timeline__item').forEach((item,i)=>{
      gsap.to(item,{opacity:1,y:0,duration:0.7,delay:i*0.15,ease:'power3.out',scrollTrigger:{trigger:item,start:'top 85%'}});
    });
    // Continuous parallax on experience elements
    gsap.to('.experience__header',{y:-20,scrollTrigger:{trigger:'#experience',start:'top bottom',end:'bottom top',scrub:1}});
    gsap.to('.timeline',{y:-15,scrollTrigger:{trigger:'#experience',start:'top bottom',end:'bottom top',scrub:1}});

    // --- Section title reveals ---
    document.querySelectorAll('.text-display').forEach(el=>{
      gsap.from(el,{opacity:0,y:40,duration:0.8,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 85%'}});
    });

    // --- Projects: staggered reveal + horizontal scroll ---
    const cards=document.querySelectorAll('.project-card');
    cards.forEach((c,i)=>{
      gsap.to(c,{opacity:1,y:0,duration:0.6,delay:i*0.1,ease:'power3.out',scrollTrigger:{trigger:'#projects',start:'top 60%'}});
    });
    if(window.innerWidth>768){
      const carousel=document.getElementById('projectsCarousel');
      const wrapper=document.querySelector('.projects__carousel-wrapper');
      if(carousel&&wrapper){
        setTimeout(()=>{
          const startOffset=200;
          gsap.set(carousel,{x:startOffset});
          const scrollDist=carousel.scrollWidth-wrapper.clientWidth+startOffset;
          if(scrollDist>0){
            gsap.fromTo(carousel,{x:startOffset},{
              x:-scrollDist+startOffset,
              ease:'none',
              scrollTrigger:{
                trigger:'#projects',
                start:'top top',
                end:()=>`+=${scrollDist+600}`,
                pin:true,
                scrub:0.5,
                invalidateOnRefresh:true,
                anticipatePin:1
              }
            });
          }
        },500);
      }
    }

    // --- Contact: continuous parallax ---
    gsap.from('.contact__info-side',{opacity:0,y:40,duration:0.8,ease:'power3.out',scrollTrigger:{trigger:'#contact',start:'top 70%'}});
    gsap.from('.contact__form-side',{opacity:0,y:40,delay:0.2,duration:0.8,ease:'power3.out',scrollTrigger:{trigger:'#contact',start:'top 70%'}});
    gsap.to('.contact__header',{y:-20,scrollTrigger:{trigger:'#contact',start:'top bottom',end:'bottom top',scrub:1}});

    // --- Scroll Ring Indicator ---
    const scrollRingProgress=document.getElementById('scrollRingProgress');
    const circumference=125.66;
    window.addEventListener('scroll',()=>{
      const scrollTop=window.scrollY;
      const docHeight=document.documentElement.scrollHeight-window.innerHeight;
      const progress=clamp(scrollTop/docHeight,0,1);
      scrollRingProgress.style.strokeDashoffset=circumference*(1-progress);
    });

    // --- Nav active state ---
    const navLinks=document.querySelectorAll('.nav__link[data-section]');
    const sections=document.querySelectorAll('.section[id]');
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          navLinks.forEach(l=>l.classList.remove('active'));
          const active=document.querySelector(`.nav__link[data-section="${entry.target.id}"]`);
          if(active) active.classList.add('active');
        }
      });
    },{threshold:0.3});
    sections.forEach(s=>observer.observe(s));

    // Nav hide on scroll
    let lastScroll=0;
    window.addEventListener('scroll',debounce(()=>{
      const current=window.scrollY;
      document.getElementById('nav').classList.toggle('hidden',current>lastScroll&&current>100);
      lastScroll=current;
    },50));

    // Mobile Nav
    const hamburger=document.getElementById('hamburger');
    const mobileNav=document.getElementById('mobileNav');
    hamburger.addEventListener('click',()=>mobileNav.classList.toggle('open'));
    document.querySelectorAll('[data-mobile-link]').forEach(l=>{
      l.addEventListener('click',()=>mobileNav.classList.remove('open'));
    });

    // Nav smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(a=>{
      a.addEventListener('click',e=>{
        e.preventDefault();
        const target=document.querySelector(a.getAttribute('href'));
        if(target) lenis.scrollTo(target,{offset:-80});
      });
    });

    // Design DNA Easter Egg
    let clickCount=0,clickTimer;
    document.getElementById('navLogo').addEventListener('click',e=>{
      e.preventDefault();
      clickCount++;
      clearTimeout(clickTimer);
      clickTimer=setTimeout(()=>{clickCount=0},400);
      if(clickCount===3){
        clickCount=0;
        document.querySelectorAll('*').forEach(el=>{el.style.outline='1px solid rgba(221,14,63,0.2)'});
        setTimeout(()=>{document.querySelectorAll('*').forEach(el=>{el.style.outline=''})},2000);
      }
    });
  }
})();
