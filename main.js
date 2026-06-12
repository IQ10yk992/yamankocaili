(function () {
  'use strict';

  // ---- Shared reveal observer ----
  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  function observeReveal(el) {
    revealObserver.observe(el);
  }

  document.querySelectorAll('.reveal').forEach(observeReveal);

  // ---- Language toggle ----
  var translations = {
    tr: { lang_btn: 'EN' },
    en: { lang_btn: 'TR' },
  };

  var currentLang = 'tr';

  function applyLang(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-tr][data-en]').forEach(function (el) {
      el.textContent = el.dataset[lang];
    });
    document.getElementById('lang-toggle').textContent = translations[lang].lang_btn;
    try { localStorage.setItem('yk_lang', lang); } catch (_) {}
  }

  document.getElementById('lang-toggle').addEventListener('click', function () {
    applyLang(currentLang === 'tr' ? 'en' : 'tr');
  });

  (function () {
    var saved;
    try { saved = localStorage.getItem('yk_lang'); } catch (_) {}
    if (saved === 'en') applyLang('en');
  })();

  // ---- GitHub API: load projects ----
  var GITHUB_USER = 'iq10yk992';
  var EXCLUDED_REPOS = ['yamankocaili'];

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderProjects(repos) {
    var list = document.getElementById('project-list');
    list.innerHTML = '';

    if (repos.length === 0) {
      var empty = document.createElement('li');
      empty.className = 'project-skeleton';
      empty.textContent = '—';
      list.appendChild(empty);
      return;
    }

    repos.forEach(function (repo, i) {
      var li = document.createElement('li');
      var delayClass = i < 3 ? ' reveal-delay-' + (i + 1) : '';
      li.className = 'project-item reveal' + delayClass;

      var descHtml = repo.description
        ? '<p class="project-desc">' + escapeHtml(repo.description) + '</p>'
        : '';

      li.innerHTML =
        '<a href="' + escapeHtml(repo.html_url) + '" target="_blank" rel="noopener">' +
          '<span class="project-name">' + escapeHtml(repo.name) + '</span>' +
          '<span class="project-arrow">&rarr;</span>' +
        '</a>' +
        descHtml;

      list.appendChild(li);
      observeReveal(li);
    });
  }

  function loadProjects() {
    var url = 'https://api.github.com/users/' + GITHUB_USER +
              '/repos?sort=pushed&direction=desc&per_page=100';

    fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error('API ' + res.status);
        return res.json();
      })
      .then(function (data) {
        var filtered = data.filter(function (r) {
          return !r.fork && EXCLUDED_REPOS.indexOf(r.name.toLowerCase()) === -1;
        });
        renderProjects(filtered);
      })
      .catch(function () {
        var list = document.getElementById('project-list');
        list.innerHTML =
          '<li class="project-skeleton" style="border-top:1px solid var(--border);padding:1.75rem 0;">' +
          '<a href="https://github.com/' + GITHUB_USER + '" target="_blank" rel="noopener" ' +
          'style="color:var(--text-muted);font-family:var(--mono);font-size:0.85rem;text-decoration:none;">' +
          'github.com/' + GITHUB_USER + '</a></li>';
      });
  }

  loadProjects();

  // ---- Header scroll class ----
  var header = document.querySelector('header');
  window.addEventListener('scroll', function () {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
})();
