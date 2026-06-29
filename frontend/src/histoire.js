import './style.css';

document.addEventListener('DOMContentLoaded', () => {
  // Render Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  
  initThemeToggle();
  initNavbarScroll();
  initMobileMenu();
  initHistoryScrollSpy();
});

/* Theme Toggle logic */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
}


/* Navbar scroll hiding */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  const mobileMenu = document.getElementById('nav-links');
  if (!navbar) return;

  let lastScrollY = window.scrollY;

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    const isMobileMenuOpen = mobileMenu && mobileMenu.classList.contains('active');

    if (currentScrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    if (!isMobileMenuOpen && currentScrollY > 100) {
      if (currentScrollY > lastScrollY) {
        navbar.classList.add('nav-hidden');
      } else {
        navbar.classList.remove('nav-hidden');
      }
    } else {
      navbar.classList.remove('nav-hidden');
    }

    lastScrollY = currentScrollY;
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll();
}

/* Mobile Menu Toggle */
function initMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  
  if (!menuToggle || !navLinks) return;

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  const links = navLinks.querySelectorAll('.nav-link');
  links.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });
}

/* Scroll Spy for the History page index sidebar */
function initHistoryScrollSpy() {
  const spyLinks = document.querySelectorAll('.history-index-link');
  const sections = document.querySelectorAll('.history-content-section');

  if (spyLinks.length === 0 || sections.length === 0) return;

  const handleSpy = () => {
    let currentSectionId = '';
    
    sections.forEach(sec => {
      const secTop = sec.offsetTop - 120;
      const secHeight = sec.offsetHeight;
      if (window.scrollY >= secTop && window.scrollY < secTop + secHeight) {
        currentSectionId = sec.getAttribute('id');
      }
    });

    if (currentSectionId) {
      spyLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }
  };

  window.addEventListener('scroll', handleSpy);
  handleSpy();
}
