/**
 * GoldenHour — Core App Logic & Emergency State Management
 * Includes: Geolocation, 112 Direct Dialer, Contact Link Generator,
 * Multilingual UI Renderer, & Web Speech Synthesis (TTS) Engine.
 */

// Application State
const state = {
  currentLang: 'en', // 'en', 'hi', 'kn'
  userLocation: {
    lat: 12.9716, // Default Bengaluru coordinates
    lng: 77.5946,
    accuracy: null,
    address: 'Bengaluru, Karnataka, India',
    isSharing: true,
    permission: 'pending'
  },
  contacts: [
    { name: 'Family Member', phone: '+919876543210' },
    { name: 'Emergency Doctor', phone: '+919812345678' }
  ],
  sosActive: false,
  map: null,
  marker: null,
  currentGuide: 'cpr',
  speechSynth: window.speechSynthesis || null,
  speechUtterance: null,
  isSpeaking: false,
  startTime: Date.now()
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  setupNavigation();
  setupLanguageSelector();
  setupEmergencyCallBtn();
  setupSosTrigger();
  setupLocationSharing();
  setupLocationControls();
  setupContacts();
  renderCurrentLanguage();
  initLeafletMap();
  requestLocation();
  
  if (window.metricsEngine) {
    window.metricsEngine.recordAppOpen();
  }
}

// Language Switching
function setupLanguageSelector() {
  const langSelect = document.getElementById('langSelect');
  if (langSelect) {
    langSelect.addEventListener('change', (e) => {
      state.currentLang = e.target.value;
      renderCurrentLanguage();
      stopSpeech();
    });
  }
}

function renderCurrentLanguage() {
  const lang = state.currentLang;
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  // Update text for elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = t[key];
      } else {
        el.textContent = t[key];
      }
    }
  });

  // Render First Aid Guides for current language
  renderFirstAidGuides(t);
}

// Navigation Tabs
function setupNavigation() {
  const navBtns = document.querySelectorAll('.nav-item');
  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      showTab(tabId);
    });
  });
}

function showTab(tabId) {
  document.querySelectorAll('.nav-item').forEach(b => {
    if (b.getAttribute('data-tab') === tabId) {
      b.classList.add('active');
    } else {
      b.classList.remove('active');
    }
  });

  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  const activeContent = document.getElementById(tabId);
  if (activeContent) {
    activeContent.classList.add('active');
  }

  if (tabId === 'tab-sos' && state.map) {
    setTimeout(() => { state.map.invalidateSize(); }, 200);
  }

  if (tabId === 'tab-volunteers' && window.volunteersEngine) {
    window.volunteersEngine.initRadar();
  }
  if (tabId === 'tab-hospital' && window.hospitalEngine) {
    window.hospitalEngine.renderHospitalDashboard();
  }
  if (tabId === 'tab-metrics' && window.metricsEngine) {
    window.metricsEngine.updateMetricsDisplay();
  }
}

// Priority 112 Calling
function setupEmergencyCallBtn() {
  const callBtn = document.getElementById('call112Btn');
  if (callBtn) {
    callBtn.addEventListener('click', () => {
      if (window.metricsEngine) {
        window.metricsEngine.recordAction('Called 112 Emergency');
      }
      window.location.href = 'tel:112';
    });
  }
}

// SOS Trigger & Alert Payload
function setupSosTrigger() {
  const sosBtn = document.getElementById('triggerSosBtn');
  if (sosBtn) {
    sosBtn.addEventListener('click', () => {
      state.sosActive = !state.sosActive;
      const statusEl = document.getElementById('sosStatusCard');
      
      if (state.sosActive) {
        sosBtn.classList.add('sos-active');
        sosBtn.textContent = '🚨 SOS ACTIVE — BROADCASTING ALERT';
        if (statusEl) statusEl.style.display = 'block';

        if (window.metricsEngine) {
          window.metricsEngine.recordAction('Triggered SOS Alert');
        }

        if (window.volunteersEngine) {
          window.volunteersEngine.triggerBroadcastAlert();
        }
        if (window.hospitalEngine) {
          window.hospitalEngine.dispatchPreAlert({
            location: state.userLocation,
            type: 'Emergency SOS Broadcast',
            timestamp: new Date().toLocaleTimeString()
          });
        }
      } else {
        sosBtn.classList.remove('sos-active');
        sosBtn.textContent = '🚨 TRIGGER SOS & SHARE LOCATION';
        if (statusEl) statusEl.style.display = 'none';
      }
    });
  }
}

