/* ================================================
   ZEN Mimarlık — JavaScript
   ================================================ */

(function () {
  'use strict';

  /* ---- Navbar scroll state ---- */
  const navbar = document.getElementById('navbar');
  function updateNavbar() {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }
  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  /* ---- Mobile menu toggle ---- */
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  toggle.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  /* Close menu on link click */
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---- Smooth scroll offset for fixed nav ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = navbar.getBoundingClientRect().height;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ---- Scroll-reveal animation ---- */
  const revealTargets = document.querySelectorAll(
    '#projects .project-card, #about .about-text, #about .about-image, .stat, #contact .contact-text, #contact .contact-form'
  );

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealTargets.forEach(function (el) {
      el.classList.add('will-reveal');
      observer.observe(el);
    });
  } else {
    /* Fallback: show everything immediately */
    revealTargets.forEach(function (el) {
      el.classList.add('revealed');
    });
  }

  /* ---- Contact form handling ---- */
  const form = document.querySelector('.contact-form');
  const feedback = form.querySelector('.form-feedback');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();
    const message = form.querySelector('#message').value.trim();

    if (!name || !email || !message) {
      feedback.textContent = 'Lütfen gerekli alanları doldurun.';
      feedback.style.color = '#f87171';
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      feedback.textContent = 'Geçerli bir e-posta adresi girin.';
      feedback.style.color = '#f87171';
      return;
    }

    /* Simulate successful submission */
    var SUBMIT_DELAY_MS = 1200;
    const submitBtn = form.querySelector('.btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Gönderiliyor…';

    setTimeout(function () {
      feedback.textContent = 'Mesajınız alındı. En kısa sürede size dönüş yapacağız.';
      feedback.style.color = '#86efac';
      form.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = 'Gönder';
    }, SUBMIT_DELAY_MS);
  });

  /* ---- Footer year ---- */
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

})();
