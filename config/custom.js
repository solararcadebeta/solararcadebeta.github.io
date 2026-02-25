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

// Wait until gamesData is loaded
function waitForGamesData() {
  if (typeof gamesData !== "undefined" && gamesData.length > 0) {
    applyNewTabGames();
  } else {
    setTimeout(waitForGamesData, 100); // check again in 100ms
  }
}

// Function to update new games
function applyNewTabGames() {
  const gamesContainer = document.getElementById("gamesContainer");

  // Go through each game in the container
  gamesContainer.querySelectorAll(".game").forEach((gameDiv, index) => {
    const game = gamesData[index]; // match with the gamesData array

    if (game && game.new) {
      const gameImage = gameDiv.querySelector("img");
      if (gameImage) {
        // Override click to open in a new tab
        gameImage.onclick = () => {
          window.open(game.url, "_blank");
        };
      }
    }
  });
}

// Start waiting
waitForGamesData();