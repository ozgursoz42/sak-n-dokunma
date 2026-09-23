/**
 * Creative Pixar-Style Sound Synthesizer for "SAKIN DOKUNMA!"
 * High-character whimsical cartoon sound effects generated with Web Audio API:
 * - Magical sparkle glockenspiel & fairy chime on correct answers
 * - Cartoon spring-boing & comedic wobble on mistakes
 * - Resonant cartoon bubble pops & squishes
 * - Comedic brass "wah-wah" slide on game over
 * - Dynamic clockwork tension ticks
 */

class CreativeSoundEngine {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;

  constructor() {
    const saved = localStorage.getItem('sakin_dokunma_muted');
    this.isMuted = saved === 'true';
  }

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    localStorage.setItem('sakin_dokunma_muted', String(this.isMuted));
    if (!this.isMuted) {
      this.playSparkleSuccess(1);
    }
    return this.isMuted;
  }

  /**
   * Magical Fairy Sparkle & Glockenspiel on Correct Answer
   * Multiple crystalline chime frequencies + playful bubbly pitch-rise
   */
  public playSparkleSuccess(combo: number = 1) {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const baseNote = 523.25; // C5
      const pentatonic = [1, 1.25, 1.333, 1.5, 1.875, 2, 2.25, 2.5];
      const offset = (combo - 1) % pentatonic.length;

      // 1. Playful bubble squish "boop"
      const bubbleOsc = this.ctx.createOscillator();
      const bubbleGain = this.ctx.createGain();
      bubbleOsc.type = 'sine';
      bubbleOsc.frequency.setValueAtTime(320 + combo * 30, now);
      bubbleOsc.frequency.exponentialRampToValueAtTime(780 + combo * 50, now + 0.12);

      bubbleGain.gain.setValueAtTime(0.25, now);
      bubbleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      bubbleOsc.connect(bubbleGain);
      bubbleGain.connect(this.ctx.destination);
      bubbleOsc.start(now);
      bubbleOsc.stop(now + 0.14);

      // 2. Crystalline Sparkle Arpeggio (Glockenspiel)
      const sparklePitches = [
        baseNote * pentatonic[offset],
        baseNote * pentatonic[(offset + 2) % pentatonic.length] * 1.5,
        baseNote * pentatonic[(offset + 4) % pentatonic.length] * 2,
      ];

      sparklePitches.forEach((freq, idx) => {
        if (!this.ctx) return;
        const chimeOsc = this.ctx.createOscillator();
        const chimeGain = this.ctx.createGain();
        const t = now + idx * 0.045;

        chimeOsc.type = 'triangle';
        chimeOsc.frequency.setValueAtTime(freq, t);

        chimeGain.gain.setValueAtTime(0.22, t);
        chimeGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);

        chimeOsc.connect(chimeGain);
        chimeGain.connect(this.ctx.destination);

        chimeOsc.start(t);
        chimeOsc.stop(t + 0.35);
      });
    } catch {}
  }

  /**
   * Cartoon Comedic Bonk + Spring Boing + Wobble on Mistake
   */
  public playComedicMistake() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // 1. Low Impact Cartoon "Thud/Bonk"
      const bonkOsc = this.ctx.createOscillator();
      const bonkGain = this.ctx.createGain();
      bonkOsc.type = 'triangle';
      bonkOsc.frequency.setValueAtTime(180, now);
      bonkOsc.frequency.exponentialRampToValueAtTime(45, now + 0.15);

      bonkGain.gain.setValueAtTime(0.35, now);
      bonkGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      bonkOsc.connect(bonkGain);
      bonkGain.connect(this.ctx.destination);
      bonkOsc.start(now);
      bonkOsc.stop(now + 0.16);

      // 2. Comedic Spring Wobble (Frequency-modulated boing!)
      const springOsc = this.ctx.createOscillator();
      const springGain = this.ctx.createGain();
      springOsc.type = 'sawtooth';

      // Pitch dives then wobbles rapidly like a cartoon ruler twang
      springOsc.frequency.setValueAtTime(320, now + 0.05);
      springOsc.frequency.exponentialRampToValueAtTime(110, now + 0.22);
      
      // Add vibrato/wobble
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(18, now); // 18Hz fast vibrato
      lfoGain.gain.setValueAtTime(35, now);

      lfo.connect(springOsc.frequency);

      springGain.gain.setValueAtTime(0.28, now + 0.05);
      springGain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);

      springOsc.connect(springGain);
      springGain.connect(this.ctx.destination);

      lfo.start(now + 0.05);
      springOsc.start(now + 0.05);
      lfo.stop(now + 0.42);
      springOsc.stop(now + 0.42);
    } catch {}
  }

  /**
   * Playful Mascot Taunt / Rule Switch Gong
   */
  public playRuleSwitch() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Quirky double whistle / slide
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.linearRampToValueAtTime(900, now + 0.08);
      osc.frequency.linearRampToValueAtTime(600, now + 0.16);
      osc.frequency.linearRampToValueAtTime(1200, now + 0.24);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.28);
    } catch {}
  }

  /**
   * Tension Clockwork Tick
   */
  public playTensionTick(urgency: number = 0.5) {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Pitch rises as time runs short
      const pitch = 700 + (1 - urgency) * 600;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, now);
      osc.frequency.exponentialRampToValueAtTime(pitch * 0.7, now + 0.035);

      gain.gain.setValueAtTime(0.08 + (1 - urgency) * 0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch {}
  }

  /**
   * Comedic Cartoon Trombone "Wah-Wah-Wah-Waaah" Game Over
   */
  public playComedicGameOver() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Classic cartoon muted trombone notes: Eb4 -> D4 -> Db4 -> C4 (falling with pitch bend)
      const slides = [
        { startFreq: 311.13, endFreq: 295, start: 0, dur: 0.28 },
        { startFreq: 293.66, endFreq: 277, start: 0.3, dur: 0.28 },
        { startFreq: 277.18, endFreq: 260, start: 0.6, dur: 0.28 },
        { startFreq: 261.63, endFreq: 180, start: 0.9, dur: 0.8 }, // long sad slide with vibrato
      ];

      slides.forEach((s) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = now + s.start;

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(s.startFreq, t);
        osc.frequency.exponentialRampToValueAtTime(s.endFreq, t + s.dur);

        // Lowpass filter for warm muted brass sound
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, t);
        filter.frequency.linearRampToValueAtTime(350, t + s.dur);

        gain.gain.setValueAtTime(0.22, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + s.dur);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + s.dur);
      });
    } catch {}
  }
}

export const sound = new CreativeSoundEngine();
