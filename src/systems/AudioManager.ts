/**
 * Procedural Audio Manager
 * Generates all music and SFX using Web Audio API.
 * No external audio files needed - everything is synthesized.
 * Uses per-track gain nodes for smooth crossfade transitions.
 */

type TrackName = 'menu' | 'game' | 'storm' | 'victory' | 'none';

// Musical note frequencies (octave 4 and 5)
const NOTE: Record<string, number> = {
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00,
  A4: 440.00, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99,
  A5: 880.00, B5: 987.77,
  C3: 130.81, E3: 164.81, G3: 196.00, A3: 220.00, B3: 246.94,
};

interface MelodyNote {
  freq: number;
  duration: number; // in beats
  rest?: boolean;   // silent note
}

// Crossfade timing (seconds)
const FADE_OUT_DURATION = 0.8;
const FADE_IN_DURATION = 1.4;

export class AudioManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  /** Active gain node for the currently-playing music track */
  private activeMusicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private currentTrack: TrackName = 'none';
  private musicTimers: number[] = [];
  private isPlaying = false;
  private isMuted = false;
  private initialized = false;

  /** Must be called from a user gesture (click/tap) */
  init(): void {
    if (this.initialized) return;
    try {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.3;
      this.masterGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = 0.6;
      this.sfxGain.connect(this.masterGain);

      this.initialized = true;
    } catch {
      // Web Audio not supported
    }
  }

  /** Resume audio context (needed after user interaction on mobile) */
  resume(): void {
    if (this.ctx?.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // ===========================
  // MUSIC
  // ===========================

  playTrack(track: TrackName): void {
    if (!this.initialized || !this.ctx || !this.masterGain || this.isMuted) return;
    if (this.currentTrack === track) return;

    // Crossfade: fade out old track on its own gain node
    this.fadeOutCurrentMusic();

    this.currentTrack = track;
    this.isPlaying = true;

    // Create a fresh gain node for the new track (enables true crossfade)
    this.activeMusicGain = this.ctx.createGain();
    this.activeMusicGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.activeMusicGain.gain.linearRampToValueAtTime(0.4, this.ctx.currentTime + FADE_IN_DURATION);
    this.activeMusicGain.connect(this.masterGain);

    switch (track) {
      case 'menu': this.playMenuMusic(); break;
      case 'game': this.playGameMusic(); break;
      case 'storm': this.playStormMusic(); break;
      case 'victory': this.playVictoryMusic(); break;
    }
  }

  /**
   * Fade out the currently-playing music on its own gain node.
   * Old oscillators continue through the fading gain and become silent,
   * then the node is disconnected to free resources.
   */
  private fadeOutCurrentMusic(): void {
    // Cancel future loop iterations
    this.musicTimers.forEach(t => clearTimeout(t));
    this.musicTimers = [];

    if (this.activeMusicGain && this.ctx) {
      const oldGain = this.activeMusicGain;
      const now = this.ctx.currentTime;

      // Cancel any in-progress ramps and start a clean fade-out
      oldGain.gain.cancelScheduledValues(now);
      oldGain.gain.setValueAtTime(oldGain.gain.value, now);
      oldGain.gain.linearRampToValueAtTime(0, now + FADE_OUT_DURATION);

      // Disconnect the old gain node after the fade completes
      setTimeout(() => {
        try { oldGain.disconnect(); } catch { /* already disconnected */ }
      }, (FADE_OUT_DURATION + 0.3) * 1000);
    }

    this.activeMusicGain = null;
  }

  stopMusic(): void {
    this.fadeOutCurrentMusic();
    this.isPlaying = false;
    this.currentTrack = 'none';
  }

  toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(
        this.isMuted ? 0 : 0.3,
        this.ctx.currentTime
      );
    }
    if (this.isMuted) this.stopMusic();
    return this.isMuted;
  }

  get muted(): boolean { return this.isMuted; }

  get track(): TrackName { return this.currentTrack; }

  // --- Menu: Gentle dreamy arpeggio ---
  private playMenuMusic(): void {
    const melody: MelodyNote[] = [
      { freq: NOTE.C4, duration: 1.5 },
      { freq: NOTE.E4, duration: 1 },
      { freq: NOTE.G4, duration: 1.5 },
      { freq: NOTE.E4, duration: 1 },
      { freq: NOTE.A4, duration: 1.5 },
      { freq: NOTE.G4, duration: 1 },
      { freq: NOTE.E4, duration: 1.5 },
      { freq: NOTE.D4, duration: 1 },
      { freq: NOTE.C4, duration: 1.5 },
      { freq: NOTE.E4, duration: 1 },
      { freq: NOTE.G4, duration: 1.5 },
      { freq: NOTE.A4, duration: 1 },
      { freq: NOTE.G4, duration: 2 },
      { freq: 0, duration: 1, rest: true },
    ];
    this.loopMelody(melody, 0.25, 'triangle', 140);
  }

  // --- Game: Upbeat encouraging rhythm ---
  private playGameMusic(): void {
    const melody: MelodyNote[] = [
      { freq: NOTE.E4, duration: 0.75 },
      { freq: NOTE.G4, duration: 0.75 },
      { freq: NOTE.A4, duration: 0.75 },
      { freq: NOTE.G4, duration: 0.75 },
      { freq: NOTE.E4, duration: 0.75 },
      { freq: NOTE.C4, duration: 0.75 },
      { freq: NOTE.D4, duration: 1.5 },
      { freq: NOTE.E4, duration: 0.75 },
      { freq: NOTE.G4, duration: 0.75 },
      { freq: NOTE.A4, duration: 0.75 },
      { freq: NOTE.C5, duration: 0.75 },
      { freq: NOTE.A4, duration: 0.75 },
      { freq: NOTE.G4, duration: 0.75 },
      { freq: NOTE.E4, duration: 1.5 },
      { freq: 0, duration: 0.75, rest: true },
    ];
    this.loopMelody(melody, 0.18, 'square', 150);
  }

  // --- Storm: Minor key, slightly tense but still musical ---
  private playStormMusic(): void {
    const melody: MelodyNote[] = [
      { freq: NOTE.A3, duration: 1.5 },
      { freq: NOTE.C4, duration: 1 },
      { freq: NOTE.E4, duration: 1.5 },
      { freq: NOTE.D4, duration: 1 },
      { freq: NOTE.C4, duration: 1.5 },
      { freq: NOTE.B3, duration: 1 },
      { freq: NOTE.A3, duration: 2 },
      { freq: NOTE.E4, duration: 1 },
      { freq: NOTE.D4, duration: 1 },
      { freq: NOTE.C4, duration: 1.5 },
      { freq: NOTE.A3, duration: 1.5 },
      { freq: 0, duration: 1, rest: true },
    ];
    this.loopMelody(melody, 0.2, 'triangle', 120);
  }

  // --- Victory: Warm, celebratory, ascending ---
  private playVictoryMusic(): void {
    const melody: MelodyNote[] = [
      { freq: NOTE.C4, duration: 1 },
      { freq: NOTE.E4, duration: 1 },
      { freq: NOTE.G4, duration: 1 },
      { freq: NOTE.C5, duration: 2 },
      { freq: NOTE.A4, duration: 1 },
      { freq: NOTE.C5, duration: 1 },
      { freq: NOTE.E5, duration: 2 },
      { freq: NOTE.D5, duration: 1 },
      { freq: NOTE.C5, duration: 1 },
      { freq: NOTE.A4, duration: 1 },
      { freq: NOTE.G4, duration: 2 },
      { freq: NOTE.E4, duration: 1 },
      { freq: NOTE.G4, duration: 1 },
      { freq: NOTE.C5, duration: 3 },
      { freq: 0, duration: 2, rest: true },
    ];
    this.loopMelody(melody, 0.22, 'triangle', 130);
  }

  /**
   * Play a melody in loop.
   * Captures the current activeMusicGain reference so that if the track
   * changes mid-loop, the old loop self-terminates gracefully.
   */
  private loopMelody(
    melody: MelodyNote[],
    volume: number,
    wave: OscillatorType,
    bpm: number
  ): void {
    if (!this.ctx || !this.activeMusicGain) return;

    // Capture the gain node for THIS track instance
    const trackGain = this.activeMusicGain;
    const beatDuration = 60 / bpm;

    const playOnce = () => {
      // Stop looping if track was changed (gain node replaced)
      if (!this.isPlaying || !this.ctx || trackGain !== this.activeMusicGain) return;

      let localTime = this.ctx.currentTime + 0.1;

      melody.forEach(note => {
        const dur = note.duration * beatDuration;
        if (!note.rest && note.freq > 0) {
          this.playTone(note.freq, localTime, dur * 0.85, volume, wave, trackGain);
        }
        localTime += dur;
      });

      // Schedule next loop iteration
      const totalDuration = melody.reduce((sum, n) => sum + n.duration * beatDuration, 0);
      const timer = window.setTimeout(() => {
        if (this.isPlaying && trackGain === this.activeMusicGain) playOnce();
      }, totalDuration * 1000);
      this.musicTimers.push(timer);
    };

    playOnce();
  }

  /** Play a single tone through a destination node */
  private playTone(
    freq: number,
    startTime: number,
    duration: number,
    volume: number,
    wave: OscillatorType,
    destination: AudioNode
  ): void {
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = wave;
    osc.frequency.setValueAtTime(freq, startTime);

    // Envelope: soft attack and release for pleasant sound
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(volume, startTime + 0.03);
    gain.gain.setValueAtTime(volume, startTime + duration - 0.05);
    gain.gain.linearRampToValueAtTime(0, startTime + duration);

    osc.connect(gain);
    gain.connect(destination);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.01);
  }

  // ===========================
  // SOUND EFFECTS
  // ===========================

  /** Jump sound: quick upward pitch sweep */
  playJump(): void {
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.linearRampToValueAtTime(600, now + 0.1);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.12);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  /** Collect heart: happy ascending sparkle */
  playCollect(): void {
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;
    [523, 659, 784].forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.2, now + i * 0.08);
      gain.gain.linearRampToValueAtTime(0, now + i * 0.08 + 0.15);
      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.15);
    });
  }

  /** Hit/damage: low thud */
  playHit(): void {
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.linearRampToValueAtTime(50, now + 0.2);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.25);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.25);
  }

  /** Level complete: triumphant short fanfare */
  playWin(): void {
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.25, now + i * 0.15);
      gain.gain.linearRampToValueAtTime(0, now + i * 0.15 + 0.3);
      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(now + i * 0.15);
      osc.stop(now + i * 0.15 + 0.3);
    });
  }

  /** UI click: short blip */
  playClick(): void {
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 800;
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.06);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.06);
  }

  destroy(): void {
    this.stopMusic();
    this.ctx?.close();
  }
}

/** Singleton instance */
export const audioManager = new AudioManager();
