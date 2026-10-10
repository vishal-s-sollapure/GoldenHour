/**
 * GoldenHour — Nearby Volunteer Alert Network (Simulated MVP)
 * Simulates community first-responders receiving instant proximity alerts.
 */

class VolunteersEngine {
  constructor() {
    this.mockVolunteers = [
      { id: 1, name: 'Dr. Priya M.', qualification: 'MD / CPR & BLS Certified', distance: '350 meters', phone: '+919811122233', status: 'Available', eta: '3 mins' },
      { id: 2, name: 'Rahul Sharma', qualification: 'Red Cross First Responder', distance: '600 meters', phone: '+919822233344', status: 'Available', eta: '5 mins' },
      { id: 3, name: 'Ananya Rao', qualification: 'Paramedic Student', distance: '850 meters', phone: '+919833344455', status: 'Available', eta: '7 mins' },
      { id: 4, name: 'Vikram Singh', qualification: 'Basic First Aid Trained', distance: '1.2 km', phone: '+919844455566', status: 'Busy', eta: '12 mins' }
    ];
    this.isAlertBroadcasted = false;
    this.broadcastLogs = [];
  }

  initRadar() {
    this.renderVolunteersList();
  }

  renderVolunteersList() {
    const listEl = document.getElementById('volunteersListContainer');
    if (!listEl) return;

    listEl.innerHTML = `
      <div class="volunteer-radar-box">
        <div class="radar-header">
          <div>
            <h3 style="font-size: 1.1rem; margin-bottom: 4px;">📡 Nearby Registered Volunteers (1km Radius)</h3>
            <div class="simulation-badge">[SIMULATED DEMO - MVP]</div>
          </div>
          <button id="broadcastVolAlertBtn" class="btn ${this.isAlertBroadcasted ? 'btn-success' : 'btn-danger'}" style="margin-top: 6px;">
            ${this.isAlertBroadcasted ? '🚨 ALERT BROADCASTED' : '📡 Broadcast Alert to Volunteers'}
          </button>
        </div>

        ${this.isAlertBroadcasted ? `
          <div class="broadcast-status-banner">
            🟢 <strong>Alert Dispatched!</strong> 3 Nearby community volunteers received your notification.
          </div>
        ` : ''}

        <div class="volunteer-cards-grid">
          ${this.mockVolunteers.map(v => {
            const isAccepted = v.status.includes('Accepted');
            const badgeClass = isAccepted ? 'badge-accepted' : (v.status === 'Available' ? 'badge-available' : 'badge-busy');
            return `
              <div class="volunteer-card ${isAccepted ? 'accepted-card' : ''}">
                <div class="v-header">
                  <span class="v-name">${v.name}</span>
                  <span class="v-badge ${badgeClass}">${v.status}</span>
                </div>
                <div class="v-qual">${v.qualification}</div>
                <div class="v-meta">
                  <span>📍 ${v.distance} away</span>
                  <span>⏱ ETA ~${v.eta}</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    const broadcastBtn = document.getElementById('broadcastVolAlertBtn');
    if (broadcastBtn) {
      broadcastBtn.addEventListener('click', () => this.triggerBroadcastAlert());
    }
  }

  triggerBroadcastAlert() {
    this.isAlertBroadcasted = true;
    
    // Simulate responses
    setTimeout(() => {
      this.mockVolunteers[0].status = 'Accepted (En Route)';
      this.renderVolunteersList();
    }, 1200);

    setTimeout(() => {
      this.mockVolunteers[1].status = 'Accepted (En Route)';
      this.renderVolunteersList();
    }, 2400);

    if (window.metricsEngine) {
      window.metricsEngine.recordVolunteerAlert(3);
    }

    this.renderVolunteersList();
  }
}

window.volunteersEngine = new VolunteersEngine();
