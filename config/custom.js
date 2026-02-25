window.addEventListener('DOMContentLoaded', () => {
  const music = new Audio('assets/solar-theme.mp3');
  music.loop = true;
  music.volume = 0.2; // adjust volume so it’s not overpowering

  // Try to play automatically; if blocked, play on first user interaction
  const playMusic = () => {
    music.play().catch(() => {
      console.log("Autoplay blocked, waiting for user interaction...");
    });
  };

  playMusic();

  // If autoplay blocked, play on first click or keypress
  ['click', 'keydown', 'touchstart'].forEach(evt => {
    window.addEventListener(evt, playMusic, { once: true });
  });
});
