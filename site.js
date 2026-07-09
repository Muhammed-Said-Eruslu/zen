(function () {
  'use strict';

  /* ── SAYFA GEÇİŞİ ────────────────────────────────────── */
  document.querySelectorAll('a[href]').forEach(function (link) {
    var href = link.getAttribute('href');
    if (!href || href.charAt(0) === '#' ||
        href.indexOf('mailto:') === 0 || href.indexOf('tel:') === 0 ||
        href.indexOf('http') === 0) return;
    /* Aynı sayfa içi çapa (ör. hizmetler.html#ic-mekan) — geçiş yok */
    if (link.pathname === window.location.pathname && link.hash) return;
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var dest = link.href;
      document.body.classList.add('page-out');
      setTimeout(function () { window.location.href = dest; }, 260);
    });
  });

  /* ── HAMBURGER MENÜ ──────────────────────────────────── */
  var headerInner = document.querySelector('.header-inner');
  var nav = document.querySelector('.site-nav');

  if (headerInner && nav) {
    var btn = document.createElement('button');
    btn.className = 'nav-toggle';
    btn.setAttribute('aria-label', 'Menüyü aç/kapat');
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = '<span></span><span></span><span></span>';
    headerInner.appendChild(btn);

    function openMenu() {
      nav.classList.add('open');
      btn.classList.add('active');
      btn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
    function closeMenu() {
      nav.classList.remove('open');
      btn.classList.remove('active');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    btn.addEventListener('click', function () {
      nav.classList.contains('open') ? closeMenu() : openMenu();
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ── SCROLL ANİMASYONLARI ────────────────────────────── */
  if (!window.IntersectionObserver) return;

  function getStaggerDelay(el) {
    var parent = el.parentElement;
    if (!parent) return 0;
    if (parent.classList.contains('project-grid') ||
        parent.classList.contains('gallery-grid') ||
        parent.classList.contains('service-grid') ||
        parent.classList.contains('contact-aside')) {
      return Array.from(parent.children).indexOf(el) * 90;
    }
    return 0;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -28px 0px' });

  document.querySelectorAll(
    '.section-head, .content-block, .project-card, .gallery-item, .panel, .cover-content, .single-image, .note, .service-card'
  ).forEach(function (el) {
    if (el.getBoundingClientRect().top >= window.innerHeight) {
      var delay = getStaggerDelay(el);
      if (delay) el.style.transitionDelay = delay + 'ms';
      el.classList.add('animate-in');
      observer.observe(el);
    }
  });

  /* ── İLETİŞİM FORMU ──────────────────────────────────── */
  var form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var submitBtn = form.querySelector('button[type="submit"]');
    var formspreeId = form.dataset.formspreeId;

    if (!formspreeId) {
      form.submit();
      return;
    }

    var original = submitBtn.textContent;
    submitBtn.textContent = 'Gönderiliyor…';
    submitBtn.disabled = true;

    fetch('https://formspree.io/f/' + formspreeId, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    })
      .then(function (res) {
        if (res.ok) {
          Array.from(form.children).forEach(function (el) {
            if (el.id !== 'form-success') el.style.display = 'none';
          });
          var msg = document.getElementById('form-success');
          if (msg) msg.style.display = 'block';
        } else {
          submitBtn.textContent = original;
          submitBtn.disabled = false;
        }
      })
      .catch(function () {
        submitBtn.textContent = original;
        submitBtn.disabled = false;
      });
  });

})();
