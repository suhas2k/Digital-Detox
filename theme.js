/**
 * DIGITAL DETOX — Universal Theme Persistence (Vanilla JS)
 * Single Source of Truth: 'digital-detox-theme' in localStorage
 * Zero Flash of Unstyled Theme (FOUC) • Instant Cross-Page Synchronization
 */

(function () {
  'use strict';

  var STORAGE_KEY = 'digital-detox-theme';

  function getSystemPreference() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  function getActiveTheme() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'dark' || saved === 'light') {
        return saved;
      }
    } catch (e) {}
    return getSystemPreference();
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {}

    // Update aria-label and title for accessibility & tooltips
    var toggleBtns = document.querySelectorAll('.theme-toggle-btn');
    toggleBtns.forEach(function (btn) {
      var label = theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
      btn.setAttribute('aria-label', label);
      btn.setAttribute('title', label);
    });
  }

  function toggleTheme() {
    var current = document.documentElement.getAttribute('data-theme') || getActiveTheme();
    var next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  }

  // Initialize interactive controls on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', function () {
    // Ensure active theme matches attribute & storage
    var currentTheme = document.documentElement.getAttribute('data-theme') || getActiveTheme();
    applyTheme(currentTheme);

    // Bind all theme toggle buttons across navbar and mobile drawer
    var toggleBtns = document.querySelectorAll('.theme-toggle-btn');
    toggleBtns.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        toggleTheme();
      });
    });

    // Mobile Navigation Drawer Toggle
    var navBtn = document.getElementById('nav-toggle-btn');
    var mobileDrawer = document.getElementById('mobile-drawer');

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
  });

  // Listen to OS system theme changes if no manual preference is saved
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
      try {
        if (!localStorage.getItem(STORAGE_KEY)) {
          applyTheme(e.matches ? 'dark' : 'light');
        }
      } catch (err) {}
    });
  }
})();
