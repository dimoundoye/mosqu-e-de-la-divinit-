import './style.css';

/* ==========================================================================
   INTERACTIVE SCRIPTS - MOSQUÉE DE LA DIVINITÉ (AJUSTEMENT VISUEL COCOON)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Render Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  
  initNavbarScroll();
  initMobileMenu();
  initHeroTabs();
  initScrollAnimations();
  initPrayerWidget();
  initGalleryLightbox();
  initContactForm();
  initEventCountdown();
});

/* --------------------------------------------------------------------------
   Navbar scroll & Active pill states
   -------------------------------------------------------------------------- */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');
  const sections = document.querySelectorAll('main > section');
  const mobileMenu = document.getElementById('nav-links');

  if (!navbar) return;

  let lastScrollY = window.scrollY;

  // Scroll background state
  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    const isMobileMenuOpen = mobileMenu && mobileMenu.classList.contains('active');

    if (currentScrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Hide on scroll down, show on scroll up (only when mobile menu is closed)
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

    // Scroll Spy: Highlight active nav link on scroll
    let currentSectionId = '';
    sections.forEach(sec => {
      const secTop = sec.offsetTop - 120;
      const secHeight = sec.offsetHeight;
      if (currentScrollY >= secTop && currentScrollY < secTop + secHeight) {
        currentSectionId = sec.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach(link => {
        link.classList.remove('active-pill');
        const href = link.getAttribute('href');
        if (href === `#${currentSectionId}` || (href === '#' && currentSectionId === 'home')) {
          link.classList.add('active-pill');
        }
      });
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check
  
  // Clicking nav links manually switches the pill active class immediately
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // Allow default hash scroll
      navLinks.forEach(l => l.classList.remove('active-pill'));
      link.classList.add('active-pill');
    });
  });
}

/* --------------------------------------------------------------------------
   Mobile menu toggle
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  
  if (!menuToggle || !navLinks) return;

  const toggleMenu = () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
  };

  menuToggle.addEventListener('click', toggleMenu);

  // Close menu when clicking on a nav link
  const links = navLinks.querySelectorAll('.nav-link');
  links.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });
}

/* --------------------------------------------------------------------------
   Hero bottom tabs navigation
   -------------------------------------------------------------------------- */
