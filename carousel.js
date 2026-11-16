/* the POSITIVE project — mockup v4. The photo carousel of the current cocoon4us.com page:
   one photo at a time, arrows, dots, a new photo every 4 seconds, paused on hover or focus.
   Without this file the photos stay readable: they scroll sideways. */
(function () {
  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setup(root) {
    var track = root.querySelector('.carousel__track');
    var slides = track ? track.children : [];
    if (slides.length < 2) return;
    var current = 0;
    var timer = null;

    function button(cls, label, text) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = cls;
      b.setAttribute('aria-label', label);
      b.textContent = text;
      return b;
    }
    var prev = button('carousel__ctl carousel__ctl--prev', 'Previous photo', '‹');
    var next = button('carousel__ctl carousel__ctl--next', 'Next photo', '›');
    var dots = document.createElement('div');
    dots.className = 'carousel__dots';
    for (var i = 0; i < slides.length; i++) {
      var d = button('', 'Photo ' + (i + 1) + ' of ' + slides.length, '');
      d.dataset.i = i;
      dots.appendChild(d);
    }

    function go(i) {
      current = (i + slides.length) % slides.length;
      track.style.transform = 'translateX(' + (-100 * current) + '%)';
      for (var j = 0; j < slides.length; j++) {
        slides[j].setAttribute('aria-hidden', j === current ? 'false' : 'true');
        dots.children[j].setAttribute('aria-current', j === current ? 'true' : 'false');
      }
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function play() { stop(); if (!still) timer = setInterval(function () { go(current + 1); }, 4000); }

    prev.addEventListener('click', function () { go(current - 1); });
    next.addEventListener('click', function () { go(current + 1); });
    dots.addEventListener('click', function (e) { if (e.target.dataset.i) go(Number(e.target.dataset.i)); });
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', play);
    root.addEventListener('focusin', stop);
    root.addEventListener('focusout', play);

    root.classList.add('is-ready');
    root.appendChild(prev);
    root.appendChild(next);
    root.appendChild(dots);
    go(0);
    play();
  }

  var all = document.querySelectorAll('[data-carousel]');
  for (var k = 0; k < all.length; k++) setup(all[k]);
})();
