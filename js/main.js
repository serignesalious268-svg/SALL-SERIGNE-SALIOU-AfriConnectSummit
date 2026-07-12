/* AfriConnect Summit — main.js
   JavaScript vanilla pur — aucune librairie */

document.addEventListener('DOMContentLoaded', () => {

  /* 1. DARK MODE / LIGHT MODE — persistant via localStorage */
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

  /* 2. NAVBAR DYNAMIQUE — fond après 80px + menu hamburger mobile*/
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

});