(function () {
  'use strict';

  var GITHUB_USER = 'IQ10yk992';
  var SKIP = ['yamankocaili'];

  /* ---- Reveal ---- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  function watch(el) { io.observe(el); }
  document.querySelectorAll('.reveal').forEach(watch);

  /* ---- Header ---- */
  var header = document.getElementById('header');
  window.addEventListener('scroll', function () {
    header.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });

  /* ---- Language ---- */
  var lang = 'tr';

  function setLang(l) {
    lang = l;
    document.documentElement.lang = l;
    document.querySelectorAll('[data-tr]').forEach(function (el) {
      el.textContent = el.dataset[l];
    });
    document.getElementById('lang-toggle').textContent = l === 'tr' ? 'EN' : 'TR';
    try { localStorage.setItem('yk_lang', l); } catch (_) {}
  }

  document.getElementById('lang-toggle').addEventListener('click', function () {
    setLang(lang === 'tr' ? 'en' : 'tr');
  });

  try {
    var saved = localStorage.getItem('yk_lang');
    if (saved === 'en') setLang('en');
  } catch (_) {}

  /* ---- GitHub repos ---- */
  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function render(repos) {
    var list = document.getElementById('project-list');
    list.innerHTML = '';

    repos.forEach(function (repo, i) {
      var li = document.createElement('li');
      li.className = 'project-item reveal reveal-d' + Math.min(i + 1, 3);

      li.innerHTML =
        '<a href="' + esc(repo.html_url) + '" target="_blank" rel="noopener">' +
          '<span class="proj-name">' + esc(repo.name) + '</span>' +
          '<span class="proj-arrow">&#8599;</span>' +
        '</a>' +
        (repo.description
          ? '<p class="proj-desc">' + esc(repo.description) + '</p>'
          : '');

      list.appendChild(li);
      watch(li);
    });
  }

  function loadRepos() {
    fetch(
      'https://api.github.com/users/' + GITHUB_USER +
      '/repos?sort=pushed&direction=desc&per_page=100'
    )
      .then(function (r) {
        if (!r.ok) throw r.status;
        return r.json();
      })
      .then(function (data) {
        var filtered = data.filter(function (r) {
          return !r.fork && SKIP.indexOf(r.name.toLowerCase()) === -1;
        });

        if (filtered.length === 0) {
          document.getElementById('project-list').innerHTML =
            '<li class="skel" style="border-top:1px solid var(--border);padding:1.6rem 0;">' +
            '<span style="width:20%"></span></li>';
          return;
        }

        render(filtered);
      })
      .catch(function () {
        document.getElementById('project-list').innerHTML =
          '<li style="border-top:1px solid var(--border);padding:1.6rem 0;">' +
          '<a href="https://github.com/' + GITHUB_USER +
          '" target="_blank" rel="noopener" ' +
          'style="font-size:0.9rem;color:var(--muted);text-decoration:none;">' +
          'github.com/' + GITHUB_USER + '</a></li>';
      });
  }

  loadRepos();
})();
