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

// ========================================================
// ── INTERACTIVE PROJECT MODAL, CODE VIEWER & SIMULATORS ──
// ========================================================

const projectsData = {
  nomadic: {
    title: "Nomadic — Tour & Travel Booking Platform",
    badge: "Academic Project · Full Stack PHP & MySQL",
    summary: "A production-grade travel booking web application featuring dynamic destination catalogs, user authentication, secure bookings, relational SQL schema, and async REST endpoints.",
    demo: {
      intro: "Test the live booking engine simulator below. Select a tour, adjust party size, and submit a live booking transaction.",
      type: "nomadic"
    },
    codeFiles: [
      {
        name: "booking_api.php",
        lang: "PHP",
        code: `<?php
/**
 * Nomadic Tour Booking Engine API
 * Handles authenticated booking transactions with PDO prepared statements
 */
header('Content-Type: application/json');
require_once 'config/db.php';

session_start();
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Authentication required']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$tourId = filter_var($input['tour_id'] ?? null, FILTER_VALIDATE_INT);
$travelers = filter_var($input['travelers'] ?? 1, FILTER_VALIDATE_INT);
$bookingDate = htmlspecialchars($input['booking_date'] ?? '');

if (!$tourId || $travelers < 1 || empty($bookingDate)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid booking parameters']);
    exit;
}

try {
    $pdo->beginTransaction();

    // 1. Fetch tour details & check capacity
    $stmt = $pdo->prepare("SELECT title, price, max_slots, booked_slots FROM tours WHERE id = ? FOR UPDATE");
    $stmt->execute([$tourId]);
    $tour = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$tour || ($tour['booked_slots'] + $travelers) > $tour['max_slots']) {
        $pdo->rollBack();
        echo json_encode(['success' => false, 'error' => 'Selected tour has insufficient slots available']);
        exit;
    }

    $totalAmount = $tour['price'] * $travelers;
    $bookingCode = 'NOM-' . strtoupper(bin2hex(random_bytes(4)));

    // 2. Insert booking record
    $ins = $pdo->prepare("INSERT INTO bookings (booking_code, user_id, tour_id, travelers, total_amount, booking_date, status) VALUES (?, ?, ?, ?, ?, ?, 'confirmed')");
    $ins->execute([$bookingCode, $_SESSION['user_id'], $tourId, $travelers, $totalAmount, $bookingDate]);

    // 3. Increment booked slots count
    $upd = $pdo->prepare("UPDATE tours SET booked_slots = booked_slots + ? WHERE id = ?");
    $upd->execute([$travelers, $tourId]);

    $pdo->commit();

    echo json_encode([
        'success' => true,
        'booking_code' => $bookingCode,
        'tour' => $tour['title'],
        'total' => $totalAmount,
        'message' => 'Booking successfully confirmed!'
    ]);
} catch (Exception $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Transaction failed: ' . $e->getMessage()]);
}`
      },
      {
        name: "schema.sql",
        lang: "SQL",
        code: `-- Nomadic Relational Database Architecture
CREATE DATABASE IF NOT EXISTS nomadic_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE nomadic_db;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(160) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE destinations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    image_url VARCHAR(255),
    featured BOOLEAN DEFAULT FALSE
) ENGINE=InnoDB;

CREATE TABLE tours (
    id INT AUTO_INCREMENT PRIMARY KEY,
    destination_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    duration_days INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    max_slots INT NOT NULL DEFAULT 20,
    booked_slots INT NOT NULL DEFAULT 0,
    FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_code VARCHAR(30) UNIQUE NOT NULL,
    user_id INT NOT NULL,
    tour_id INT NOT NULL,
    travelers INT NOT NULL DEFAULT 1,
    total_amount DECIMAL(10,2) NOT NULL,
    booking_date DATE NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (tour_id) REFERENCES tours(id)
) ENGINE=InnoDB;`
      },
      {
        name: "checkout.js",
        lang: "JavaScript",
        code: `// Async Booking Client Handler
async function submitBooking(tourId, travelerCount, date) {
    const payload = {
        tour_id: tourId,
        travelers: travelerCount,
        booking_date: date
    };

    try {
        const response = await fetch('/api/booking_api.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        if (result.success) {
            showToast(\`Booking \${result.booking_code} Confirmed!\`, 'success');
            return result;
        } else {
            showToast(result.error || 'Booking failed', 'error');
        }
    } catch (err) {
        console.error('API Error:', err);
    }
}`
      }
    ],
    specs: {
      requirements: [
        "Web Server: Apache 2.4+ or Nginx with URL rewriting",
        "Backend Runtime: PHP 8.1+ with pdo_mysql & json extensions",
        "Database Engine: MySQL 8.0+ or MariaDB 10.5+",
        "Frontend: HTML5, Modern CSS3 Flexbox/Grid, Vanilla JS"
      ],
      steps: [
        "1. Clone or download project files to your web root (<code>htdocs</code> in XAMPP).",
        "2. Import the <code>schema.sql</code> file into MySQL using phpMyAdmin or terminal (<code>mysql -u root -p nomadic_db < schema.sql</code>).",
        "3. Configure credentials in <code>config/db.php</code> with your database host, user, and password.",
        "4. Start Apache & MySQL, then navigate to <code>http://localhost/nomadic/</code>."
      ]
    }
  },

  glamvibes: {
    title: "GLAM VIBES — Luxury Fashion E-Commerce",
    badge: "Internship Work · Frontend UI & Cart System",
    summary: "A high-fashion luxury apparel storefront built with responsive product drawers, dynamic vibe-based filtering, responsive Swiper.js carousels, and persistent cart state.",
    demo: {
      intro: "Interact with the live luxury apparel store widget below. Add pieces to your bag, change categories, and watch the dynamic subtotal calculator update.",
      type: "glamvibes"
    },
    codeFiles: [
      {
        name: "cart-manager.js",
        lang: "JavaScript",
        code: `/**
 * GLAM VIBES — Luxury Cart Manager
 * LocalStorage persistent cart with custom reactive event dispatching
 */
class LuxuryCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('glam_cart')) || [];
        this.taxRate = 0.08;
    }

    addItem(product) {
        const existing = this.items.find(i => i.id === product.id);
        if (existing) {
            existing.qty += 1;
        } else {
            this.items.push({ ...product, qty: 1 });
        }
        this.save();
        this.dispatchUpdate('Item added to your luxury bag');
    }

    removeItem(id) {
        this.items = this.items.filter(i => i.id !== id);
        this.save();
        this.dispatchUpdate('Item removed');
    }

    getSubtotal() {
        return this.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    }

    getTotal() {
        const sub = this.getSubtotal();
        return sub + (sub * this.taxRate);
    }

    save() {
        localStorage.setItem('glam_cart', JSON.stringify(this.items));
    }

    dispatchUpdate(message) {
        const event = new CustomEvent('cartUpdated', {
            detail: {
                count: this.items.reduce((sum, i) => sum + i.qty, 0),
                subtotal: this.getSubtotal(),
                total: this.getTotal(),
                message
            }
        });
        window.dispatchEvent(event);
    }
}

const cart = new LuxuryCart();`
      },
      {
        name: "swiper-init.js",
        lang: "JavaScript",
        code: `// Swiper.js 3D Coverflow Configuration for Glam Vibes Collection
const collectionSlider = new Swiper('.swiper-container', {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    coverflowEffect: {
        rotate: 20,
        stretch: 0,
        depth: 250,
        modifier: 1,
        slideShadows: true
    },
    autoplay: {
        delay: 3500,
        disableOnInteraction: false
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true
    }
});`
      }
    ],
    specs: {
      requirements: [
        "Language: Pure HTML5, Semantic Markup",
        "Styling: Modern CSS3 Glassmorphism, CSS Custom Properties",
        "Libraries: Swiper.js (C overflow carousel), Boxicons / FontAwesome",
        "Architecture: Zero compilation step required, 100% static hosting ready"
      ],
      steps: [
        "1. Open <code>index.html</code> directly in any web browser or through VS Code Live Server.",
        "2. For static deployment, simply upload the directory to Netlify, Vercel, or GitHub Pages.",
        "3. Cart data automatically syncs in client browser <code>localStorage</code>."
      ]
    }
  },

  anti_theft: {
    title: "IoT Anti-Theft Smart Security System",
    badge: "Academic Project · Embedded IoT & Sensors",
    summary: "A smart physical security system driven by Arduino Uno and PIR motion sensors with real-time audible alarms, armed/disarmed states, and wireless alert telemetry.",
    demo: {
      intro: "Live interactive Arduino hardware simulator. Click 'Arm System', trigger the virtual motion sensor, and inspect the real-time sensor telemetry logs.",
      type: "anti_theft"
    },
    codeFiles: [
      {
        name: "anti_theft.ino",
        lang: "C++ (Arduino)",
        code: `/*
 * IoT Anti-Theft Smart Security System
 * Microcontroller: Arduino Uno R3 / ESP8266
 * Sensors: HC-SR501 PIR Motion Sensor, Active Piezo Siren, Status LEDs
 */

const int PIR_PIN = 2;       // Motion Sensor Digital Pin
const int BUZZER_PIN = 7;    // Piezo Siren Output
const int RED_LED = 8;       // Alarm Active Indicator
const int GREEN_LED = 9;     // Armed Status Indicator

bool isArmed = false;
bool alarmTriggered = false;

void setup() {
    Serial.begin(9600);
    pinMode(PIR_PIN, INPUT);
    pinMode(BUZZER_PIN, OUTPUT);
    pinMode(RED_LED, OUTPUT);
    pinMode(GREEN_LED, OUTPUT);

    Serial.println(F("[SYSTEM INITIALIZED] Security Module Online."));
    armSystem();
}

void loop() {
    // Check serial commands for remote Arm/Disarm override via Bluetooth/Wi-Fi
    if (Serial.available() > 0) {
        char cmd = Serial.read();
        if (cmd == 'A') armSystem();
        if (cmd == 'D') disarmSystem();
    }

    if (isArmed && !alarmTriggered) {
        int motionState = digitalRead(PIR_PIN);
        if (motionState == HIGH) {
            triggerAlarm();
        }
    }

    if (alarmTriggered) {
        soundSiren();
    }
}

void armSystem() {
    isArmed = true;
    alarmTriggered = false;
    digitalWrite(GREEN_LED, HIGH);
    digitalWrite(RED_LED, LOW);
    noTone(BUZZER_PIN);
    Serial.println(F("[STATUS] System ARMED. Sensors Active."));
}

void disarmSystem() {
    isArmed = false;
    alarmTriggered = false;
    digitalWrite(GREEN_LED, LOW);
    digitalWrite(RED_LED, LOW);
    noTone(BUZZER_PIN);
    Serial.println(F("[STATUS] System DISARMED."));
}

void triggerAlarm() {
    alarmTriggered = true;
    digitalWrite(GREEN_LED, LOW);
    Serial.println(F("[ALERT!] UNAUTHORIZED INTRUSION DETECTED!"));
    Serial.println(F("[TELEMETRY] Dispatching Cloud Webhook Alert..."));
}

void soundSiren() {
    // Dual-tone emergency siren frequency sweep
    for (int freq = 700; freq <= 1200; freq += 25) {
        tone(BUZZER_PIN, freq);
        digitalWrite(RED_LED, HIGH);
        delay(15);
    }
    for (int freq = 1200; freq >= 700; freq -= 25) {
        tone(BUZZER_PIN, freq);
        digitalWrite(RED_LED, LOW);
        delay(15);
    }
}`
      },
      {
        name: "config.h",
        lang: "C++",
        code: `// Hardware Configuration & Thresholds
#ifndef CONFIG_H
#define CONFIG_H

#define PIR_WARMUP_TIME_SEC 15
#define SIREN_TIMEOUT_SEC 120
#define WIFI_SSID "Home_Secure_Net"
#define WIFI_PASS "Security2026Key"

#endif`
      }
    ],
    specs: {
      requirements: [
        "Controller: Arduino Uno R3 (ATmega328P)",
        "Sensors: HC-SR501 PIR Motion Sensor (Infrared)",
        "Actuators: 5V Active Piezo Buzzer (90dB), Dual Status LEDs",
        "Connectivity: ESP8266 ESP-01 Serial Wi-Fi Module / HC-05 Bluetooth",
        "Power Supply: 9V DC Battery / 5V USB Input"
      ],
      steps: [
        "1. Wire PIR VCC to 5V, GND to GND, and OUT to Digital Pin 2.",
        "2. Connect Buzzer positive to Pin 7 through a 220-ohm resistor, negative to GND.",
        "3. Connect Red LED to Pin 8 and Green LED to Pin 9 with current-limiting resistors.",
        "4. Open <code>anti_theft.ino</code> in Arduino IDE, select 'Arduino Uno', and click Upload."
      ]
    }
  },

  fire_robot: {
    title: "IoT Fire-Fighting Autonomous Robot",
    badge: "Academic Project · Robotics & Autonomous Control",
    summary: "Autonomous emergency response robot engineered with flame sensor arrays, DC gear motor drives, water pump servo articulation, and Bluetooth manual override.",
    demo: {
      intro: "Interactive Telemetry & Control Panel. Trigger the simulated flame sensor to test autonomous targeting and water pump activation, or use the Bluetooth directional pad.",
      type: "fire_robot"
    },
    codeFiles: [
      {
        name: "fire_robot.ino",
        lang: "C++ (Arduino)",
        code: `/*
 * IoT Fire-Fighting Autonomous Robot
 * Autonomous flame tracking, Servo-aimed water pump & Bluetooth override
 */
#include <Servo.h>

// Flame Sensor Analog Inputs (Left, Center, Right)
const int SENSOR_LEFT = A0;
const int SENSOR_CENTER = A1;
const int SENSOR_RIGHT = A2;
const int FLAME_THRESHOLD = 500; // Analog flame detection threshold

// Motor Driver L298N Pins
const int IN1 = 5;
const int IN2 = 6;
const int IN3 = 9;
const int IN4 = 10;

// Water Pump Relay & Servo
const int PUMP_PIN = 11;
const int SERVO_PIN = 3;

Servo sprayServo;

void setup() {
    Serial.begin(9600);
    sprayServo.attach(SERVO_PIN);
    sprayServo.write(90); // Center nozzle position

    pinMode(IN1, OUTPUT);
    pinMode(IN2, OUTPUT);
    pinMode(IN3, OUTPUT);
    pinMode(IN4, OUTPUT);
    pinMode(PUMP_PIN, OUTPUT);
    digitalWrite(PUMP_PIN, HIGH); // Relay active LOW off

    Serial.println(F("[ROBOT READY] Flame Search System Initialized."));
}

void loop() {
    // 1. Bluetooth Remote Override
    if (Serial.available() > 0) {
        char cmd = Serial.read();
        executeManualCommand(cmd);
        return;
    }

    // 2. Autonomous Flame Seeking
    int leftVal = analogRead(SENSOR_LEFT);
    int centerVal = analogRead(SENSOR_CENTER);
    int rightVal = analogRead(SENSOR_RIGHT);

    if (centerVal < FLAME_THRESHOLD) {
        stopMotors();
        extinguishFire(90);
    } else if (leftVal < FLAME_THRESHOLD) {
        turnLeft();
    } else if (rightVal < FLAME_THRESHOLD) {
        turnRight();
    } else {
        stopMotors();
    }
}

void extinguishFire(int angle) {
    Serial.println(F("[ACTION] Target Locked! Activating Water Pump."));
    sprayServo.write(angle);
    digitalWrite(PUMP_PIN, LOW); // Turn on pump

    // Sweep nozzle across target area
    for (int a = angle - 25; a <= angle + 25; a += 5) {
        sprayServo.write(a);
        delay(60);
    }
    digitalWrite(PUMP_PIN, HIGH); // Turn off pump
    Serial.println(F("[STATUS] Fire Suppressed."));
}

void stopMotors() {
    digitalWrite(IN1, LOW); digitalWrite(IN2, LOW);
    digitalWrite(IN3, LOW); digitalWrite(IN4, LOW);
}

void turnLeft() {
    digitalWrite(IN1, LOW); digitalWrite(IN2, HIGH);
    digitalWrite(IN3, HIGH); digitalWrite(IN4, LOW);
}

void turnRight() {
    digitalWrite(IN1, HIGH); digitalWrite(IN2, LOW);
    digitalWrite(IN3, LOW); digitalWrite(IN4, HIGH);
}

void executeManualCommand(char cmd) {
    switch (cmd) {
        case 'F': /* Forward */ break;
        case 'B': /* Backward */ break;
        case 'L': turnLeft(); break;
        case 'R': turnRight(); break;
        case 'P': extinguishFire(90); break;
        default: stopMotors(); break;
    }
}`
      }
    ],
    specs: {
      requirements: [
        "Chassis: 2WD Robot Platform with Rubber Wheels & Castor",
        "Controller: Arduino Uno R3 Microcontroller",
        "Sensors: 3x Infrared Flame Detectors (760nm - 1100nm spectrum)",
        "Motors & Drive: 2x 12V 300RPM DC Gear Motors + L298N Dual H-Bridge Driver",
        "Suppression: 5V Submersible Water Pump + Micro Nozzle + SG90 Servo",
        "Control Interface: HC-05 Bluetooth Module (SPP Protocol at 9600 Baud)"
      ],
      steps: [
        "1. Mount 3 flame sensors angled at -45°, 0°, and +45° on the front bumper.",
        "2. Wire the L298N inputs to Arduino PWM Pins 5, 6, 9, 10.",
        "3. Mount the water pump nozzle onto the SG90 servo motor shaft.",
        "4. Pair with the mobile Bluetooth Controller app and calibrate flame threshold."
      ]
    }
  },

  figma1: {
    title: "UI Design Prototype — Vol. 1 (Nomadic Travel)",
    badge: "Figma UI/UX · Wireframing & Design Systems",
    summary: "Complete high-fidelity design system and interactive prototype for a modern travel booking platform, engineered with reusable components, responsive auto-layout, and accessibility tokens.",
    demo: {
      intro: "UX flow architecture and key design tokens utilized in the prototype:",
      type: "figma"
    },
    codeFiles: [
      {
        name: "design_tokens.json",
        lang: "JSON",
        code: `{
  "color": {
    "primary": { "value": "#E8C547" },
    "background": { "value": "#080808" },
    "surface": { "value": "#111111" },
    "text": { "value": "#F0EBE1" },
    "muted": { "value": "#888888" }
  },
  "typography": {
    "display": { "fontFamily": "Syne", "fontWeight": "800" },
    "editorial": { "fontFamily": "DM Serif Display", "fontStyle": "italic" },
    "body": { "fontFamily": "Outfit", "fontWeight": "400" }
  },
  "spacing": {
    "base": "8px",
    "md": "16px",
    "lg": "24px",
    "xl": "32px"
  }
}`
      }
    ],
    specs: {
      requirements: [
        "Design Tool: Figma Desktop",
        "Techniques: Auto-Layout 4.0, Component Variants, Interactive Components",
        "Accessibility: WCAG 2.1 AA Contrast Ratios (Gold on Dark)",
        "Typography: Google Fonts (Syne, DM Serif Display, Outfit)"
      ],
      steps: [
        "1. Open Figma and navigate to the Nomadic UI Design workspace.",
        "2. Test the interactive prototype by clicking the Play icon (Present Mode).",
        "3. Inspect component variants and design tokens in the Dev Mode tab."
      ]
    }
  },

  figma2: {
    title: "UI Design Prototype — Vol. 2 (IoT Fleet Dashboard)",
    badge: "Figma UI/UX · Dark Mode System & Dashboard",
    summary: "Dark-themed telemetry dashboard designed for monitoring fleets of IoT robots and security devices with live status indicators, battery telemetry, and sensor maps.",
    demo: {
      intro: "Interactive telemetry layout designed for hardware operators:",
      type: "figma"
    },
    codeFiles: [
      {
        name: "dashboard-tokens.json",
        lang: "JSON",
        code: `{
  "theme": "dark-luxury",
  "widget": {
    "radius": "16px",
    "background": "rgba(17, 17, 17, 0.85)",
    "border": "1px solid rgba(232, 197, 71, 0.25)",
    "backdropBlur": "12px"
  },
  "statusColors": {
    "online": "#22c55e",
    "alert": "#ef4444",
    "standby": "#E8C547"
  }
}`
      }
    ],
    specs: {
      requirements: [
        "Design System: Dark Glassmorphic UI System",
        "Grid: 12-Column Responsive Dashboard Layout",
        "Telemetry Widgets: Battery gauges, Real-time status pills, Sensor charts"
      ],
      steps: [
        "1. Open Figma workspace for IoT Fleet Console.",
        "2. Toggle prototype interactions on the robot telemetry card to simulate sensor alerts."
      ]
    }
  }
};

