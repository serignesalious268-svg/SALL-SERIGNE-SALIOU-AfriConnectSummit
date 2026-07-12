/*
   AfriConnect Summit — main.js
   JavaScript vanilla pur — aucune librairie
   */

document.addEventListener('DOMContentLoaded', () => {

  /*
     1. DARK MODE / LIGHT MODE — persistant via localStorage
     */
  const themeToggleBtns = document.querySelectorAll('.theme-toggle');
  const root = document.documentElement;

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    themeToggleBtns.forEach(btn => {
      const icon = btn.querySelector('i');
      if (icon) {
        icon.className = theme === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-stars-fill';
      }
    });
  }

  const savedTheme = localStorage.getItem('acs-theme') || 'dark';
  applyTheme(savedTheme);

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(current);
      localStorage.setItem('acs-theme', current);
    });
  });

  /*
     2. NAVBAR DYNAMIQUE — fond après 80px + menu hamburger mobile
     */
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.navbar__links');

  function handleScrollNavbar() {
    if (window.scrollY > 80) {
      navbar.classList.add('is-scrolled');
    } else {
      navbar.classList.remove('is-scrolled');
    }
  }
  handleScrollNavbar();
  window.addEventListener('scroll', handleScrollNavbar);

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('is-active');
      navLinks.classList.toggle('is-open');
      const expanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', String(!expanded));
    });
    // Ferme le menu quand on clique un lien (mobile)
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('is-active');
        navLinks.classList.remove('is-open');
      });
    });
  }

  /*
     3. ANIMATIONS AU SCROLL — IntersectionObserver
     */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(el => observer.observe(el));
  }

  /*
     4. COMPTEURS ANIMÉS (chiffres clés) — se déclenchent au scroll
     */
  const counters = document.querySelectorAll('[data-counter]');
  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.counter, 10);
        const duration = 1600;
        const start = performance.now();

        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(eased * target).toLocaleString('fr-FR');
          if (progress < 1) {
            requestAnimationFrame(tick);
          } else {
            el.textContent = target.toLocaleString('fr-FR');
          }
        }
        requestAnimationFrame(tick);
        counterObserver.unobserve(el);
      });
    }, { threshold: 0.4 });

    counters.forEach(el => counterObserver.observe(el));
  }

  /*
     5. COMPTE À REBOURS — jusqu'à la date fictive de la conférence
     */
  const countdownEl = document.querySelector('.countdown');
  if (countdownEl) {
    const targetDate = new Date('2026-11-18T09:00:00');
    const daysEl = document.getElementById('cd-days');
    const hoursEl = document.getElementById('cd-hours');
    const minutesEl = document.getElementById('cd-minutes');
    const secondsEl = document.getElementById('cd-seconds');

    function updateCountdown() {
      const now = new Date();
      let diff = targetDate - now;
      if (diff < 0) diff = 0;

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
      if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
      if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
      if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  /*
     6. ONGLETS DU PROGRAMME (Jour 1 / Jour 2 / Jour 3)
     */
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.setAttribute('aria-selected', 'false'));
      tabPanels.forEach(p => p.classList.remove('is-active'));

      btn.setAttribute('aria-selected', 'true');
      const panel = document.getElementById(btn.getAttribute('aria-controls'));
      if (panel) panel.classList.add('is-active');
    });
  });

  /*
     7. FILTRAGE DYNAMIQUE DES INTERVENANTS
     */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const speakerCards = document.querySelectorAll('.speaker-card[data-category]');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.setAttribute('aria-pressed', 'false'));
      btn.setAttribute('aria-pressed', 'true');

      const category = btn.dataset.filter;
      speakerCards.forEach(card => {
        const matches = category === 'tous' || card.dataset.category === category;
        card.classList.toggle('is-hidden', !matches);
      });
    });
  });

  /*
     8. VALIDATION DU FORMULAIRE D'INSCRIPTION
     */
  const form = document.getElementById('registration-form');
  if (form) {
    const successMsg = document.getElementById('form-success');

    const validators = {
      fullname: (val) => val.trim().length >= 3,
      email: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()),
      phone: (val) => val.replace(/\D/g, '').length >= 8,
      participation: (val) => val !== '',
      country: (val) => val !== '',
      message: (val) => val.trim().length >= 20
    };

    function validateField(field) {
      const group = field.closest('.form-group');
      const isValid = validators[field.name] ? validators[field.name](field.value) : true;
      group.classList.toggle('is-valid', isValid);
      group.classList.toggle('is-invalid', !isValid);
      return isValid;
    }

    Object.keys(validators).forEach(name => {
      const field = form.elements[name];
      if (field) {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => {
          if (field.closest('.form-group').classList.contains('is-invalid')) {
            validateField(field);
          }
        });
      }
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let allValid = true;

      Object.keys(validators).forEach(name => {
        const field = form.elements[name];
        if (field && !validateField(field)) allValid = false;
      });

      if (allValid) {
        successMsg.classList.add('is-visible');
        form.reset();
        form.querySelectorAll('.form-group').forEach(g => g.classList.remove('is-valid', 'is-invalid'));
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => successMsg.classList.remove('is-visible'), 6000);
      } else {
        successMsg.classList.remove('is-visible');
      }
    });
  }

  /*
     9. BOUTON RETOUR EN HAUT
     */
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('is-visible', window.scrollY > 300);
    });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /*
     10. ANNÉE DYNAMIQUE DANS LE FOOTER
     */
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

});x