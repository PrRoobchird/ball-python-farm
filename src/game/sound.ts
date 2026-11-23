class SoundEngine {
  private ctx: AudioContext | null = null;
  public muted = false;

  private getCtx(): AudioContext | null {
    if (this.muted || typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private tone(freq: number, duration: number, type: OscillatorType = 'square', volume = 0.04, delay = 0) {
    const ctx = this.getCtx();
    if (!ctx) return;
    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration);
  }

  click() {
    this.tone(520, 0.05, 'square', 0.03);
  }

  buy() {
    this.tone(440, 0.07, 'square', 0.04, 0);
    this.tone(660, 0.1, 'square', 0.04, 0.06);
  }

  sell() {
    this.tone(587, 0.07, 'triangle', 0.06, 0);
    this.tone(880, 0.09, 'triangle', 0.06, 0.07);
    this.tone(1174, 0.14, 'triangle', 0.05, 0.14);
  }

  breed() {
    this.tone(330, 0.09, 'triangle', 0.05, 0);
    this.tone(440, 0.09, 'triangle', 0.05, 0.09);
    this.tone(554, 0.15, 'triangle', 0.05, 0.18);
  }

  hatch() {
    this.tone(523, 0.08, 'square', 0.04, 0);
    this.tone(659, 0.08, 'square', 0.04, 0.08);
    this.tone(784, 0.08, 'square', 0.04, 0.16);
    this.tone(1046, 0.22, 'square', 0.05, 0.24);
  }

  nextDay() {
    this.tone(392, 0.07, 'triangle', 0.04, 0);
    this.tone(523, 0.11, 'triangle', 0.04, 0.07);
  }
}

export const sound = new SoundEngine();