// Geolocation Engine & Robust Fallback with OpenStreetMap Styling
function requestLocation(isManualTrigger = false) {
  const locStatusEl = document.getElementById('locationStatusText');
  const addressEl = document.getElementById('locationAddressText');
  const tipEl = document.getElementById('locationPermissionTip');
  const detectBtn = document.getElementById('detectGpsBtn');

  if (locStatusEl) locStatusEl.textContent = '📡 Detecting live GPS coordinates...';
  if (detectBtn) detectBtn.textContent = '⏳ Detecting...';

  if (!navigator.geolocation) {
    state.userLocation.permission = 'unsupported';
    state.userLocation.address = 'Bengaluru, Karnataka, India (Default Fallback)';
    if (locStatusEl) locStatusEl.textContent = 'Geolocation not supported by device. Default coordinates active.';
    if (addressEl) addressEl.textContent = '📍 Bengaluru, Karnataka, India (Default Fallback)';
    if (detectBtn) detectBtn.textContent = '🎯 Detect GPS';
    updateMapMarker(12.9716, 77.5946, '<b>Your Emergency Location</b><br>Default Coordinates (GPS Unsupported)');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      if (detectBtn) detectBtn.textContent = '🎯 Detect GPS';
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      state.userLocation.lat = lat;
      state.userLocation.lng = lng;
      state.userLocation.accuracy = Math.round(position.coords.accuracy);
      state.userLocation.permission = 'granted';

      if (locStatusEl) {
        locStatusEl.textContent = `🟢 Live GPS Active: ${lat.toFixed(4)}, ${lng.toFixed(4)} (±${state.userLocation.accuracy}m)`;
      }
      if (tipEl) tipEl.style.display = 'none';

      updateMapMarker(lat, lng, '<b>📍 Live Emergency Location</b><br>GPS Coordinates Active<br/><small style="color:#aaa;">Drag pin to fine-tune</small>');
      fetchAddressFromCoordinates(lat, lng);
      if (state.map) {
        state.map.setView([lat, lng], 15);
      }
    },
    (error) => {
      if (detectBtn) detectBtn.textContent = '🎯 Detect GPS';
      console.warn('Geolocation denied or unavailable. Using default coordinates:', error.message);
      state.userLocation.permission = 'denied';

      const lat = state.userLocation.lat || 12.9716;
      const lng = state.userLocation.lng || 77.5946;

      if (locStatusEl) {
        locStatusEl.textContent = '🟡 Location permission denied. Default coordinates active (112 dialer fully unblocked).';
      }
      if (tipEl) {
        tipEl.style.display = 'block';
      }

      updateMapMarker(lat, lng, '<b>Your Emergency Location</b><br>Default Coordinates<br/><small style="color:#aaa;">Tap map or drag pin to your spot</small>');
      if (!state.userLocation.address || state.userLocation.address.includes('Determining')) {
        state.userLocation.address = 'Bengaluru, Karnataka, India (Default Fallback)';
        if (addressEl) addressEl.textContent = '📍 Bengaluru, Karnataka, India (Default Fallback)';
      }
    },
    { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
  );
}

function setEmergencyLocation(lat, lng, source = 'manual') {
  state.userLocation.lat = lat;
  state.userLocation.lng = lng;

  const locStatusEl = document.getElementById('locationStatusText');
  const tipEl = document.getElementById('locationPermissionTip');

  if (source === 'gps') {
    state.userLocation.permission = 'granted';
    if (locStatusEl) locStatusEl.textContent = `🟢 Live GPS Active: ${lat.toFixed(4)}, ${lng.toFixed(4)} (±${state.userLocation.accuracy || 15}m)`;
    if (tipEl) tipEl.style.display = 'none';
  } else if (source === 'search') {
    if (locStatusEl) locStatusEl.textContent = `📍 Searched Location Set: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  } else {
    if (locStatusEl) locStatusEl.textContent = `📍 Manually Pinned Location: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }

  updateMapMarker(lat, lng, `<b>📍 Emergency Location</b><br/>${source === 'gps' ? 'Live GPS Detected' : 'Pinned Location'}<br/><small style="color:#aaa;">Drag pin or tap map to change</small>`);
  fetchAddressFromCoordinates(lat, lng);
}

