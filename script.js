// ── PAGE NAVIGATION ──
function navigate(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const t = document.getElementById('page-' + page);
  if (t) {
    t.classList.add('active');
  }
  document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('open'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (page === 'home') initCounters();

  // Highlight active menu item with a single underline
  const pageToNavMap = {
    'home': 'home',
    'services': 'services',
    'programmes': 'programmes',
    'news': 'media',
    'contact': 'contact'
  };
  const activeNavKey = pageToNavMap[page] || page;
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active-nav');
    const onclickText = link.getAttribute('onclick') || '';
    if (onclickText.includes(activeNavKey)) {
      link.classList.add('active-nav');
    }
  });
}

// Ensure navigate is globally accessible
window.navigate = navigate;

// ── DROPDOWNS ──
function toggleDropdown(id) {
  const dd = document.getElementById('dropdown-' + id);
  const was = dd.classList.contains('open');
  document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('open'));
  if (!was) dd.classList.add('open');
}

window.toggleDropdown = toggleDropdown;

document.addEventListener('click', e => {
  if (!e.target.closest('.nav-item')) {
    document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('open'));
  }
});

// ── PROFILE SLIDER ──
let profileOffset = 0;
const profileCardW = 220 + 18;

function profileSlide(dir) {
  const track = document.getElementById('profileTrack');
  if (!track) return;
  const cards = track.querySelectorAll('.profile-card');
  const visible = Math.floor(track.parentElement.offsetWidth / profileCardW);
  const maxOffset = Math.max(0, (cards.length - visible) * profileCardW);
  if (maxOffset <= 0) return;

  let newOffset = profileOffset + dir * profileCardW;
  if (newOffset > maxOffset) {
    newOffset = 0;
  } else if (newOffset < 0) {
    newOffset = maxOffset;
  }
  profileOffset = newOffset;
  track.style.transform = 'translateX(-' + profileOffset + 'px)';
}

window.profileSlide = profileSlide;

function selectProfile(el, name) {
  document.querySelectorAll('.profile-card').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  showNotif('Profile set: ' + name);
}

window.selectProfile = selectProfile;

// ── PROGRAMMES SLIDER ──
let progOffset = 0;
const progCardW = 340 + 24;

function progSlide(dir) {
  const track = document.getElementById('progTrack');
  if (!track) return;
  const cards = track.querySelectorAll('.prog-card');
  const visible = Math.floor(track.parentElement.offsetWidth / progCardW);
  const maxOffset = Math.max(0, (cards.length - visible) * progCardW);
  if (maxOffset <= 0) return;

  let newOffset = progOffset + dir * progCardW;
  if (newOffset > maxOffset) {
    newOffset = 0;
  } else if (newOffset < 0) {
    newOffset = maxOffset;
  }
  progOffset = newOffset;
  track.style.transform = 'translateX(-' + progOffset + 'px)';
}

window.progSlide = progSlide;

// ── AGENCIES SLIDER ──
let agenciesOffset = 0;
const agencyItemW = 160 + 18;

function agenciesSlide(dir) {
  const track = document.getElementById('agenciesTrack');
  if (!track) return;
  const items = track.querySelectorAll('.agency-item');
  const visible = Math.floor(track.parentElement.offsetWidth / agencyItemW);
  const maxOffset = Math.max(0, (items.length - visible) * agencyItemW);
  if (maxOffset <= 0) return;

  let newOffset = agenciesOffset + dir * agencyItemW;
  if (newOffset > maxOffset) {
    newOffset = 0;
  } else if (newOffset < 0) {
    newOffset = maxOffset;
  }
  agenciesOffset = newOffset;
  track.style.transform = 'translateX(-' + agenciesOffset + 'px)';
}

window.agenciesSlide = agenciesSlide;

// ── CAROUSEL ──
let currentSlide = 0;

function updateCarousel() {
  const track = document.getElementById('carouselTrack');
  if (!track) return;
  const slides = track.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.carousel-dot');
  
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === currentSlide);
  });
  
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });

  const containerW = track.parentElement.offsetWidth;
  const slideW = slides[currentSlide].offsetWidth;
  const slideLeft = slides[currentSlide].offsetLeft;
  
  const targetOffset = slideLeft - (containerW / 2) + (slideW / 2);
  track.style.transform = 'translateX(-' + targetOffset + 'px)';
}

function carouselMove(dir) {
  currentSlide = (currentSlide + dir + 3) % 3;
  updateCarousel();
}

window.carouselMove = carouselMove;

function goToSlide(i) {
  currentSlide = i;
  updateCarousel();
}

window.goToSlide = goToSlide;

window.addEventListener('resize', updateCarousel);
setInterval(() => carouselMove(1), 5000);

// ── ANIMATED COUNTERS ──
let countersRan = false;

