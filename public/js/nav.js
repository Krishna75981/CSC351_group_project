/*
  Name:       Jackson [last name]
  Course:     CSC351 Database Management
  Date:       2026-11-12
  Assignment: Semester project
  Purpose:    Opens and closes the nav menu on narrow screens.
*/
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('is-open', !open);
  });
});
