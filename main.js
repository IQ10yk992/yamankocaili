(function () {
  'use strict';

  // ---- Language toggle ----
  const translations = {
    tr: {
      lang_btn: 'EN',
    },
    en: {
      lang_btn: 'TR',
    },
  };

  let currentLang = 'tr';

  function applyLang(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;

    // Update all data-tr / data-en elements
    document.querySelectorAll('[data-tr][data-en]').forEach(function (el) {
      el.textContent = el.dataset[lang];
    });

    // Update toggle button label
    document.getElementById('lang-toggle').textContent = translations[lang].lang_btn;

    // Persist preference
    try { localStorage.setItem('yk_lang', lang); } catch (_) {}
  }

  document.getElementById('lang-toggle').addEventListener('click', function () {
    applyLang(currentLang === 'tr' ? 'en' : 'tr');
  });

  // Restore persisted preference
  (function () {
    let saved;
    try { saved = localStorage.getItem('yk_lang'); } catch (_) {}
    if (saved === 'en') applyLang('en');
  })();

  // ---- Scroll-reveal ----
  const revealEls = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealEls.forEach(function (el) { observer.observe(el); });

  // ---- Header scroll class ----
  var header = document.querySelector('header');
  window.addEventListener('scroll', function () {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
})();
