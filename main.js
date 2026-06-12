(function () {
  'use strict';

  var GITHUB_USER = 'IQ10yk992';
  var SKIP        = ['yamankocaili'];

  /* ---- Reveal ---- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.08 });

  function watch(el) { io.observe(el); }
  document.querySelectorAll('.reveal').forEach(watch);

  /* ---- Header border on scroll ---- */
  var header = document.getElementById('header');
  window.addEventListener('scroll', function () {
    header.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });

  /* ---- Language toggle ---- */
  var lang = 'tr';

  function setLang(l) {
    lang = l;
    document.documentElement.lang = l;
    document.querySelectorAll('[data-tr]').forEach(function (el) {
      el.textContent = el.dataset[l] || el.dataset.tr;
    });
    document.getElementById('lang-toggle').textContent = l === 'tr' ? 'EN' : 'TR';
    try { localStorage.setItem('yk_lang', l); } catch (_) {}
  }

  document.getElementById('lang-toggle').addEventListener('click', function () {
    setLang(lang === 'tr' ? 'en' : 'tr');
  });

  try { if (localStorage.getItem('yk_lang') === 'en') setLang('en'); } catch (_) {}

  /* ---- Escape helper ---- */
  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ---- Render repos ---- */
  function render(repos) {
    var list = document.getElementById('project-list');
    list.innerHTML = '';

    repos.forEach(function (repo, i) {
      var li = document.createElement('li');
      li.className = 'project-item reveal' + (i < 3 ? ' reveal-d' + (i + 1) : '');

      li.innerHTML =
        '<a href="' + esc(repo.html_url) + '" target="_blank" rel="noopener">' +
          '<span class="proj-name">' + esc(repo.name) + '</span>' +
          '<span class="proj-arr">&#8599;</span>' +
        '</a>' +
        (repo.description ? '<p class="proj-desc">' + esc(repo.description) + '</p>' : '');

      list.appendChild(li);
      watch(li);
    });
  }

  /* ---- Fetch repos ---- */
  fetch('https://api.github.com/users/' + GITHUB_USER + '/repos?sort=pushed&direction=desc&per_page=100')
    .then(function (r) { if (!r.ok) throw r.status; return r.json(); })
    .then(function (data) {
      var filtered = data.filter(function (r) {
        return !r.fork && SKIP.indexOf(r.name.toLowerCase()) === -1;
      });
      render(filtered.length ? filtered : []);
    })
    .catch(function () {
      document.getElementById('project-list').innerHTML =
        '<li style="padding:1.5rem 0;border-top:1px solid var(--border);">' +
        '<a href="https://github.com/' + GITHUB_USER + '" target="_blank" rel="noopener"' +
        ' style="font-size:.85rem;color:var(--muted);text-decoration:none;">' +
        'github.com/' + GITHUB_USER + '</a></li>';
    });

})();