function fetchAddressFromCoordinates(lat, lng) {
  const addressEl = document.getElementById('locationAddressText');
  
  fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
    .then(res => {
      if (!res.ok) throw new Error('Reverse geocode failed');
      return res.json();
    })
    .then(data => {
      if (data && data.display_name) {
        state.userLocation.address = data.display_name;
        if (addressEl) addressEl.textContent = `📍 ${data.display_name}`;
        if (state.marker) {
          state.marker.bindPopup(`<b>📍 Emergency Location</b><br>${data.display_name.slice(0, 60)}...<br/><small style="color:#aaa;">Drag pin to adjust</small>`);
        }
      } else {
        state.userLocation.address = `GPS Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        if (addressEl) addressEl.textContent = `📍 ${state.userLocation.address}`;
      }
    })
    .catch(() => {
      state.userLocation.address = `GPS Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      if (addressEl) addressEl.textContent = `📍 ${state.userLocation.address}`;
    });
}

// Leaflet Map Setup with OpenStreetMap (Zero API key required, 100% free & reliable)
function initLeafletMap() {
  const mapContainer = document.getElementById('leafletMap');
  if (!mapContainer || typeof L === 'undefined') return;

  const lat = state.userLocation.lat || 12.9716;
  const lng = state.userLocation.lng || 77.5946;

  state.map = L.map('leafletMap').setView([lat, lng], 14);

  // Standard OpenStreetMap tiles (free, public, no watermarks, no API key needed)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    subdomains: ['a', 'b', 'c'],
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(state.map);

  const customIcon = L.divIcon({
    className: 'emergency-pin-marker',
    html: `
      <div class="emergency-radar-pulse"></div>
      <div class="emergency-pin-icon"></div>
    `,
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -42]
  });

  state.marker = L.marker([lat, lng], {
    icon: customIcon,
    draggable: true
  }).addTo(state.map);

  state.marker.bindPopup('<b>📍 Your Emergency Location</b><br>Drag pin or tap map to update')
    .openPopup();

  // Allow dragging marker to fine-tune location
  state.marker.on('dragend', (e) => {
    const pos = e.target.getLatLng();
    setEmergencyLocation(pos.lat, pos.lng, 'manual');
  });

  // Tap anywhere on the map to pin emergency location
  state.map.on('click', (e) => {
    setEmergencyLocation(e.latlng.lat, e.latlng.lng, 'manual');
  });

  // Recalculate dimensions to avoid gray tile borders
  setTimeout(() => {
    if (state.map) state.map.invalidateSize();
  }, 250);
}

function updateMapMarker(lat, lng, popupText = '<b>Your Emergency Location</b><br>GoldenHour Active') {
  if (!state.map) return;

  if (!state.marker) {
    const customIcon = L.divIcon({
      className: 'emergency-pin-marker',
      html: `
        <div class="emergency-radar-pulse"></div>
        <div class="emergency-pin-icon"></div>
      `,
      iconSize: [32, 42],
      iconAnchor: [16, 42],
      popupAnchor: [0, -42]
    });

    state.marker = L.marker([lat, lng], {
      icon: customIcon,
      draggable: true
    }).addTo(state.map);

    state.marker.on('dragend', (e) => {
      const pos = e.target.getLatLng();
      setEmergencyLocation(pos.lat, pos.lng, 'manual');
    });
  } else {
    state.marker.setLatLng([lat, lng]);
  }

  state.map.setView([lat, lng], state.map.getZoom() < 13 ? 14 : state.map.getZoom());
  if (popupText) {
    state.marker.bindPopup(popupText).openPopup();
  }
}

function quickJumpTo(cityKey) {
  const cities = {
    bengaluru: { lat: 12.9716, lng: 77.5946, name: 'Bengaluru, Karnataka, India' },
    delhi: { lat: 28.6139, lng: 77.2090, name: 'New Delhi, Delhi, India' },
    mumbai: { lat: 19.0760, lng: 72.8777, name: 'Mumbai, Maharashtra, India' },
    hyderabad: { lat: 17.3850, lng: 78.4867, name: 'Hyderabad, Telangana, India' },
    chennai: { lat: 13.0827, lng: 80.2707, name: 'Chennai, Tamil Nadu, India' },
    kolkata: { lat: 22.5726, lng: 88.3639, name: 'Kolkata, West Bengal, India' }
  };

  const city = cities[cityKey];
  if (!city) return;

  setEmergencyLocation(city.lat, city.lng, 'search');
  if (state.map) {
    state.map.flyTo([city.lat, city.lng], 14, { duration: 1 });
  }
}

