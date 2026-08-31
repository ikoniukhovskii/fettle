/* ============================================================
   Fettle — shared page chrome (header + three-column footer).
   Injected into #site-header and #site-footer so every content
   page stays consistent. Pure content lives in the page itself.
   ============================================================ */
(function () {
  var HOME = '../Fettle Home.html';

  var header =
    '<div class="wrap">' +
      '<div class="bar">' +
        '<a class="brand" href="' + HOME + '">Fettle</a>' +
        '<nav aria-label="Primary">' +
          '<a class="hide-sm" href="services.html">What we fix</a>' +
          '<a class="hide-sm" href="how-it-works.html">How it works</a>' +
          '<a class="hide-sm" href="about.html">About</a>' +
          '<a class="cta" href="' + HOME + '#availability">Check availability</a>' +
        '</nav>' +
      '</div>' +
    '</div>';

  var footer =
    '<div class="foot-inner">' +
      '<div class="foot-top">' +
        '<div class="foot-brand">' +
          '<a class="foot-logo" href="' + HOME + '">Fettle</a>' +
          '<p class="foot-tag">London home care with efficiency, transparency and a tidy finish.</p>' +
        '</div>' +
        '<div class="foot-col">' +
          '<h4>Company</h4>' +
          '<a href="about.html">About Fettle</a>' +
          '<a href="testimonials.html">Testimonials</a>' +
          '<a href="contact.html">Contact</a>' +
        '</div>' +
        '<div class="foot-col">' +
          '<h4>Services</h4>' +
          '<a href="services.html">What we fix</a>' +
          '<a href="how-it-works.html">How it works</a>' +
        '</div>' +
        '<div class="foot-col">' +
          '<h4>Legal</h4>' +
          '<a href="privacy.html">Privacy</a>' +
          '<a href="terms.html">Terms of use</a>' +
          '<a href="cookies.html">Cookies</a>' +
        '</div>' +
      '</div>' +
      '<div class="foot-bottom">' +
        '<span class="copy">&copy; 2026 Fettle. All rights reserved.</span>' +
        '<div class="foot-social">' +
          '<a href="' + HOME + '" aria-label="Fettle on LinkedIn">In</a>' +
          '<a href="' + HOME + '" aria-label="Fettle on Instagram">Ig</a>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<button class="foot-totop" type="button" aria-label="Back to top">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M12 19V5"/><path d="M5 12l7-7 7 7"/>' +
      '</svg>' +
    '</button>';

  function mount() {
    var h = document.getElementById('site-header');
    var f = document.getElementById('site-footer');
    if (h) { h.className = 'site-header'; h.innerHTML = header; }
    if (f) {
      f.className = 'site-footer';
      f.innerHTML = footer;
      var top = f.querySelector('.foot-totop');
      if (top) top.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