function initHeroTabs() {
  const tabButtons = document.querySelectorAll('.hero-tab-btn');
  
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetSelector = btn.getAttribute('data-target');
      const targetElement = document.querySelector(targetSelector);
      
      if (targetElement) {
        // Remove active class from other tabs
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Smooth scroll to element
        const offsetTop = targetElement.offsetTop - 90; // account for navbar height
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* --------------------------------------------------------------------------
   Intersection Observer for scroll animations
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.scroll-anim');
  
  if (animatedElements.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.12
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(element => {
    observer.observe(element);
  });
}

/* --------------------------------------------------------------------------
   Prayer Widget – Horaires officiels Dakar (Grande Mosquée / autorités islamiques)
   ⚠️  Pour mettre à jour les horaires : modifier le tableau DAKAR_SCHEDULE ci-dessous.
       Ajouter une nouvelle entrée { from, to, fajr, dhuhr, asr, maghrib, isha }
       avec les dates de début (from) et fin (to) de la semaine concernée.
   -------------------------------------------------------------------------- */
function initPrayerWidget() {
  const liveTimeEl       = document.getElementById('live-time');
  const countdownTimerEl = document.getElementById('countdown-timer');
  const nextPrayerNameEl = document.getElementById('next-prayer-name');

  if (!liveTimeEl) return;

  // ================================================================
  //  ✏️  HORAIRES OFFICIELS DAKAR – À METTRE À JOUR CHAQUE SEMAINE
  //  Source : Grande Mosquée de Dakar / Autorités islamiques sénégalaises
  //  Format des dates : 'YYYY-MM-DD'
  // ================================================================
  const DAKAR_SCHEDULE = [
    // ─── Semaine du 26 Juin au 02 Juillet 2026 ───────────────────────
    {
      from: '2026-06-26', to: '2026-07-02',
      fajr: '05:29', dhuhr: '14:15', asr: '17:00', maghrib: '19:50', isha: '20:50'
    },
    // ─── Ajouter les semaines suivantes ici, même format ────────────
    // {
    //   from: '2026-07-03', to: '2026-07-09',
    //   fajr: '05:29', dhuhr: '14:15', asr: '17:00', maghrib: '19:50', isha: '20:50'
    // },
  ];

  // ================================================================
  //  Horaires par défaut (utilisés si la date n'est pas dans le planning)
  // ================================================================
  const DEFAULT_TIMES = {
    fajr: '05:29', dhuhr: '14:15', asr: '17:00', maghrib: '19:50', isha: '20:50'
  };

  // Définition des prières (clé, nom affiché)
  const PRAYER_DEFS = [
    { key: 'fajr',    label: 'Fajr (L\'Aube)' },
    { key: 'dhuhr',   label: 'Dhuhr (Le Midi)' },
    { key: 'asr',     label: 'Asr (L\'Après-midi)' },
    { key: 'maghrib', label: 'Maghrib (Le Coucher)' },
    { key: 'isha',    label: 'Isha (La Nuit)' },
  ];

  // ------------------------------------------------------------------
  // Récupère les horaires de la semaine correspondant à aujourd'hui
  // ------------------------------------------------------------------
  const getTodaySchedule = () => {
    const now       = new Date();
    // On travaille en heure Dakar (UTC+0)
    const dakarNow  = new Date(now.toLocaleString('en-US', { timeZone: 'Africa/Dakar' }));
    const todayStr  = dakarNow.toISOString().slice(0, 10); // 'YYYY-MM-DD'

    const week = DAKAR_SCHEDULE.find(s => todayStr >= s.from && todayStr <= s.to);
    return week || DEFAULT_TIMES;
  };

  // ------------------------------------------------------------------
  // Construit le tableau de prières actif à partir du planning
  // ------------------------------------------------------------------
  const buildPrayers = (schedule) =>
    PRAYER_DEFS.map(def => {
      const timeStr = schedule[def.key] || DEFAULT_TIMES[def.key];
      const [hour, min] = timeStr.split(':').map(Number);
      return { key: def.key, label: def.label, timeStr, hour, min };
    });

  let prayers = buildPrayers(getTodaySchedule());

  // ------------------------------------------------------------------
  // Mise à jour des horaires affichés dans le DOM
  // ------------------------------------------------------------------
  const applyPrayersToDOM = () => {
    prayers.forEach(p => {
      const timeEl = document.getElementById(`time-${p.key}`);
      if (timeEl) timeEl.textContent = p.timeStr;
    });
  };

  // ------------------------------------------------------------------
  // Horloge en temps réel (Dakar = UTC+0)
  // ------------------------------------------------------------------
  const updateClock = () => {
    const now       = new Date();
    const dakarTime = new Date(now.toLocaleString('en-US', { timeZone: 'Africa/Dakar' }));

    const hh = String(dakarTime.getHours()).padStart(2, '0');
    const mm = String(dakarTime.getMinutes()).padStart(2, '0');
    const ss = String(dakarTime.getSeconds()).padStart(2, '0');
    liveTimeEl.textContent = `${hh}:${mm}:${ss}`;

    updateCountdownAndActive(dakarTime);
  };

  // ------------------------------------------------------------------
  // Calcul de la prochaine prière & mise en valeur de la ligne active
  // ------------------------------------------------------------------
  const updateCountdownAndActive = (now) => {
    const currentTotalSec = (now.getHours() * 3600) + (now.getMinutes() * 60) + now.getSeconds();

    let nextPrayerIndex = -1;
    let minDifference   = Infinity;

    for (let i = 0; i < prayers.length; i++) {
      const pSec = (prayers[i].hour * 3600) + (prayers[i].min * 60);
      const diff = pSec - currentTotalSec;
      if (diff > 0 && diff < minDifference) {
        minDifference   = diff;
        nextPrayerIndex = i;
      }
    }

    let countdownSeconds;
    let nextPrayer;
    let activePrayerKey = '';

    if (nextPrayerIndex !== -1) {
      nextPrayer       = prayers[nextPrayerIndex];
      countdownSeconds = minDifference;
      activePrayerKey  = nextPrayerIndex === 0 ? 'isha' : prayers[nextPrayerIndex - 1].key;
    } else {
      // Après Isha → countdown jusqu'au Fajr du lendemain
      nextPrayer       = prayers[0];
      const secToMidnight   = (24 * 3600) - currentTotalSec;
      const fajrSecTomorrow = (prayers[0].hour * 3600) + (prayers[0].min * 60);
      countdownSeconds = secToMidnight + fajrSecTomorrow;
      activePrayerKey  = 'isha';
    }

    // Affichage du compte à rebours
    const cH = Math.floor(countdownSeconds / 3600);
    const cM = Math.floor((countdownSeconds % 3600) / 60);
    const cS = countdownSeconds % 60;

    if (countdownTimerEl) {
      countdownTimerEl.textContent =
        `${String(cH).padStart(2, '0')}:${String(cM).padStart(2, '0')}:${String(cS).padStart(2, '0')}`;
    }
    if (nextPrayerNameEl) {
      nextPrayerNameEl.textContent = nextPrayer.label;
    }

    // Mise en surbrillance de la prière en cours
    prayers.forEach(p => {
      const row = document.getElementById(`prayer-${p.key}`);
      if (row) row.classList.toggle('active', p.key === activePrayerKey);
    });
  };

  // ------------------------------------------------------------------
  // Rechargement automatique à minuit (récupère la bonne semaine)
  // ------------------------------------------------------------------
  const scheduleMidnightRefresh = () => {
    const now         = new Date();
    const midnight    = new Date(now);
    midnight.setHours(24, 0, 5, 0);
    setTimeout(() => {
      prayers = buildPrayers(getTodaySchedule()); // Nouvelle semaine éventuelle
      applyPrayersToDOM();
      scheduleMidnightRefresh();
    }, midnight - now);
  };

  // ------------------------------------------------------------------
  // Initialisation
  // ------------------------------------------------------------------
  applyPrayersToDOM();
  updateClock();
  setInterval(updateClock, 1000);
  scheduleMidnightRefresh();
}

/* --------------------------------------------------------------------------
   Gallery Lightbox overlay
   -------------------------------------------------------------------------- */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('gallery-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close-btn');

  if (!lightbox || !lightboxImg || !lightboxCaption || galleryItems.length === 0) return;

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const imgSrc = item.getAttribute('data-image');
      const imgCaption = item.getAttribute('data-caption');

      lightboxImg.src = imgSrc;
      lightboxImg.alt = imgCaption;
      lightboxCaption.textContent = imgCaption;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => {
      lightboxImg.src = '';
    }, 400);
  };

  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/* --------------------------------------------------------------------------
   Contact Form Simulation
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');
  
  if (!form || !feedback) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const submitBtn = document.getElementById('form-submit-btn');
    const originalText = submitBtn.textContent;
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Planification en cours...';
    
    setTimeout(() => {
      feedback.textContent = 'Votre demande de visite a été reçue ! Notre guide prendra contact avec vous rapidement par téléphone ou email.';
      feedback.className = 'form-feedback-msg success';
      
      form.reset();
      
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      
      setTimeout(() => {
        feedback.style.display = 'none';
      }, 7000);
      
    }, 1500);
  });
}

/* --------------------------------------------------------------------------
   Event Countdown Timer (Centenaire event: July 4, 2026 at 10:00:00 Dakar time / UTC)
   -------------------------------------------------------------------------- */