function initCounters() {
  if (countersRan) return;
  const dash = document.querySelector('.dashboard-section');
  if (!dash) return;
  const obs = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    obs.disconnect();
    countersRan = true;
    const run = (el, target, fmt) => {
      let cur = 0;
      const steps = 120;
      const inc = target / steps;
      const t = setInterval(() => {
        cur += inc;
        if (cur >= target) {
          cur = target;
          clearInterval(t);
        }
        el.innerHTML = fmt(cur);
      }, 16);
    };
    const s1 = document.getElementById('stat1');
    const s2 = document.getElementById('stat2');
    const s3 = document.getElementById('stat3');
    const s4 = document.getElementById('stat4');
    if (s1) run(s1, 4820, v => Math.floor(v).toLocaleString());
    if (s2) run(s2, 12.40, v => v.toFixed(2) + '<sub>/kg</sub>');
    if (s3) run(s3, 58.3, v => v.toFixed(1) + ' mil');
    if (s4) run(s4, 186, v => Math.floor(v).toString());
  }, { threshold: 0.3 });
  obs.observe(dash);
}

// ── FILTERS ──
function filterServices(btn, cat) {
  document.querySelectorAll('.filter-bar .filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('#servicesGrid .service-full-card').forEach(c => {
    c.style.display = (cat === 'all' || c.dataset.cat === cat) ? '' : 'none';
  });
}

window.filterServices = filterServices;

function filterNews(btn, cat) {
  document.querySelectorAll('.filter-bar .filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('#newsGrid .news-full-card').forEach(c => {
    c.style.display = (cat === 'all' || c.dataset.ncat === cat) ? '' : 'none';
  });
}

window.filterNews = filterNews;

// ── CONTACT FORM ──
function submitForm() {
  const f = document.getElementById('fname').value.trim();
  const e = document.getElementById('email').value.trim();
  const m = document.getElementById('message').value.trim();
  if (!f || !e || !m) {
    showNotif('Please fill in all required fields.');
    return;
  }
  const s = document.getElementById('formSuccess');
  if (s) {
    s.style.display = 'block';
    setTimeout(() => s.style.display = 'none', 6000);
  }
  showNotif('Message sent successfully!');
}

window.submitForm = submitForm;

// ── NOTIFICATION ──
function showNotif(msg) {
  const n = document.getElementById('notification');
  if (n) {
    n.textContent = msg;
    n.classList.add('show');
    setTimeout(() => n.classList.remove('show'), 3000);
  }
}

window.showNotif = showNotif;

// ── STICKY/GLASSMORPHISM HEADER ON SCROLL ──
window.addEventListener('scroll', () => {
  const header = document.querySelector('.header');
  if (header) {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
      header.style.setProperty('position', 'fixed', 'important');
      header.style.setProperty('top', '0', 'important');
      header.style.setProperty('background', '#0354AB', 'important');
      header.style.setProperty('background-color', '#0354AB', 'important');
      header.style.setProperty('backdrop-filter', 'blur(12px)', 'important');
      header.style.setProperty('box-shadow', '0 4px 20px rgba(0,0,0,0.3)', 'important');
      header.style.setProperty('border-bottom', '1px solid rgba(255,255,255,0.1)', 'important');
    } else {
      header.classList.remove('scrolled');
      header.style.setProperty('position', 'absolute', 'important');
      header.style.setProperty('top', '0', 'important');
      header.style.setProperty('background', 'transparent', 'important');
      header.style.setProperty('background-color', 'transparent', 'important');
      header.style.setProperty('backdrop-filter', 'none', 'important');
      header.style.setProperty('box-shadow', 'none', 'important');
      header.style.setProperty('border-bottom', '1px solid rgba(255, 255, 255, 0.15)', 'important');
    }
  }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  initCounters();
  setTimeout(updateCarousel, 200);

  // ── BACK TO TOP ──
  const btt = document.getElementById('backToTop');
  if (btt) {
    window.addEventListener('scroll', () => btt.classList.toggle('visible', window.scrollY > 300));
    btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // ── VISITOR COUNTER ──
  let todayCount = 1435;
  setInterval(() => {
    todayCount += Math.floor(Math.random() * 3);
    const el = document.getElementById('visToday');
    if (el) el.textContent = todayCount.toLocaleString();
  }, 9000);
});

// ── SEARCH BAR ──
function toggleSearchBar() {
  const wrapper = document.querySelector('.search-bar-wrapper');
  const input = document.getElementById('search-input');
  if (wrapper) {
    if (wrapper.classList.contains('open')) {
      const val = input.value.trim();
      if (val) {
        handleSearchClick(val);
      } else {
        wrapper.classList.remove('open');
      }
    } else {
      wrapper.classList.add('open');
      input.focus();
    }
  }
}

function handleSearchClick(val) {
  if (!val) {
    const input = document.getElementById('search-input');
    val = input ? input.value.trim() : '';
  }
  if (val) {
    showNotif(`Searching for "${val}"...`);
  }
}

function changeLanguage(lang) {
  const btn = document.querySelector('.lang-nav-btn');
  if (lang === 'en') {
    if (btn) btn.innerHTML = `ENGLISH <svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>`;
    showNotif('Language switched to English');
  } else {
    if (btn) btn.innerHTML = `BAHASA MALAYSIA <svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>`;
    showNotif('Bahasa ditukar ke Bahasa Malaysia');
  }
  document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('open'));
}

window.toggleSearchBar = toggleSearchBar;
window.handleSearchClick = handleSearchClick;
window.changeLanguage = changeLanguage;
