document.addEventListener('DOMContentLoaded', () => {

  // ===== HEADER SCROLL =====
  const header = document.getElementById('header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    header.classList.toggle('header--scrolled', currentScroll > 50);
    lastScroll = currentScroll;
  });

  // ===== MOBILE NAV =====
  const burgerBtn = document.getElementById('burgerBtn');
  const mainNav = document.getElementById('mainNav');

  burgerBtn.addEventListener('click', () => {
    burgerBtn.classList.toggle('active');
    mainNav.classList.toggle('open');
    document.body.style.overflow = mainNav.classList.contains('open') ? 'hidden' : '';
  });

  // Close mobile nav on link click
  mainNav.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      burgerBtn.classList.remove('active');
      mainNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Mobile dropdown toggle
  document.querySelectorAll('.nav__item--dropdown').forEach(item => {
    item.querySelector('.nav__link').addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        item.classList.toggle('active');
      }
    });
  });

  // ===== ACTIVE NAV ON SCROLL =====
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  function setActiveNav() {
    const scrollY = window.scrollY + 150;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', setActiveNav);

  // ===== SLIDER FUNCTIONALITY =====
  function initSlider(sliderId) {
    const slider = document.getElementById(sliderId);
    if (!slider) return;

    const track = slider.querySelector('[class$="__track"]');
    const prevBtn = slider.querySelector('.slider-btn--prev');
    const nextBtn = slider.querySelector('.slider-btn--next');

    if (!track || !prevBtn || !nextBtn) return;

    let position = 0;

    function getCardWidth() {
      const card = track.children[0];
      if (!card) return 0;
      const style = window.getComputedStyle(track);
      const gap = parseInt(style.gap) || 32;
      return card.offsetWidth + gap;
    }

    function getMaxScroll() {
      return Math.max(0, track.scrollWidth - track.parentElement.offsetWidth);
    }

    function slide(direction) {
      const cardWidth = getCardWidth();
      const maxScroll = getMaxScroll();

      position += direction * cardWidth;
      position = Math.max(0, Math.min(position, maxScroll));

      track.style.transform = `translateX(-${position}px)`;
    }

    prevBtn.addEventListener('click', () => slide(-1));
    nextBtn.addEventListener('click', () => slide(1));

    // Touch support
    let startX = 0;
    let isDragging = false;

    track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        slide(diff > 0 ? 1 : -1);
      }
      isDragging = false;
    }, { passive: true });
  }

  initSlider('teamSlider');
  initSlider('testimonialSlider');

  // ===== SCROLL REVEAL =====
  const revealElements = document.querySelectorAll(
    '.split__content, .split__image, .competence-card, .section__title, .section__subtitle, .mission-statement'
  );

  revealElements.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => observer.observe(el));

  // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
});
