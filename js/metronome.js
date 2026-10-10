/**
 * GoldenHour — CPR Rhythmic Compression Metronome Engine
 * Generates an audio beat at 110 BPM (Target range 100-120 compressions/min)
 * Uses Web Audio API for zero-latency, high-precision timing without external audio files.
 */

class CprMetronome {
  constructor() {
    this.audioCtx = null;
    this.bpm = 110;
    this.isPlaying = false;
    this.timerId = null;
    this.beatCount = 0;
    this.onBeatCallback = null;
  }

  init() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
  }

  start(onBeat) {
    this.init();
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    this.isPlaying = true;
    this.beatCount = 0;
    this.onBeatCallback = onBeat;

    const intervalMs = (60 / this.bpm) * 1000;

    const playClick = () => {
      if (!this.isPlaying) return;

      this.beatCount++;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      // High pitch accent for beat 1 of 30, solid tone for rest
      osc.frequency.value = (this.beatCount % 30 === 1) ? 900 : 650;
      osc.type = 'sine';

      gain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.08);

      if (typeof this.onBeatCallback === 'function') {
        this.onBeatCallback(this.beatCount);
      }
    };

    playClick();
    this.timerId = setInterval(playClick, intervalMs);
  }

  stop() {
    this.isPlaying = false;
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    this.beatCount = 0;
  }
}

const cprMetronome = new CprMetronome();
