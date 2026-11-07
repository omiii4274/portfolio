/* ========================================================
   OM J PATEL — PORTFOLIO JAVASCRIPT
   Smooth Cursor, Scrolled Nav, Mobile Menu, Scroll Reveal, Form
   ======================================================== */

// ── CUSTOM CURSOR ──
const cur = document.getElementById('cur');
const ring = document.getElementById('ring');
let mx = window.innerWidth / 2;
let my = window.innerHeight / 2;
let rx = mx;
let ry = my;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
});

function animCursor() {
  if (cur) {
    cur.style.left = mx + 'px';
    cur.style.top = my + 'px';
  }
  rx += (mx - rx) * 0.15;
  ry += (my - ry) * 0.15;
  if (ring) {
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
  }
  requestAnimationFrame(animCursor);
}
animCursor();

document.querySelectorAll('a, button, video, input, textarea, .skill-tag, .about-card, .cert-item').forEach(el => {
  el.addEventListener('mouseenter', () => {
    if (ring) {
      ring.style.transform = 'translate(-50%, -50%) scale(1.8)';
      ring.style.borderColor = 'var(--gold)';
      ring.style.opacity = '1';
    }
  });
  el.addEventListener('mouseleave', () => {
    if (ring) {
      ring.style.transform = 'translate(-50%, -50%) scale(1)';
      ring.style.borderColor = 'var(--gold)';
      ring.style.opacity = '0.6';
    }
  });
});

// ── NAVBAR ON SCROLL ──
const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
  if (nav) {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }
});

// ── MOBILE MENU ──
function toggleMob() {
  const ham = document.getElementById('ham');
  const mob = document.getElementById('mobNav');
  if (ham && mob) {
    ham.classList.toggle('open');
    mob.classList.toggle('open');
    document.body.style.overflow = mob.classList.contains('open') ? 'hidden' : '';
  }
}

function closeMob() {
  const ham = document.getElementById('ham');
  const mob = document.getElementById('mobNav');
  if (ham && mob) {
    ham.classList.remove('open');
    mob.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// ── SCROLL REVEAL (INTERSECTION OBSERVER) ──
const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 70);
      obs.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
});

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ── AUTOPLAY VIDEOS SAFE FALLBACK ──
document.querySelectorAll('video').forEach(vid => {
  vid.muted = true;
  const playPromise = vid.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      // Autoplay prevented by browser policy until interaction
      document.body.addEventListener('click', () => vid.play(), { once: true });
    });
  }
});

// ── CONTACT FORM VIA AJAX ──
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const submitBtn = document.getElementById('submit-btn');

if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (submitBtn) {
      submitBtn.value = 'Sending...';
      submitBtn.disabled = true;
    }

    const payload = {
      name: contactForm.elements['Name'] ? contactForm.elements['Name'].value : '',
      email: contactForm.elements['Email'] ? contactForm.elements['Email'].value : '',
      subject: contactForm.elements['Subject'] ? contactForm.elements['Subject'].value : 'New Portfolio Inquiry',
      message: contactForm.elements['Message'] ? contactForm.elements['Message'].value : ''
    };

    fetch('https://formsubmit.co/ajax/ompatel4274@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        if (formStatus) {
          formStatus.style.color = 'var(--gold)';
          formStatus.innerHTML = '✅ Message sent successfully! I will get back to you soon.';
        }
        contactForm.reset();
      })
      .catch(err => {
        if (formStatus) {
          formStatus.style.color = '#ef4444';
          formStatus.innerHTML = '⚠️ Note: Sending direct email. Please email directly to ompatel4274@gmail.com';
        }
      })
      .finally(() => {
        if (submitBtn) {
          submitBtn.value = 'Send Message';
          submitBtn.disabled = false;
        }
      });
  });
}
