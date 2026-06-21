/* WickedBall — loads the live Trustindex Google-reviews widget INTO the homepage
   reviews section (.ti-reviews). Hosted externally so the script never has to pass
   the Cloudflare WAF. Renders the widget in place, not at the bottom of the page. */
(function () {
  var WIDGET = 'https://cdn.trustindex.io/loader.js?3254c2d748ff761bc1667011e5a';

  function mount() {
    var box = document.querySelector('.ti-reviews');
    if (!box) { return; }                  // only on the homepage, where this container exists
    if (box.getAttribute('data-ti-done')) { return; } // avoid double-mounting
    box.setAttribute('data-ti-done', '1');
    box.innerHTML = '';                    // clear the "4.9 average…" text placeholder
    var s = document.createElement('script');
    s.defer = true;
    s.async = true;
    s.src = WIDGET;                         // Trustindex renders adjacent to this script → inside .ti-reviews
    box.appendChild(s);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
