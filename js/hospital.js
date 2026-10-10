/**
 * GoldenHour — Hospital Emergency Desk Pre-Alert Dashboard (Simulated MVP)
 * Demonstrates how authorized emergency departments receive incident location,
 * victim info, and estimated arrival details before arrival.
 */

class HospitalEngine {
  constructor() {
    this.incomingAlerts = [
      {
        id: 'INC-2026-8901',
        hospitalName: 'Manipal Hospital Emergency Desk',
        type: 'Cardiac Arrest / CPR in Progress',
        location: 'MG Road, Indiranagar, Bengaluru',
        coords: '12.9716, 77.5946',
        eta: '6 minutes',
        bystanderActions: 'Bystander executing 110 BPM CPR with GoldenHour Metronome',
        timestamp: new Date().toLocaleTimeString(),
        status: 'PENDING_ACKNOWLEDGEMENT'
      }
    ];
  }

  renderHospitalDashboard() {
    const container = document.getElementById('hospitalDeskContainer');
    if (!container) return;

    container.innerHTML = `
      <div class="hospital-desk-box">
        <div class="hospital-desk-header">
          <div>
            <h3>🏥 Manipal Hospital — Trauma & Emergency Triage Desk</h3>
            <p class="text-muted">Live Integration Prototype for Hospital Pre-Alert Network</p>
          </div>
          <div class="simulation-badge warning-badge">[PROTOTYPE DEMO - SIMULATION]</div>
        </div>

        <div class="incoming-incidents-section">
          <h4>🚨 Incoming Patient Pre-Alert Payload</h4>

          ${this.incomingAlerts.map(inc => `
            <div class="incident-payload-card ${inc.status === 'ACKNOWLEDGED' ? 'ack-card' : ''}">
              <div class="inc-header">
                <span class="inc-id">${inc.id}</span>
                <span class="inc-type-tag">${inc.type}</span>
                <span class="inc-time">${inc.timestamp}</span>
              </div>

              <div class="inc-body-grid">
                <div>
                  <strong>📍 Incident Location:</strong>
                  <div>${inc.location} (${inc.coords})</div>
                </div>

                <div>
                  <strong>⏱ Estimated Arrival (ETA):</strong>
                  <div class="eta-highlight">${inc.eta}</div>
                </div>

                <div class="inc-full-width">
                  <strong>ℹ️ Bystander Pre-Hospital Actions:</strong>
                  <div>${inc.bystanderActions}</div>
                </div>
              </div>

              <div class="inc-actions">
                ${inc.status === 'PENDING_ACKNOWLEDGEMENT' ? `
                  <button class="btn btn-success btn-sm" onclick="window.hospitalEngine.acknowledgeIncident('${inc.id}')">
                    ✅ Acknowledge & Prepare Trauma Bay 1
                  </button>
                  <button class="btn btn-outline-light btn-sm" onclick="window.hospitalEngine.dispatchHospitalAmbulance('${inc.id}')">
                    🚑 Simulate Pre-Alert Dispatch (Demo Only — Not a Real Dispatch)
                  </button>
                ` : `
                  <div class="status-ack-text">
                    🟢 Trauma Bay 1 Prepared & Emergency Medical Team Standing By (Simulated Demo).
                  </div>
                `}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  acknowledgeIncident(id) {
    const inc = this.incomingAlerts.find(i => i.id === id);
    if (inc) {
      inc.status = 'ACKNOWLEDGED';
      this.renderHospitalDashboard();
      if (window.metricsEngine) {
        window.metricsEngine.recordAction('Hospital Trauma Desk Acknowledged Pre-Alert (Simulation)');
      }
    }
  }

  dispatchHospitalAmbulance(id) {
    alert('⚠️ SIMULATED DEMO ONLY: No real ambulance has been dispatched. GoldenHour does not replace local emergency services. In a real emergency, call 112 immediately.');
    if (window.metricsEngine) {
      window.metricsEngine.recordAction('Simulated Hospital Pre-Alert Dispatched (Demo Only)');
    }
  }

  dispatchPreAlert(payload) {
    this.incomingAlerts.unshift({
      id: `INC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      hospitalName: 'Manipal Hospital Emergency Desk',
      type: payload.type || 'Emergency SOS',
      location: payload.location.address || 'User GPS Coordinates',
      coords: `${payload.location.lat.toFixed(4)}, ${payload.location.lng.toFixed(4)}`,
      eta: 'Simulated Demo ETA: ~5 mins (Illustrative)',
      bystanderActions: 'GoldenHour SOS Triggered & Location Shared',
      timestamp: payload.timestamp || new Date().toLocaleTimeString(),
      status: 'PENDING_ACKNOWLEDGEMENT'
    });
    this.renderHospitalDashboard();
  }
}

window.hospitalEngine = new HospitalEngine();
