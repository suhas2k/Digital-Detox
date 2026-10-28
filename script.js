
(function () {
  'use strict';

  // --- 1. Theme Management ---
  function getPreferredTheme() {
    const saved = localStorage.getItem('detox-theme');
    if (saved === 'dark' || saved === 'light') {
      return saved;
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('detox-theme', theme);

    // Update theme toggle button titles & labels if available
    const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
    toggleBtns.forEach(btn => {
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme');
      btn.setAttribute('title', theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme');
    });
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  }

  // --- 2. Initialize Navigation & Interactivity ---
  document.addEventListener('DOMContentLoaded', function () {
    // Sync current theme state on all toggle buttons
    const currentTheme = document.documentElement.getAttribute('data-theme') || getPreferredTheme();
    applyTheme(currentTheme);

    // Bind Theme Toggle Buttons (Desktop & Mobile)
    const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', toggleTheme);
    });

    // Mobile Navigation Drawer Toggle
    const navBtn = document.getElementById('nav-toggle-btn');
    const mobileDrawer = document.getElementById('mobile-drawer');

    if (navBtn && mobileDrawer) {
      navBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        mobileDrawer.classList.toggle('open');
      });

      // Close mobile drawer on outside click
      document.addEventListener('click', function (e) {
        if (!mobileDrawer.contains(e.target) && !navBtn.contains(e.target)) {
          mobileDrawer.classList.remove('open');
        }
      });
    }

    // --- 3. Staggered Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if ('IntersectionObserver' in window && revealElements.length > 0) {
      const observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-revealed');
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.12,
          rootMargin: '0px 0px -40px 0px'
        }
      );

      revealElements.forEach(el => observer.observe(el));
    } else {
      // Fallback if IntersectionObserver is unsupported
      revealElements.forEach(el => el.classList.add('is-revealed'));
    }
  });

  // Listen to OS theme changes if user has no explicit preference set
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
      if (!localStorage.getItem('detox-theme')) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
})();
