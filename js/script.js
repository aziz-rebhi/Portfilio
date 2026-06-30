/**
 * Portfolio — Rebhi Aziz
 * Custom JavaScript: preloader, typing effect, AOS, navbar, form, back-to-top, animations
 */

document.addEventListener('DOMContentLoaded', function () {

  // ==========================================================
  // 1. Preloader
  // ==========================================================
  const preloader = document.getElementById('preloader');
  function hidePreloader() {
    preloader.classList.add('loaded');
  }
  // Fallback: hide preloader after 2s even if fonts/images haven't finished
  const preloaderTimer = setTimeout(hidePreloader, 2000);
  // Also hide on window load (fonts, images, etc.)
  window.addEventListener('load', function () {
    clearTimeout(preloaderTimer);
    hidePreloader();
  });

  // ==========================================================
  // 2. Current Year
  // ==========================================================
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ==========================================================
  // 3. AOS — respects prefers-reduced-motion
  // ==========================================================
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  AOS.init({
    duration: 500,
    once: true,
    offset: 40,
    disable: prefersReduced
  });

  // ==========================================================
  // 4. Navbar scroll effect
  // ==========================================================
  const navbar = document.getElementById('mainNavbar');
  const backToTopBtn = document.getElementById('backToTop');

  function handleScroll() {
    const scrollY = window.scrollY;

    // Navbar transparent → solid at 60px
    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back-to-top visibility at 400px
    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  }

  // Throttled scroll handler
  let ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Initial call in case page is already scrolled
  handleScroll();

  // ==========================================================
  // 5. Typing Effect
  // ==========================================================
  const roles = [
    'Junior Software Developer',
    'C++ | Qt Developer',
    'Java Developer',
    'Symfony Backend Developer',
    'Linux Enthusiast'
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingElement = document.getElementById('typing-text');
  let typeTimeout = null;

  function typeEffect() {
    if (!typingElement) return;
    const currentRole = roles[roleIndex];

    if (!isDeleting) {
      // Typing forward
      typingElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === currentRole.length) {
        isDeleting = true;
        typeTimeout = setTimeout(typeEffect, 2000);
        return;
      }
      typeTimeout = setTimeout(typeEffect, 80);
    } else {
      // Deleting backward
      typingElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeTimeout = setTimeout(typeEffect, 300);
        return;
      }
      typeTimeout = setTimeout(typeEffect, 40);
    }
  }

  // Start typing after a brief delay
  setTimeout(typeEffect, 600);

  // ==========================================================
  // 6. Auto-close mobile navbar on link click
  // ==========================================================
  document.querySelectorAll('.navbar-nav .nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      const navbarCollapse = document.getElementById('navbarNav');
      if (navbarCollapse.classList.contains('show')) {
        const bsCollapse = new bootstrap.Collapse(navbarCollapse, { toggle: false });
        bsCollapse.hide();
      }
    });
  });

  // ==========================================================
  // 7. Contact form — Formspree AJAX
  // ==========================================================
  const form = document.getElementById('contactForm');
  const feedbackEl = document.getElementById('formFeedback');
  const submitBtn = document.getElementById('formSubmitBtn');

  if (form && feedbackEl && submitBtn) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      e.stopPropagation();

      // Reset feedback
      feedbackEl.classList.remove('show', 'success', 'error');

      // Bootstrap client-side validation
      if (!form.checkValidity()) {
        feedbackEl.textContent = 'Please fill in all required fields correctly.';
        feedbackEl.className = 'form-feedback show error';
        form.classList.add('was-validated');
        return;
      }

      // Disable button during submission
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending... <i class="bi bi-hourglass-split ms-2" aria-hidden="true"></i>';

      // AJAX to Formspree
      const formData = new FormData(form);

      fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
      .then(function (response) {
        if (response.ok) {
          feedbackEl.textContent = 'Thank you! Your message has been received. I will get back to you soon.';
          feedbackEl.className = 'form-feedback show success';
          form.reset();
          form.classList.remove('was-validated');
        } else {
          // Formspree returns 200+ with JSON body, but handle non-OK too
          return response.json().then(function (data) {
            if (data.error) {
              throw new Error(data.error);
            }
            feedbackEl.textContent = 'Thank you! Your message has been received. I will get back to you soon.';
            feedbackEl.className = 'form-feedback show success';
            form.reset();
            form.classList.remove('was-validated');
          });
        }
      })
      .catch(function (err) {
        feedbackEl.textContent = 'Oops! Something went wrong. Please try again later or email me directly.';
        feedbackEl.className = 'form-feedback show error';
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Send Message <i class="bi bi-send ms-2" aria-hidden="true"></i>';
      });
    });
  }

  // ==========================================================
  // 8. Back to Top
  // ==========================================================
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ==========================================================
  // 9. Skill Tags — Staggered entrance using Intersection Observer
  // ==========================================================
  const skillTagObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const tags = entry.target.querySelectorAll('.skill-tag');
        tags.forEach(function (tag) {
          const delay = parseInt(tag.getAttribute('data-delay')) || 0;
          setTimeout(function () {
            tag.classList.add('visible');
          }, delay);
        });
        // Unobserve after triggering
        skillTagObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.skill-card').forEach(function (card) {
    skillTagObserver.observe(card);
  });

  // ==========================================================
  // 10. Language Bars — Animate on scroll into view
  // ==========================================================
  const langBarObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const fill = entry.target.querySelector('.lang-bar-fill');
        if (fill) {
          const width = fill.getAttribute('data-width');
          if (width) {
            fill.style.width = width + '%';
          }
        }
        langBarObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('.lang-card').forEach(function (card) {
    langBarObserver.observe(card);
  });

});