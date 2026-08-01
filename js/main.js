(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {

    // ── Mobile nav toggle ──
    var toggle = document.querySelector('.nav__toggle');
    var links = document.querySelector('.nav__links');
    if (toggle && links) {
      toggle.addEventListener('click', function () {
        var isOpen = links.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(isOpen));
      });
      links.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          links.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });
    }

    // ── Active nav link ──
    var path = window.location.pathname;
    var currentPage = path.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav__links a[data-route]').forEach(function (link) {
      if (link.getAttribute('data-route') === currentPage) {
        link.classList.add('is-active');
      }
    });

    // ── Footer year ──
    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // ── Scroll reveal ──
    var revealEls = document.querySelectorAll('[data-reveal]');
    if ('IntersectionObserver' in window && revealEls.length > 0) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -60px 0px', threshold: 0.1 });
      revealEls.forEach(function (el) { observer.observe(el); });
    }

    // ── Contact form ──
    // Browsers no longer reliably submit a form to a mailto: action, so build
    // the message and hand it to the user's mail client ourselves.
    var contactForm = document.querySelector('.contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', function (e) {
        var action = contactForm.getAttribute('action') || '';
        var to = action.replace(/^mailto:/i, '').trim();
        if (!to) return;
        e.preventDefault();

        var field = function (id) {
          var el = contactForm.querySelector('#' + id);
          return el ? el.value.trim() : '';
        };
        var name = field('name');
        var email = field('email');
        var message = field('message');

        var subject = name ? 'Website enquiry from ' + name : 'Website enquiry';
        var body = 'Name: ' + name + '\nEmail: ' + email + '\n\n' + message;

        window.location.href = 'mailto:' + to +
          '?subject=' + encodeURIComponent(subject) +
          '&body=' + encodeURIComponent(body);
      });
    }

    // ── Typing animation (home page only) ──
    var typedEl = document.getElementById('typed-text');
    if (!typedEl) return;

    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var phrases = [
      'echo "Custom software, built to fit"',
      'ls ./services',
      'whoami  # gunner castle entertainment'
    ];

    if (prefersReducedMotion) {
      typedEl.textContent = phrases[0];
      return;
    }

    var phraseIndex = 0;
    var charIndex = 0;
    var isDeleting = false;

    function type() {
      var current = phrases[phraseIndex];

      if (!isDeleting) {
        typedEl.textContent = current.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex === current.length) {
          setTimeout(function () { isDeleting = true; type(); }, 2000);
          return;
        }
        setTimeout(type, 80 + Math.random() * 40);
      } else {
        typedEl.textContent = current.substring(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(type, 500);
          return;
        }
        setTimeout(type, 40);
      }
    }

    setTimeout(type, 1000);
  });
})();
