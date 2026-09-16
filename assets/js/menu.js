// Mobile menu toggle. Squarespace's site-bundle.js is not shipped with this
// static copy; this reproduces the only interaction the site used from it.
(function () {
  var burger = document.querySelector('.header-burger-btn, .burger');
  var menu = document.querySelector('.header-menu');
  if (!burger || !menu) return;

  function setOpen(open) {
    document.body.classList.toggle('header--menu-open', open);
    burger.classList.toggle('burger--active', open);
    burger.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-hidden', String(!open));
  }

  burger.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-hidden', 'true');

  burger.addEventListener('click', function (e) {
    e.preventDefault();
    setOpen(!document.body.classList.contains('header--menu-open'));
  });

  // Leaving via a link, or Escape, closes the overlay.
  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setOpen(false);
  });
})();
