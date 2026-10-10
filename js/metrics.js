/**
 * GoldenHour — Prototype Impact Metrics & Safety Audit Engine
 * Measures bystander response timeline, guide completions, and safety rules.
 */

class MetricsEngine {
  constructor() {
    this.startTime = Date.now();
    this.timeToFirstAction = null;
    this.actionLogs = [];
    this.volunteersReached = 0;
    this.guidesCompleted = new Set();
  }

  recordAppOpen() {
    this.startTime = Date.now();
  }

  recordAction(actionName) {
    if (!this.timeToFirstAction) {
      this.timeToFirstAction = Math.round((Date.now() - this.startTime) / 1000);
    }
    const timestamp = new Date().toLocaleTimeString();
    this.actionLogs.unshift({ timestamp, actionName });
    this.updateMetricsDisplay();
  }

  recordVolunteerAlert(count) {
    this.volunteersReached += count;
    this.updateMetricsDisplay();
  }

  recordGuideCompleted(guideKey) {
    this.guidesCompleted.add(guideKey);
    this.updateMetricsDisplay();
  }

  updateMetricsDisplay() {
    const timeEl = document.getElementById('metricTimeToAction');
    const volEl = document.getElementById('metricVolunteersCount');
    const guideEl = document.getElementById('metricGuideCount');
    const logsEl = document.getElementById('metricsTimelineLogs');

    if (timeEl) {
      timeEl.textContent = this.timeToFirstAction ? `${this.timeToFirstAction} seconds` : 'Awaiting first user action...';
    }

    if (volEl) {
      volEl.textContent = `${this.volunteersReached} simulated alerts`;
    }

    if (guideEl) {
      guideEl.textContent = `${this.guidesCompleted.size} / 3 guides completed`;
    }

    if (logsEl) {
      logsEl.innerHTML = this.actionLogs.map(l => `
        <div class="timeline-log-item">
          <span class="log-time">${l.timestamp}</span>
          <span class="log-action">${l.actionName}</span>
        </div>
      `).join('');
    }
  }
}

window.metricsEngine = new MetricsEngine();
