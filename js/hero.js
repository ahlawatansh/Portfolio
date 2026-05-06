// Hero Three.js Scene
import * as THREE from 'three';

(function(){
  const canvas=document.getElementById('hero-canvas');
  if(!canvas) return;
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(60,window.innerWidth/window.innerHeight,0.1,100);
  camera.position.z=5;
  let renderer;
  try{
    renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
  }catch(e){canvas.style.display='none';return;}
  renderer.setSize(window.innerWidth,window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));

  const geo=new THREE.IcosahedronGeometry(2.2,2);
  const mat=new THREE.MeshBasicMaterial({color:0xDD0E3F,wireframe:true,transparent:true,opacity:0.08});
  const sphere=new THREE.Mesh(geo,mat);
  scene.add(sphere);

  const pCount=300;
  const pGeo=new THREE.BufferGeometry();
  const positions=new Float32Array(pCount*3);
  for(let i=0;i<pCount*3;i++) positions[i]=(Math.random()-0.5)*12;
  pGeo.setAttribute('position',new THREE.BufferAttribute(positions,3));
  const pMat=new THREE.PointsMaterial({color:0xDD0E3F,size:0.02,transparent:true,opacity:0.5});
  const particles=new THREE.Points(pGeo,pMat);
  scene.add(particles);

  let mouseX=0,mouseY=0;
  document.addEventListener('mousemove',e=>{
    mouseX=(e.clientX/window.innerWidth-0.5)*2;
    mouseY=(e.clientY/window.innerHeight-0.5)*2;
  });

  window.addEventListener('resize',()=>{
    camera.aspect=window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
  });

  function animate(){
    requestAnimationFrame(animate);
    sphere.rotation.x+=0.002;
    sphere.rotation.y+=0.003;
    sphere.rotation.x+=mouseY*0.002;
    sphere.rotation.y+=mouseX*0.002;
    particles.rotation.y+=0.0005;
    renderer.render(scene,camera);
  }
  animate();
})();