function searchLocation() {
  const input = document.getElementById('mapSearchInput');
  if (!input || !input.value.trim()) return;

  const query = encodeURIComponent(input.value.trim());
  const locStatusEl = document.getElementById('locationStatusText');
  if (locStatusEl) locStatusEl.textContent = `🔍 Searching for "${input.value.trim()}"...`;

  fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`)
    .then(res => res.json())
    .then(data => {
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        setEmergencyLocation(lat, lng, 'search');
        if (state.map) {
          state.map.flyTo([lat, lng], 15, { duration: 1.2 });
        }
      } else {
        alert('Area not found. Please try another name or tap directly on the map to pin your location.');
        if (locStatusEl) locStatusEl.textContent = '❌ Location not found. Tap map to pin manually.';
      }
    })
    .catch(err => {
      console.warn('Geocoding search failed:', err);
      alert('Unable to reach address service. You can tap directly on the map to place your pin!');
    });
}

function toggleMapTheme() {
  const mapEl = document.getElementById('leafletMap');
  const themeBtn = document.getElementById('toggleMapThemeBtn');
  if (!mapEl) return;

  mapEl.classList.toggle('light-tiles');
  const isLight = mapEl.classList.contains('light-tiles');
  if (themeBtn) {
    themeBtn.textContent = isLight ? '☀️ Light' : '🌙 Dark Map';
  }
}

function setupLocationControls() {
  const searchInput = document.getElementById('mapSearchInput');
  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        searchLocation();
      }
    });
  }

  const searchBtn = document.getElementById('mapSearchBtn');
  if (searchBtn) {
    searchBtn.addEventListener('click', searchLocation);
  }
}

// Global window bindings for inline HTML onclick handlers
window.requestLocation = requestLocation;
window.setEmergencyLocation = setEmergencyLocation;
window.toggleMapTheme = toggleMapTheme;
window.quickJumpTo = quickJumpTo;
window.searchLocation = searchLocation;

// Location Privacy Toggle
function setupLocationSharing() {
  const toggleBtn = document.getElementById('toggleLocationSharingBtn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      state.userLocation.isSharing = !state.userLocation.isSharing;
      const statusEl = document.getElementById('locationSharingBadge');

      if (state.userLocation.isSharing) {
        toggleBtn.textContent = 'Pause Location Sharing';
        toggleBtn.className = 'btn btn-secondary btn-sm';
        if (statusEl) {
          statusEl.textContent = '🟢 Sharing Active';
          statusEl.style.color = '#34C759';
        }
      } else {
        toggleBtn.textContent = 'Resume Location Sharing';
        toggleBtn.className = 'btn btn-outline-warning btn-sm';
        if (statusEl) {
          statusEl.textContent = '🟡 Sharing Paused';
          statusEl.style.color = '#FF9500';
        }
      }
    });
  }
}

// Emergency Contacts & Share Links
function setupContacts() {
  renderContactsList();

  const addBtn = document.getElementById('addContactBtn');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const name = prompt('Enter Contact Name:');
      const phone = prompt('Enter Phone Number (with country code, e.g. +91...):');
      if (name && phone) {
        state.contacts.push({ name, phone });
        renderContactsList();
      }
    });
  }

  const smsBtn = document.getElementById('shareSmsBtn');
  if (smsBtn) {
    smsBtn.addEventListener('click', () => shareEmergencyMessage('sms'));
  }

  const whatsappBtn = document.getElementById('shareWhatsappBtn');
  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', () => shareEmergencyMessage('whatsapp'));
  }
}

function renderContactsList() {
  const container = document.getElementById('contactsList');
  if (!container) return;

  container.innerHTML = state.contacts.map((c, i) => `
    <div class="contact-card">
      <div>
        <strong>${c.name}</strong>
        <div class="text-muted">${c.phone}</div>
      </div>
      <button class="btn btn-sm btn-outline-danger" onclick="removeContact(${i})">Remove</button>
    </div>
  `).join('');
}

window.removeContact = function(index) {
  state.contacts.splice(index, 1);
  renderContactsList();
};

function shareEmergencyMessage(platform) {
  const locStr = `https://maps.google.com/?q=${state.userLocation.lat},${state.userLocation.lng}`;
  const msg = `EMERGENCY ALERT from GoldenHour!\nI need immediate assistance.\nMy Location: ${locStr}\nAddress: ${state.userLocation.address}\nPlease send help or call 112!`;

  if (platform === 'sms') {
    const phones = state.contacts.map(c => c.phone).join(',');
    window.location.href = `sms:${phones}?body=${encodeURIComponent(msg)}`;
  } else if (platform === 'whatsapp') {
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  }

  if (window.metricsEngine) {
    window.metricsEngine.recordAction('Shared Emergency Link via ' + platform.toUpperCase());
  }
}

