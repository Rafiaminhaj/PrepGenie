// Utility for Premium Micro-Interaction Sounds using Web Audio API

let audioCtx = null;

const getAudioContext = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

if (typeof window !== 'undefined') {
  window.addEventListener('click', () => {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();
  }, { once: false });
}

// A helper function to create a snappy beep
const playBeep = (freq, duration, vol) => {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = 'sine';
    // Set frequency instantly
    oscillator.frequency.value = freq;

    // Instant volume, then drop it to 0 instantly at duration
    gainNode.gain.value = vol;
    
    // Hard cutoff to prevent any echo or delay issues
    gainNode.gain.setValueAtTime(vol, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + duration);
  } catch (e) {
    console.error("Sound error", e);
  }
};

export const playHoverInSound = () => {
  playBeep(800, 0.05, 0.2);
};

export const playHoverOutSound = () => {
  playBeep(400, 0.05, 0.2); // Same volume, lower pitch, NO DELAY
};

export const playClickSound = () => {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(1000, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1500, ctx.currentTime + 0.1);

    gainNode.gain.value = 0.3;
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.1);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.1);
  } catch (e) {
    console.error("Click sound error", e);
  }
};