function initEventCountdown() {
  const daysEl = document.getElementById('event-days');
  const hoursEl = document.getElementById('event-hours');
  const minutesEl = document.getElementById('event-minutes');
  const secondsEl = document.getElementById('event-seconds');
  const calendarBtn = document.getElementById('add-to-calendar-btn');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  // The event is Saturday, July 4, 2026, at 10:00 AM.
  // Dakar is in the UTC timezone, so we can use UTC dates directly.
  const targetDate = new Date('2026-07-04T10:00:00Z');

  const updateCountdown = () => {
    const now = new Date();
    const timeRemaining = targetDate - now;

    if (timeRemaining <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      
      const titleEl = document.querySelector('.event-countdown-card .side-events-title');
      if (titleEl) {
        titleEl.textContent = "L'événement a commencé";
      }
      return;
    }

    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
  };

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // Calendar button handler
  if (calendarBtn) {
    calendarBtn.addEventListener('click', () => {
      const title = encodeURIComponent("Centenaire de la naissance de Mouhamed Seyni Gueye");
      const dates = "20260704T100000Z/20260704T180000Z";
      const details = encodeURIComponent("Commémoration du centenaire de la naissance de Mouhamed Seyni Gueye (Khalifatou Lahi Fil Ardi - 100 ans d'héritage, de foi et de transmission).");
      const location = encodeURIComponent("Mosquée de la Divinité, Ouakam, Dakar, Sénégal");
      
      const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
      window.open(googleCalendarUrl, '_blank');
    });
  }
}