// First-Aid Guide Renderer
function renderFirstAidGuides(t) {
  const container = document.getElementById('firstAidGuidesContainer');
  if (!container) return;

  const guides = [
    { key: 'cpr', title: t.cprTitle, desc: t.cprDesc, steps: t.cprSteps, metronome: true },
    { key: 'bleeding', title: t.bleedingTitle, desc: t.bleedingDesc, steps: t.bleedingSteps },
    { key: 'recovery', title: t.recoveryTitle, desc: t.recoveryDesc, steps: t.recoverySteps }
  ];

  container.innerHTML = guides.map(g => `
    <div class="guide-card">
      <div class="guide-card-header">
        <h3>${g.title}</h3>
        <p class="text-muted">${g.desc}</p>
      </div>

      ${g.metronome ? `
        <div class="metronome-box">
          <div id="metronomePulseCircle" class="metronome-circle">
            <span>110</span>
            <span style="font-size: 0.7rem; font-weight: 600;">BPM</span>
          </div>
          <button id="metronome-btn" class="btn" style="background: #ef4444; color: white; width: 100%; max-width: 380px; margin: 0 auto; min-height: 48px; font-weight: 700;" onclick="toggleCprMetronome()">
            🎵 Start CPR Compression Metronome (110 BPM)
          </button>
          <div class="cpr-clinical-note" style="margin-top: 12px; font-size: 0.8rem; color: #cbd5e1; line-height: 1.45; text-align: left; background: rgba(0,0,0,0.25); padding: 10px 14px; border-radius: 8px;">
            <strong style="color: #ff9f0a;">⚠️ Resuscitation Protocol Notice:</strong><br>
            • <strong>Trained Rescuers:</strong> Execute 30 chest compressions followed by 2 rescue breaths. Resume compressions immediately.<br>
            • <strong>Untrained Bystanders:</strong> Continue continuous <em>hands-only</em> compressions at the 110 BPM metronome rhythm without pauses until 112 personnel arrive.<br>
            • <em>Do not interrupt compressions solely based on cycle counts if rescue breaths cannot be delivered safely.</em>
          </div>
        </div>
      ` : ''}

      <div class="guide-steps">
        ${g.steps.map(s => `
          <div class="step-card">
            <div class="step-number">${s.step}</div>
            <div class="step-content">
              <h4>${s.title}</h4>
              <p>${s.desc}</p>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="guide-card-actions" style="margin-top: 14px; display: flex; gap: 8px;">
        <button class="btn btn-secondary btn-sm" onclick="speakGuide('${g.key}')">${t.ttsPlay}</button>
        <button class="btn btn-outline-light btn-sm" onclick="stopSpeech()">${t.ttsStop}</button>
      </div>

      <div class="source-badge">
        ℹ️ ${t.verifiedSource}
      </div>
    </div>
  `).join('');
}

// Global CPR Metronome State & Visual Audio Feedback (110 BPM ≈ 545ms)
let metronomeInterval = null;
let cprBeatCount = 0;

function toggleCprMetronome() {
  const btn = document.getElementById('metronome-btn');
  const circle = document.getElementById('metronomePulseCircle');

  if (metronomeInterval) {
    clearInterval(metronomeInterval);
    metronomeInterval = null;
    cprBeatCount = 0;

    if (btn) {
      btn.innerText = "🎵 Start CPR Compression Metronome (110 BPM)";
      btn.style.background = "#ef4444";
      btn.style.color = "#ffffff";
    }
    if (circle) {
      circle.classList.remove('running', 'pulsing');
      circle.innerHTML = "<span>110</span><span style='font-size: 0.7rem; font-weight: 600;'>BPM</span>";
    }
  } else {
    // Ensure AudioContext is initialized/resumed on user click gesture
    getAudioContext();

    // 110 BPM = 60,000ms / 110 ≈ 545ms per beat
    playBeepSound();
    triggerBeatVisual();

    metronomeInterval = setInterval(() => {
      playBeepSound();
      triggerBeatVisual();
    }, 545);

    if (btn) {
      btn.innerText = "🛑 Stop CPR Metronome (Running)";
      btn.style.background = "#10b981";
      btn.style.color = "#ffffff";
    }
    if (circle) {
      circle.classList.add('running');
    }

    if (window.metricsEngine) {
      window.metricsEngine.recordAction('Started CPR Metronome (110 BPM)');
    }
  }
}

function triggerBeatVisual() {
  const circle = document.getElementById('metronomePulseCircle');
  if (!circle) return;

  cprBeatCount++;
  // Cycle compressions 1 to 30
  const cycleBeat = ((cprBeatCount - 1) % 30) + 1;
  circle.innerHTML = `
    <span style="font-size: 0.7rem; letter-spacing: 0.5px; opacity: 0.9;">BEAT</span>
    <span style="font-size: 1.35rem; line-height: 1;">${cycleBeat}</span>
    <span style="font-size: 0.65rem; opacity: 0.85;">/ 30</span>
  `;

  circle.classList.add('pulsing');
  setTimeout(() => {
    if (circle) circle.classList.remove('pulsing');
  }, 140);
}

// Reusable single AudioContext to prevent hardware context leaks
function getAudioContext() {
  if (!window._cprAudioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      window._cprAudioCtx = new AudioContextClass();
    }
  }
  if (window._cprAudioCtx && window._cprAudioCtx.state === 'suspended') {
    window._cprAudioCtx.resume().catch(() => {});
  }
  return window._cprAudioCtx;
}

function playBeepSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    // Slight pitch accent for beat 1 of 30 cycle
    const isFirstBeat = (cprBeatCount % 30 === 1);
    osc.type = 'sine';
    osc.frequency.value = isFirstBeat ? 950 : 800;
    
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (err) {
    console.warn('Web Audio playback error:', err);
  }
}

// Text-to-Speech (TTS) Engine in English, Hindi, and Kannada
window.speakGuide = function(guideKey) {
  stopSpeech();

  if (!state.speechSynth) {
    alert('Text-to-Speech is not supported in this browser.');
    return;
  }

  const t = TRANSLATIONS[state.currentLang] || TRANSLATIONS.en;
  let textToRead = '';

  if (guideKey === 'cpr') {
    textToRead = `${t.cprTitle}. ${t.cprSteps.map(s => `Step ${s.step}: ${s.title}. ${s.desc}`).join('. ')}`;
  } else if (guideKey === 'bleeding') {
    textToRead = `${t.bleedingTitle}. ${t.bleedingSteps.map(s => `Step ${s.step}: ${s.title}. ${s.desc}`).join('. ')}`;
  } else if (guideKey === 'recovery') {
    textToRead = `${t.recoveryTitle}. ${t.recoverySteps.map(s => `Step ${s.step}: ${s.title}. ${s.desc}`).join('. ')}`;
  }

  state.speechUtterance = new SpeechSynthesisUtterance(textToRead);

  if (state.currentLang === 'hi') {
    state.speechUtterance.lang = 'hi-IN';
  } else if (state.currentLang === 'kn') {
    state.speechUtterance.lang = 'kn-IN';
  } else {
    state.speechUtterance.lang = 'en-IN';
  }

  state.speechUtterance.rate = 0.95;

  state.speechSynth.speak(state.speechUtterance);

  if (window.metricsEngine) {
    window.metricsEngine.recordAction(`Started Text-To-Speech Guide (${guideKey.toUpperCase()} - ${state.currentLang.toUpperCase()})`);
    window.metricsEngine.recordGuideCompleted(guideKey);
  }
};

window.stopSpeech = function() {
  if (state.speechSynth && state.speechSynth.speaking) {
    state.speechSynth.cancel();
  }
};
