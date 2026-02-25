import { useCallback, useRef, useEffect } from "react";

/**
 * A hook to generate procedural sound effects using the Web Audio API.
 * This avoids the need for external asset files and ensures instant playback.
 */
export function useSoundEffects() {
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Initialize AudioContext on mount
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContext) {
      audioContextRef.current = new AudioContext();
    }
    
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  const playTone = useCallback((frequency: number, type: OscillatorType, duration: number, startTime: number = 0, volume: number = 0.1) => {
    const ctx = audioContextRef.current;
    if (!ctx) return;

    // Resume context if suspended (browser policy)
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime + startTime);

    gain.gain.setValueAtTime(volume, ctx.currentTime + startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime + startTime);
    osc.stop(ctx.currentTime + startTime + duration);
  }, []);

  const playSuccess = useCallback(() => {
    // A clean, "Apple Pay" style chime (Major chord: C6, E6, G6)
    // Slightly staggered for a "shimmer" effect
    playTone(1046.50, "sine", 0.6, 0, 0.15);    // C6
    playTone(1318.51, "sine", 0.6, 0.05, 0.15); // E6
    playTone(1567.98, "sine", 0.8, 0.1, 0.15);  // G6
  }, [playTone]);

  const playError = useCallback(() => {
    // A soft "thud" or error bump
    playTone(150, "triangle", 0.3, 0, 0.2);
    playTone(100, "sawtooth", 0.3, 0.05, 0.2);
  }, [playTone]);

  const playClick = useCallback(() => {
    // A very subtle, high-pitch "tick" for UI interactions
    playTone(800, "sine", 0.05, 0, 0.05);
  }, [playTone]);

  const playPop = useCallback(() => {
    // A bubbly "pop" sound
    playTone(400, "sine", 0.1, 0, 0.1);
  }, [playTone]);

  return { playSuccess, playError, playClick, playPop };
}
