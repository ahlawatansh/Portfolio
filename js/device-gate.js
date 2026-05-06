/* =========================================
   DEVICE GATE — Show overlay on screens < 1026px
   ========================================= */

(function () {
  'use strict';

  var BREAKPOINT = 1026;
  var gate = document.getElementById('deviceGate');
  var proceedBtn = document.getElementById('dgProceedBtn');
  if (!gate) return;

  var bypassed = false;

  function checkWidth() {
    if (bypassed) return;
    if (window.innerWidth < BREAKPOINT) {
      gate.classList.add('active');
      document.body.classList.add('device-gate-active');
    } else {
      gate.classList.remove('active');
      document.body.classList.remove('device-gate-active');
    }
  }

  // "Proceed in Mobile" — dismiss the gate permanently for this session
  if (proceedBtn) {
    proceedBtn.addEventListener('click', function () {
      bypassed = true;
      gate.classList.remove('active');
      document.body.classList.remove('device-gate-active');
    });
  }

  // Debounced resize handler
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(checkWidth, 100);
  });

  // Initial check
  checkWidth();
})();
