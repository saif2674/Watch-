// WatchHub 3D tilt + hero parallax (lightweight, pointer-fine devices only)
(function () {
  if (!window.matchMedia) return;
  var fine = window.matchMedia('(pointer: fine)').matches;
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!fine || calm) return;

  var MAX = 7; // degrees
  var current = null;
  var raf = 0;

  function tilt(el, e) {
    var r = el.getBoundingClientRect();
    var px = (e.clientX - r.left) / r.width - 0.5;
    var py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform =
      'perspective(900px) rotateX(' + (-py * MAX).toFixed(2) + 'deg)' +
      ' rotateY(' + (px * MAX).toFixed(2) + 'deg) translateY(-6px) scale(1.015)';
  }

  document.addEventListener('pointermove', function (e) {
    var card = e.target && e.target.closest ? e.target.closest('.card, .showcase-card') : null;
    if (card !== current) {
      if (current) current.style.transform = '';
      current = card;
    }
    if (!current) return;
    if (raf) return;
    raf = requestAnimationFrame(function () {
      raf = 0;
      if (current) tilt(current, e);
    });
  }, { passive: true });

  document.addEventListener('pointerout', function (e) {
    if (current && !current.contains(e.relatedTarget)) {
      current.style.transform = '';
      current = null;
    }
  });

  // Hero parallax: content leans gently toward the pointer
  var hero = document.querySelector('.hero');
  var content = document.querySelector('.hero-content');
  if (hero && content) {
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      content.style.transform =
        'rotateX(' + (-py * 3).toFixed(2) + 'deg) rotateY(' + (px * 3).toFixed(2) + 'deg)';
    });
    hero.addEventListener('pointerleave', function () {
      content.style.transform = '';
    });
  }
})();
