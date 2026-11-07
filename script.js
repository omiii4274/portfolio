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

// ── CONTACT FORM: EMAIL & WHATSAPP INTEGRATION ──
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const emailBtn = document.getElementById('email-submit-btn');
const whatsappBtn = document.getElementById('whatsapp-submit-btn');

function getFormData() {
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const subjectInput = document.getElementById('contact-subject');
  const messageInput = document.getElementById('contact-message');

  return {
    name: nameInput ? nameInput.value.trim() : '',
    email: emailInput ? emailInput.value.trim() : '',
    subject: subjectInput && subjectInput.value.trim() ? subjectInput.value.trim() : 'New Portfolio Inquiry',
    message: messageInput ? messageInput.value.trim() : ''
  };
}

// 1. Send via Email (FormSubmit AJAX with mailto fallback)
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const data = getFormData();

    if (!data.name || !data.email || !data.message) {
      if (formStatus) {
        formStatus.style.color = 'var(--coral)';
        formStatus.innerHTML = '⚠️ Please fill in all required fields (Name, Email, Message).';
      }
      return;
    }

    if (emailBtn) {
      emailBtn.innerHTML = `
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
        Sending...
      `;
      emailBtn.disabled = true;
    }

    if (formStatus) {
      formStatus.style.color = 'var(--gold)';
      formStatus.innerHTML = '⏳ Delivering your message...';
    }

    fetch('https://formsubmit.co/ajax/ompatel4274@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        Name: data.name,
        Email: data.email,
        _subject: 'Portfolio Message: ' + data.subject,
        Message: data.message
      })
    })
      .then(res => res.json())
      .then(() => {
        if (formStatus) {
          formStatus.style.color = '#22c55e';
          formStatus.innerHTML = '✅ Message sent successfully to ompatel4274@gmail.com! I will reply shortly.';
        }
        contactForm.reset();
      })
      .catch(() => {
        const mailtoUrl = 'mailto:ompatel4274@gmail.com?subject=' + encodeURIComponent(data.subject) + '&body=' + encodeURIComponent('From: ' + data.name + ' (' + data.email + ')\n\n' + data.message);
        window.location.href = mailtoUrl;
        if (formStatus) {
          formStatus.style.color = 'var(--gold)';
          formStatus.innerHTML = '📬 Opening your email client to send message...';
        }
      })
      .finally(() => {
        if (emailBtn) {
          emailBtn.innerHTML = `
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,12 2,6"/></svg>
            Send via Email
          `;
          emailBtn.disabled = false;
        }
      });
  });
}

// 2. Send via WhatsApp (Direct wa.me integration with pre-filled message)
if (whatsappBtn) {
  whatsappBtn.addEventListener('click', function () {
    const data = getFormData();

    if (!data.name || !data.message) {
      if (formStatus) {
        formStatus.style.color = 'var(--coral)';
        formStatus.innerHTML = '⚠️ Please enter at least your Name and Message to send via WhatsApp.';
      }
      const targetInput = !data.name ? document.getElementById('contact-name') : document.getElementById('contact-message');
      if (targetInput) targetInput.focus();
      return;
    }

    const waText =
      "👋 *Hello Om Patel!* Reaching out from your portfolio:\n\n" +
      "👤 *Name:* " + data.name + "\n" +
      (data.email ? "📧 *Email:* " + data.email + "\n" : "") +
      (data.subject ? "📌 *Subject:* " + data.subject + "\n\n" : "\n") +
      "💬 *Message:*\n" + data.message;

    const waUrl = "https://wa.me/917016698923?text=" + encodeURIComponent(waText);
    window.open(waUrl, '_blank');

    if (formStatus) {
      formStatus.style.color = '#25D366';
      formStatus.innerHTML = '💬 WhatsApp opened with your pre-filled message! Press send in WhatsApp.';
    }
  });
}
