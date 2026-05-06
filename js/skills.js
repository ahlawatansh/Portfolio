// Skill Radar Chart — Custom SVG + Vanilla JS
(function(){
  const container = document.getElementById('radar-chart-container');
  if(!container) return;

  const skills = [
    { name: 'UI/UX\nDesign', score: 92 },
    { name: 'Figma', score: 95 },
    { name: 'Adobe XD', score: 80 },
    { name: 'Visual\nDesign', score: 88 },
    { name: 'Brand\nDesign', score: 82 },
    { name: 'Web\nDevelopment', score: 75 },
    { name: 'Problem\nSolving', score: 90 },
    { name: 'Creative\nThinking', score: 93 },
    { name: 'Content\nDesign', score: 85 },
    { name: 'Collaboration', score: 87 },
    { name: 'Adaptability', score: 89 },
    { name: 'Communication', score: 86 }
  ];

  const n = skills.length;
  const cx = 260, cy = 260, maxR = 190;
  const svgNS = 'http://www.w3.org/2000/svg';

  // Create SVG
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', '0 0 520 520');
  svg.setAttribute('width', '520');
  svg.setAttribute('height', '520');
  svg.style.overflow = 'visible';
  svg.id = 'radarSvg';

  // Defs for gradients and filters
  const defs = document.createElementNS(svgNS, 'defs');

  // Radial gradient for fill
  const radGrad = document.createElementNS(svgNS, 'radialGradient');
  radGrad.id = 'radarFill';
  radGrad.setAttribute('cx', '50%'); radGrad.setAttribute('cy', '50%'); radGrad.setAttribute('r', '50%');
  const stop1 = document.createElementNS(svgNS, 'stop');
  stop1.setAttribute('offset', '0%'); stop1.setAttribute('stop-color', 'rgba(221,14,63,0.5)');
  const stop2 = document.createElementNS(svgNS, 'stop');
  stop2.setAttribute('offset', '100%'); stop2.setAttribute('stop-color', 'rgba(221,14,63,0.12)');
  radGrad.appendChild(stop1); radGrad.appendChild(stop2);
  defs.appendChild(radGrad);

  // Glow filter
  const filter = document.createElementNS(svgNS, 'filter');
  filter.id = 'glow'; filter.setAttribute('x', '-50%'); filter.setAttribute('y', '-50%');
  filter.setAttribute('width', '200%'); filter.setAttribute('height', '200%');
  const blur = document.createElementNS(svgNS, 'feGaussianBlur');
  blur.setAttribute('stdDeviation', '4'); blur.setAttribute('result', 'blur');
  const merge = document.createElementNS(svgNS, 'feMerge');
  const mn1 = document.createElementNS(svgNS, 'feMergeNode'); mn1.setAttribute('in', 'blur');
  const mn2 = document.createElementNS(svgNS, 'feMergeNode'); mn2.setAttribute('in', 'SourceGraphic');
  merge.appendChild(mn1); merge.appendChild(mn2);
  filter.appendChild(blur); filter.appendChild(merge);
  defs.appendChild(filter);
  svg.appendChild(defs);

  function polarToXY(angle, radius) {
    return {
      x: cx + radius * Math.cos(angle - Math.PI / 2),
      y: cy + radius * Math.sin(angle - Math.PI / 2)
    };
  }

  // Draw concentric rings (5 levels)
  for (let i = 1; i <= 5; i++) {
    const r = (maxR / 5) * i;
    const circle = document.createElementNS(svgNS, 'circle');
    circle.setAttribute('cx', cx); circle.setAttribute('cy', cy); circle.setAttribute('r', r);
    circle.setAttribute('fill', 'none'); circle.setAttribute('stroke', 'rgba(220,200,230,0.08)');
    circle.setAttribute('stroke-width', '1'); circle.setAttribute('stroke-dasharray', '4 4');
    svg.appendChild(circle);
  }

  // Draw radial guide lines + labels
  skills.forEach((s, i) => {
    const angle = (Math.PI * 2 / n) * i;
    const p = polarToXY(angle, maxR);

    // Guide line
    const line = document.createElementNS(svgNS, 'line');
    line.setAttribute('x1', cx); line.setAttribute('y1', cy);
    line.setAttribute('x2', p.x); line.setAttribute('y2', p.y);
    line.setAttribute('stroke', 'rgba(220,200,230,0.06)'); line.setAttribute('stroke-width', '1');
    svg.appendChild(line);

    // Label
    const labelPos = polarToXY(angle, maxR + 35);
    const text = document.createElementNS(svgNS, 'text');
    text.setAttribute('x', labelPos.x); text.setAttribute('y', labelPos.y);
    text.setAttribute('text-anchor', 'middle'); text.setAttribute('dominant-baseline', 'central');
    text.setAttribute('fill', 'rgba(220,200,230,0.85)');
    text.setAttribute('font-family', "'DM Sans', sans-serif"); text.setAttribute('font-size', '13');
    text.setAttribute('font-weight', '400');
    text.setAttribute('data-skill-index', i);
    text.classList.add('radar-label');

    const lines = s.name.split('\n');
    if (lines.length > 1) {
      lines.forEach((l, li) => {
        const tspan = document.createElementNS(svgNS, 'tspan');
        tspan.setAttribute('x', labelPos.x);
        tspan.setAttribute('dy', li === 0 ? '-0.5em' : '1.2em');
        tspan.textContent = l;
        text.appendChild(tspan);
      });
    } else {
      text.textContent = s.name;
    }
    svg.appendChild(text);

    // Vertex dot
    const dot = document.createElementNS(svgNS, 'circle');
    dot.setAttribute('r', '4');
    dot.setAttribute('fill', '#DD0E3F');
    dot.setAttribute('filter', 'url(#glow)');
    dot.classList.add('radar-dot');
    dot.setAttribute('data-index', i);
    const scorePos = polarToXY(angle, 0);
    dot.setAttribute('cx', scorePos.x); dot.setAttribute('cy', scorePos.y);
    svg.appendChild(dot);
  });

  // Radar polygon (fill)
  const fillPoly = document.createElementNS(svgNS, 'polygon');
  fillPoly.setAttribute('fill', 'url(#radarFill)');
  fillPoly.setAttribute('stroke', 'none');
  fillPoly.classList.add('radar-fill');
  const initPoints = skills.map(() => `${cx},${cy}`).join(' ');
  fillPoly.setAttribute('points', initPoints);
  svg.appendChild(fillPoly);

  // Radar polygon (stroke)
  const strokePoly = document.createElementNS(svgNS, 'polygon');
  strokePoly.setAttribute('fill', 'none');
  strokePoly.setAttribute('stroke', '#DD0E3F');
  strokePoly.setAttribute('stroke-width', '2');
  strokePoly.setAttribute('filter', 'url(#glow)');
  strokePoly.classList.add('radar-stroke');
  strokePoly.setAttribute('points', initPoints);
  svg.appendChild(strokePoly);

  container.appendChild(svg);

  // Tooltip
  const tooltip = document.createElement('div');
  tooltip.className = 'radar-tooltip';
  tooltip.style.cssText = 'position:absolute;pointer-events:none;opacity:0;transition:opacity 0.2s;background:rgba(221,14,63,0.12);border:1px solid rgba(221,14,63,0.3);border-radius:8px;padding:6px 12px;font-family:var(--font-mono);font-size:0.7rem;color:#F0EEE8;backdrop-filter:blur(8px);z-index:10;white-space:nowrap';
  container.appendChild(tooltip);

  // Animation state
  let currentScores = skills.map(() => 0);
  let targetScores = skills.map(s => s.score);
  let animated = false;

  function updatePolygon(scores) {
    const points = scores.map((s, i) => {
      const angle = (Math.PI * 2 / n) * i;
      const r = (s / 100) * maxR;
      const p = polarToXY(angle, r);
      return `${p.x},${p.y}`;
    }).join(' ');
    fillPoly.setAttribute('points', points);
    strokePoly.setAttribute('points', points);

    // Update dots
    const dots = svg.querySelectorAll('.radar-dot');
    dots.forEach((dot, i) => {
      const angle = (Math.PI * 2 / n) * i;
      const r = (scores[i] / 100) * maxR;
      const p = polarToXY(angle, r);
      dot.setAttribute('cx', p.x);
      dot.setAttribute('cy', p.y);
    });
  }

  // Continuous live animation state
  let liveTargets = skills.map(s => s.score);
  let liveRunning = false;
  let hoveredIndex = -1;

  function startLiveAnimation() {
    if (liveRunning) return;
    liveRunning = true;

    // Periodically pick new random targets within ±5 of base score
    function pickNewTargets() {
      liveTargets = skills.map(s => {
        const offset = (Math.random() - 0.5) * 10; // ±5
        return Math.max(10, Math.min(100, s.score + offset));
      });
    }

    pickNewTargets();
    setInterval(pickNewTargets, 1800); // new targets every 1.8s

    function liveTick() {
      // Smoothly interpolate current scores toward live targets
      for (let i = 0; i < n; i++) {
        currentScores[i] += (liveTargets[i] - currentScores[i]) * 0.04;
      }
      updatePolygon(currentScores);
      // Update tooltip value in real time if hovering
      if (hoveredIndex >= 0) {
        tooltip.textContent = `${skills[hoveredIndex].name.replace('\\n', ' ')} — ${Math.round(currentScores[hoveredIndex])}%`;
      }
      requestAnimationFrame(liveTick);
    }
    requestAnimationFrame(liveTick);
  }

  function animateIn() {
    if (animated) return;
    animated = true;
    const start = performance.now();
    const duration = 1200;
    const ease = (t) => {
      // Spring overshoot: cubic-bezier(0.34, 1.56, 0.64, 1) approximation
      const c4 = (2 * Math.PI) / 4.5;
      return t < 0.5
        ? 8 * t * t * t * t
        : 1 - Math.pow(-2 * t + 2, 4) / 2 + Math.sin(t * Math.PI) * 0.08;
    };

    function tick(now) {
      const elapsed = now - start;
      skills.forEach((s, i) => {
        const staggerDelay = i * 50;
        const localT = Math.max(0, Math.min(1, (elapsed - staggerDelay) / duration));
        const eased = ease(localT);
        currentScores[i] = eased * s.score;
      });
      updatePolygon(currentScores);
      if (elapsed < duration + n * 50 + 100) {
        requestAnimationFrame(tick);
      } else {
        currentScores = skills.map(s => s.score);
        updatePolygon(currentScores);
        // Start continuous live animation after intro finishes
        startLiveAnimation();
      }
    }
    requestAnimationFrame(tick);
  }

  // IntersectionObserver trigger
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { animateIn(); obs.unobserve(e.target); } });
  }, { threshold: 0.3 });
  obs.observe(container);

  // Hover tooltip
  container.addEventListener('mousemove', e => {
    const rect = svg.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my_val = e.clientY - rect.top;
    const scaleX = 520 / rect.width;
    const scaleY = 520 / rect.height;
    const svgX = mx * scaleX;
    const svgY = my_val * scaleY;

    let closest = -1, closestDist = Infinity;
    skills.forEach((s, i) => {
      const angle = (Math.PI * 2 / n) * i;
      const r = (currentScores[i] / 100) * maxR;
      const p = polarToXY(angle, r);
      const d = Math.hypot(p.x - svgX, p.y - svgY);
      if (d < closestDist) { closestDist = d; closest = i; }
    });

    // Highlight nearest label
    svg.querySelectorAll('.radar-label').forEach((l, i) => {
      l.setAttribute('fill', i === closest && closestDist < 80 ? '#DD0E3F' : 'rgba(220,200,230,0.85)');
    });

    if (closestDist < 80 && closest >= 0) {
      hoveredIndex = closest;
      tooltip.textContent = `${skills[closest].name.replace('\n', ' ')} — ${Math.round(currentScores[closest])}%`;
      tooltip.style.opacity = '1';
      tooltip.style.left = (e.clientX - container.getBoundingClientRect().left + 15) + 'px';
      tooltip.style.top = (e.clientY - container.getBoundingClientRect().top - 10) + 'px';
    } else {
      tooltip.style.opacity = '0';
      hoveredIndex = -1;
    }
  });

  container.addEventListener('mouseleave', () => {
    tooltip.style.opacity = '0';
    hoveredIndex = -1;
    svg.querySelectorAll('.radar-label').forEach(l => {
      l.setAttribute('fill', 'rgba(220,200,230,0.85)');
    });
  });
})();