let currentActiveProject = null;
let currentActiveTab = 'demo';
let currentActiveFileIndex = 0;

function openProjectModal(projectId, defaultTab = 'demo') {
  const project = projectsData[projectId];
  if (!project) return;

  currentActiveProject = project;
  currentActiveTab = defaultTab;
  currentActiveFileIndex = 0;

  // Set Header
  const modalBadge = document.getElementById('modalBadge');
  const modalTitle = document.getElementById('modalTitle');
  if (modalBadge) modalBadge.textContent = project.badge;
  if (modalTitle) modalTitle.textContent = project.title;

  // Set Active Tab Button
  switchModalTab(defaultTab);

  // Show Modal Backdrop
  const backdrop = document.getElementById('projectModalBackdrop');
  if (backdrop) {
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeProjectModal(e) {
  if (e && e.target && e.target.id !== 'projectModalBackdrop' && !e.target.classList.contains('modal-close-btn')) {
    return;
  }
  const backdrop = document.getElementById('projectModalBackdrop');
  if (backdrop) {
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// ESC Key listener to close modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeProjectModal();
  }
});

function switchModalTab(tabName) {
  currentActiveTab = tabName;

  // Update tab buttons
  const tabs = ['demo', 'code', 'specs'];
  tabs.forEach(t => {
    const btn = document.getElementById('tabBtn' + t.charAt(0).toUpperCase() + t.slice(1));
    if (btn) btn.classList.toggle('active', t === tabName);
  });

  renderModalContent();
}

function renderModalContent() {
  const container = document.getElementById('modalBody');
  if (!container || !currentActiveProject) return;

  if (currentActiveTab === 'demo') {
    renderDemoTab(container);
  } else if (currentActiveTab === 'code') {
    renderCodeTab(container);
  } else if (currentActiveTab === 'specs') {
    renderSpecsTab(container);
  }
}

function renderDemoTab(container) {
  const p = currentActiveProject;
  let interactiveHtml = '';

  if (p.demo.type === 'nomadic') {
    interactiveHtml = `
      <div class="simulator-card">
        <div class="sim-header">
          <div class="sim-title">⚡ Interactive Tour Booking Simulator</div>
          <span class="sim-badge active">API Engine Active</span>
        </div>
        <div class="sim-grid">
          <div class="sim-field">
            <label>Destination Tour</label>
            <select id="simTourSelect" onchange="updateNomadicSimPrice()">
              <option value="1" data-price="450">Bali Coastal Exploration ($450)</option>
              <option value="2" data-price="890">Swiss Alps Alpine Trek ($890)</option>
              <option value="3" data-price="620">Tokyo Culture & Culinary ($620)</option>
              <option value="4" data-price="540">Paris Romantic Highlights ($540)</option>
            </select>
          </div>
          <div class="sim-field">
            <label>Number of Travelers</label>
            <input type="number" id="simTravelers" value="2" min="1" max="10" onchange="updateNomadicSimPrice()" oninput="updateNomadicSimPrice()">
          </div>
          <div class="sim-field">
            <label>Calculated Total Price</label>
            <div id="simTotalPrice" style="font-size:1.4rem; font-weight:800; color:var(--gold); padding-top:0.4rem;">$900 USD</div>
          </div>
        </div>
        <div class="sim-btn-group">
          <button type="button" class="sim-btn" onclick="executeNomadicBooking()">Confirm Booking</button>
          <button type="button" class="sim-btn secondary" onclick="resetNomadicConsole()">Clear Output</button>
        </div>
        <div class="sim-console" id="nomadicConsole">
          <p class="log-info">[READY] Booking Engine API mounted at endpoint /api/booking_api.php</p>
          <p class="log-info">[SESSION] Authenticated as Om Patel (Session #NOM-982)</p>
        </div>
      </div>
    `;
  } else if (p.demo.type === 'glamvibes') {
    interactiveHtml = `
      <div class="simulator-card">
        <div class="sim-header">
          <div class="sim-title">🛍️ Interactive Fashion Cart & Drawer Simulator</div>
          <span class="sim-badge active">Cart State: Ready</span>
        </div>
        <div class="sim-grid">
          <div class="sim-field" style="background:#0f1015; padding:1rem; border-radius:10px; border:1px solid var(--border);">
            <div style="font-weight:700; color:var(--text); margin-bottom:4px;">Silk Structured Blazer</div>
            <div style="color:var(--gold); font-size:1.1rem; font-weight:800; margin-bottom:8px;">$240 USD</div>
            <button type="button" class="sim-btn" style="padding:0.4rem 1rem; font-size:0.72rem;" onclick="addGlamItem('Silk Structured Blazer', 240)">+ Add to Bag</button>
          </div>
          <div class="sim-field" style="background:#0f1015; padding:1rem; border-radius:10px; border:1px solid var(--border);">
            <div style="font-weight:700; color:var(--text); margin-bottom:4px;">Cashmere Trench Coat</div>
            <div style="color:var(--gold); font-size:1.1rem; font-weight:800; margin-bottom:8px;">$380 USD</div>
            <button type="button" class="sim-btn" style="padding:0.4rem 1rem; font-size:0.72rem;" onclick="addGlamItem('Cashmere Trench Coat', 380)">+ Add to Bag</button>
          </div>
          <div class="sim-field" style="background:#0f1015; padding:1rem; border-radius:10px; border:1px solid var(--border);">
            <div style="font-weight:700; color:var(--text); margin-bottom:4px;">Gold Accent Handbag</div>
            <div style="color:var(--gold); font-size:1.1rem; font-weight:800; margin-bottom:8px;">$190 USD</div>
            <button type="button" class="sim-btn" style="padding:0.4rem 1rem; font-size:0.72rem;" onclick="addGlamItem('Gold Accent Handbag', 190)">+ Add to Bag</button>
          </div>
        </div>
        <div class="sim-console" id="glamConsole">
          <p class="log-info">[BAG STATUS] 0 items | Subtotal: $0.00</p>
        </div>
      </div>
    `;
  } else if (p.demo.type === 'anti_theft') {
    interactiveHtml = `
      <div class="simulator-card">
        <div class="sim-header">
          <div class="sim-title">🚨 IoT Hardware Security System Simulator</div>
          <span class="sim-badge" id="antiTheftBadge" style="background:rgba(34,197,94,0.15); color:#22c55e; border:1px solid rgba(34,197,94,0.3);">SYSTEM DISARMED</span>
        </div>
        <div class="sim-btn-group" style="margin-bottom:1.2rem;">
          <button type="button" class="sim-btn" onclick="toggleAntiTheftArm()">Arm / Disarm System</button>
          <button type="button" class="sim-btn secondary" onclick="triggerAntiTheftMotion()">Trigger Motion Sensor</button>
          <button type="button" class="sim-btn secondary" onclick="resetAntiTheftAlarm()">Silence Alarm</button>
        </div>
        <div class="sim-console" id="antiTheftConsole">
          <p class="log-info">[SERIAL MONITOR] 9600 Baud connected to COM3 (Arduino Uno)</p>
          <p class="log-info">[PIR SENSOR] Calibration completed. Awaiting arming command.</p>
        </div>
      </div>
    `;
  } else if (p.demo.type === 'fire_robot') {
    interactiveHtml = `
      <div class="simulator-card">
        <div class="sim-header">
          <div class="sim-title">🤖 Robot Telemetry & Water Pump Controller</div>
          <span class="sim-badge active" id="robotBadge">STANDBY · SCANNING</span>
        </div>
        <div class="sim-grid">
          <div class="sim-field" style="background:#0f1015; padding:0.8rem 1rem; border-radius:8px; border:1px solid var(--border);">
            <label>Left IR Flame Sensor</label>
            <div id="gaugeLeft" style="font-weight:700; color:#22c55e;">CLEAR (0%)</div>
          </div>
          <div class="sim-field" style="background:#0f1015; padding:0.8rem 1rem; border-radius:8px; border:1px solid var(--border);">
            <label>Center Flame Sensor</label>
            <div id="gaugeCenter" style="font-weight:700; color:#22c55e;">CLEAR (0%)</div>
          </div>
          <div class="sim-field" style="background:#0f1015; padding:0.8rem 1rem; border-radius:8px; border:1px solid var(--border);">
            <label>Right IR Flame Sensor</label>
            <div id="gaugeRight" style="font-weight:700; color:#22c55e;">CLEAR (0%)</div>
          </div>
        </div>
        <div class="sim-btn-group">
          <button type="button" class="sim-btn" onclick="simulateRobotFire()">Simulate Fire Detection</button>
          <button type="button" class="sim-btn secondary" onclick="sendRobotCommand('F')">Manual: Move Forward</button>
          <button type="button" class="sim-btn secondary" onclick="sendRobotCommand('P')">Manual: Water Spray</button>
          <button type="button" class="sim-btn secondary" onclick="resetRobotSim()">Reset Sensors</button>
        </div>
        <div class="sim-console" id="robotConsole">
          <p class="log-info">[BLUETOOTH] HC-05 connected to mobile app (UUID 00001101-0000-1000-8000-00805F9B34FB)</p>
          <p class="log-info">[STATUS] Motor speed set to 200 PWM. Servo nozzle centered at 90°.</p>
        </div>
      </div>
    `;
  } else {
    interactiveHtml = `
      <div class="simulator-card">
        <div class="sim-header">
          <div class="sim-title">🎨 Figma Prototype Architecture</div>
          <span class="sim-badge active">Figma 100% Component System</span>
        </div>
        <p style="color:#ccc; margin-bottom:1rem;">This project utilizes a structured design system built on an 8-point spatial grid with auto-layout variants, dark-mode color tokens, and WCAG AA contrast compliance.</p>
        <div class="sim-console">
          <p class="log-info">[FIGMA DEV MODE] Tokens exported to design_tokens.json</p>
          <p class="log-success">[COMPLIANCE] Gold (#E8C547) on Deep Black (#080808) achieves 13.8:1 AAA contrast ratio.</p>
        </div>
      </div>
    `;
  }

  container.innerHTML = `
    <div>
      <p style="font-size:1.05rem; line-height:1.8; color:#ddd; margin-bottom:1.5rem;">${p.summary}</p>
      ${interactiveHtml}
    </div>
  `;
}

function renderCodeTab(container) {
  const p = currentActiveProject;
  if (!p.codeFiles || p.codeFiles.length === 0) {
    container.innerHTML = '<p>No code files attached.</p>';
    return;
  }

  const currentFile = p.codeFiles[currentActiveFileIndex] || p.codeFiles[0];

  const fileButtons = p.codeFiles.map((file, idx) => `
    <button type="button" class="code-file-btn ${idx === currentActiveFileIndex ? 'active' : ''}" onclick="selectCodeFile(${idx})">
      ${escapeHtml(file.name)}
    </button>
  `).join('');

  container.innerHTML = `
    <div class="code-viewer-container">
      <div class="code-header-bar">
        <div class="code-file-tabs">
          ${fileButtons}
        </div>
        <button type="button" class="code-copy-btn" id="copyCodeBtn" onclick="copyCurrentProjectCode()">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          Copy Code
        </button>
      </div>
      <div class="code-editor-box">
        <pre><code>${escapeHtml(currentFile.code)}</code></pre>
      </div>
    </div>
  `;
}

function renderSpecsTab(container) {
  const p = currentActiveProject;
  if (!p.specs) {
    container.innerHTML = '<p>Architecture details not available.</p>';
    return;
  }

  const reqItems = p.specs.requirements.map(r => `<li>${r}</li>`).join('');
  const stepItems = p.specs.steps.map(s => `<li>${s}</li>`).join('');

  container.innerHTML = `
    <div>
      <h4 style="font-family:'Syne', sans-serif; color:var(--gold); font-size:1.15rem; margin-bottom:0.8rem;">System Requirements & Tech Stack</h4>
      <ul class="specs-steps" style="margin-bottom:2rem;">
        ${reqItems}
      </ul>

      <h4 style="font-family:'Syne', sans-serif; color:var(--gold); font-size:1.15rem; margin-bottom:0.8rem;">Step-by-Step Build & Run Guide</h4>
      <ul class="specs-steps">
        ${stepItems}
      </ul>
    </div>
  `;
}

function selectCodeFile(idx) {
  currentActiveFileIndex = idx;
  renderModalContent();
}

function copyCurrentProjectCode() {
  if (!currentActiveProject || !currentActiveProject.codeFiles) return;
  const currentFile = currentActiveProject.codeFiles[currentActiveFileIndex] || currentActiveProject.codeFiles[0];
  if (!currentFile) return;

  navigator.clipboard.writeText(currentFile.code).then(() => {
    const btn = document.getElementById('copyCodeBtn');
    if (btn) {
      btn.innerHTML = '✓ Copied!';
      btn.style.color = '#22c55e';
      setTimeout(() => {
        btn.innerHTML = `
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          Copy Code
        `;
        btn.style.color = 'var(--text)';
      }, 2000);
    }
  });
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
}

// ── SIMULATOR EVENT HANDLERS ──
function updateNomadicSimPrice() {
  const select = document.getElementById('simTourSelect');
  const travelersInput = document.getElementById('simTravelers');
  const priceDisplay = document.getElementById('simTotalPrice');
  if (!select || !travelersInput || !priceDisplay) return;

  const price = parseInt(select.options[select.selectedIndex].getAttribute('data-price')) || 450;
  const count = Math.max(1, parseInt(travelersInput.value) || 1);
  priceDisplay.textContent = '$' + (price * count) + ' USD';
}

function executeNomadicBooking() {
  const select = document.getElementById('simTourSelect');
  const travelers = document.getElementById('simTravelers');
  const consoleEl = document.getElementById('nomadicConsole');
  if (!select || !travelers || !consoleEl) return;

  const tourName = select.options[select.selectedIndex].text.split(' (')[0];
  const count = travelers.value;
  const code = 'NOM-' + Math.floor(100000 + Math.random() * 900000);
  const now = new Date().toLocaleTimeString();

  consoleEl.innerHTML += `
    <p class="log-success">[TRANSACTION ${now}] POST /api/booking_api.php HTTP/1.1 200 OK</p>
    <p class="log-success">✓ Booking Confirmed! Code: ${code} | Tour: ${tourName} | Party: ${count} Travelers</p>
  `;
  consoleEl.scrollTop = consoleEl.scrollHeight;
}

function resetNomadicConsole() {
  const consoleEl = document.getElementById('nomadicConsole');
  if (consoleEl) {
    consoleEl.innerHTML = '<p class="log-info">[READY] Booking Engine API mounted at endpoint /api/booking_api.php</p>';
  }
}

// Glam Vibes Cart Sim
let glamCartItems = [];
function addGlamItem(name, price) {
  glamCartItems.push({ name, price });
  const consoleEl = document.getElementById('glamConsole');
  if (!consoleEl) return;

  const subtotal = glamCartItems.reduce((sum, item) => sum + item.price, 0);
  consoleEl.innerHTML += `
    <p class="log-success">✓ Added "${name}" ($${price}) to bag.</p>
    <p class="log-info">[BAG TOTAL] ${glamCartItems.length} items | Subtotal: $${subtotal}.00 USD (Tax: $${(subtotal * 0.08).toFixed(2)})</p>
  `;
  consoleEl.scrollTop = consoleEl.scrollHeight;
}

// Anti-Theft Simulator
let isAntiTheftArmed = false;
function toggleAntiTheftArm() {
  isAntiTheftArmed = !isAntiTheftArmed;
  const badge = document.getElementById('antiTheftBadge');
  const consoleEl = document.getElementById('antiTheftConsole');
  if (!badge || !consoleEl) return;

  if (isAntiTheftArmed) {
    badge.textContent = 'SYSTEM ARMED';
    badge.style.background = 'rgba(232,197,71,0.15)';
    badge.style.color = 'var(--gold)';
    badge.style.border = '1px solid rgba(232,197,71,0.3)';
    badge.classList.remove('alert');
    consoleEl.innerHTML += '<p class="log-info">[COMMAND] Serial.write("A") -> System ARMED. HC-SR501 Sensor Active.</p>';
  } else {
    badge.textContent = 'SYSTEM DISARMED';
    badge.style.background = 'rgba(34,197,94,0.15)';
    badge.style.color = '#22c55e';
    badge.style.border = '1px solid rgba(34,197,94,0.3)';
    badge.classList.remove('alert');
    consoleEl.innerHTML += '<p class="log-info">[COMMAND] Serial.write("D") -> System DISARMED. Buzzer Silenced.</p>';
  }
  consoleEl.scrollTop = consoleEl.scrollHeight;
}

function triggerAntiTheftMotion() {
  const badge = document.getElementById('antiTheftBadge');
  const consoleEl = document.getElementById('antiTheftConsole');
  if (!badge || !consoleEl) return;

  if (!isAntiTheftArmed) {
    consoleEl.innerHTML += '<p class="log-info">[PIR SENSOR] Motion detected, but system is DISARMED (ignoring).</p>';
  } else {
    badge.textContent = '🚨 INTRUSION ALERT!';
    badge.style.background = 'rgba(239,68,68,0.2)';
    badge.style.color = '#ef4444';
    badge.style.border = '1px solid rgba(239,68,68,0.4)';
    badge.classList.add('alert');
    consoleEl.innerHTML += `
      <p class="log-alert">⚠️ [ALERT!] digitalRead(PIR_PIN) == HIGH! Intrusion detected at Pin 2.</p>
      <p class="log-alert">📢 [SIREN] Tone PWM 1200Hz activated on Buzzer Pin 7.</p>
      <p class="log-success">🌐 [TELEMETRY] Webhook dispatched to Telegram/Cloud: "Intrusion detected at Sector A"!</p>
    `;
  }
  consoleEl.scrollTop = consoleEl.scrollHeight;
}

function resetAntiTheftAlarm() {
  const badge = document.getElementById('antiTheftBadge');
  const consoleEl = document.getElementById('antiTheftConsole');
  if (!badge || !consoleEl) return;

  if (isAntiTheftArmed) {
    badge.textContent = 'SYSTEM ARMED';
    badge.style.background = 'rgba(232,197,71,0.15)';
    badge.style.color = 'var(--gold)';
    badge.classList.remove('alert');
  }
  consoleEl.innerHTML += '<p class="log-info">[RESET] Siren silenced. Sensor reset to monitoring mode.</p>';
  consoleEl.scrollTop = consoleEl.scrollHeight;
}

// Fire Robot Simulator
function simulateRobotFire() {
  const badge = document.getElementById('robotBadge');
  const gaugeC = document.getElementById('gaugeCenter');
  const consoleEl = document.getElementById('robotConsole');
  if (!badge || !gaugeC || !consoleEl) return;

  gaugeC.textContent = '🔥 FLAME (88%)';
  gaugeC.style.color = '#ef4444';
  badge.textContent = 'EXTINGUISHING FIRE';
  badge.classList.add('alert');

  consoleEl.innerHTML += `
    <p class="log-alert">🔥 [ANALOG READ] Sensor Center A1 = 210 (< 500 threshold). TARGET DETECTED!</p>
    <p class="log-info">🎯 [NAVIGATION] Alignment locked. Motors STOPPED.</p>
    <p class="log-success">💦 [ACTUATOR] digitalWrite(PUMP_PIN, LOW) -> Submersible Water Pump ACTIVATED!</p>
    <p class="log-info">🔄 [SERVO] SG90 Nozzle sweeping 65° to 115° across flame center...</p>
  `;
  consoleEl.scrollTop = consoleEl.scrollHeight;

  setTimeout(() => {
    gaugeC.textContent = 'CLEAR (0%)';
    gaugeC.style.color = '#22c55e';
    badge.textContent = 'STANDBY · FIRE EXTINGUISHED';
    badge.classList.remove('alert');
    consoleEl.innerHTML += '<p class="log-success">✓ [COMPLETE] Flame eliminated. Pump deactivated. Resume patrol.</p>';
    consoleEl.scrollTop = consoleEl.scrollHeight;
  }, 3000);
}

function sendRobotCommand(cmd) {
  const consoleEl = document.getElementById('robotConsole');
  if (!consoleEl) return;
  const labels = {
    'F': 'Forward (Motors IN1/IN3 HIGH)',
    'P': 'Manual Water Pump Trigger',
    'L': 'Turn Left',
    'R': 'Turn Right'
  };
  consoleEl.innerHTML += `<p class="log-info">[MANUAL BT] Command '${cmd}' -> ${labels[cmd] || 'Command received'}</p>`;
  consoleEl.scrollTop = consoleEl.scrollHeight;
}

function resetRobotSim() {
  const badge = document.getElementById('robotBadge');
  const gaugeL = document.getElementById('gaugeLeft');
  const gaugeC = document.getElementById('gaugeCenter');
  const gaugeR = document.getElementById('gaugeRight');
  const consoleEl = document.getElementById('robotConsole');
  if (badge) {
    badge.textContent = 'STANDBY · SCANNING';
    badge.classList.remove('alert');
  }
  if (gaugeL) { gaugeL.textContent = 'CLEAR (0%)'; gaugeL.style.color = '#22c55e'; }
  if (gaugeC) { gaugeC.textContent = 'CLEAR (0%)'; gaugeC.style.color = '#22c55e'; }
  if (gaugeR) { gaugeR.textContent = 'CLEAR (0%)'; gaugeR.style.color = '#22c55e'; }
  if (consoleEl) {
    consoleEl.innerHTML = '<p class="log-info">[RESET] All flame sensors normalized. Awaiting telemetry.</p>';
  }
}

