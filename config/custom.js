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



window.addEventListener('DOMContentLoaded', () => {

  // Check for dev tutorial query
  const urlParams = new URLSearchParams(window.location.search);
  const forceTutorial = urlParams.get('dev') === 'tutorial';

  if(localStorage.getItem('solarVisited') && !forceTutorial) return; // only show once unless forced

  // Create overlay
  const overlay = document.createElement('div');
  overlay.id = 'solarWelcomeOverlay';
  overlay.style.display = 'flex';
  overlay.innerHTML = `
    <div class="solar-popup">
      <h1>Welcome to Solar</h1>
      <p>Simple, enjoyable, and full of fun games!</p>

      <div class="solar-themes">
        <div class="theme-card" data-theme="default">
          <div class="theme-preview" style="background:#111"></div>
          Default
        </div>
        <div class="theme-card" data-theme="blue">
          <div class="theme-preview" style="background:#0ff"></div>
          Blue
        </div>
        <div class="theme-card" data-theme="pink">
          <div class="theme-preview" style="background:#ff00ff"></div>
          Pink
        </div>
      </div>

      <h2 style="margin-top:30px">Top Games</h2>
      <div class="solar-top-games"></div>

      <button class="solar-next">Next</button>
    </div>
  `;
  document.body.appendChild(overlay);
  document.body.classList.add('solar-blur');

  const themeCards = overlay.querySelectorAll('.theme-card');
  let selectedTheme = 'default';

  themeCards.forEach(card => {
    card.addEventListener('click', () => {
      themeCards.forEach(c=>c.classList.remove('selected'));
      card.classList.add('selected');
      selectedTheme = card.dataset.theme;
    });
  });

  // Populate top games from topGames array
  const topGames = [
    { "name": "Baldi's Basics", "image": "https://ogs.creatyc.com/cdn/baldis-basics/splash.png", "url": "https://solararcade.github.io/cdn/baldisbasics", "new": false },
    { "name": "Balatro", "image": "https://highschoolmathteachers.com/stuff/games/balatro.jpg", "url": "https://highschoolmathteachers.com/stuff/selfhosted/balatro/", "new": false },
    { "name": "BitLife", "image": "https://ogs.creatyc.com/cdn/bitlife/splash.png", "url": "https://ogs.creatyc.com/cdn/bitlife", "new": false },
    { "name": "Blox Fruits", "image": "https://lh3.googleusercontent.com/d/18OhYxRfP1C-ufhvjtybdEtXm8aehBtjy=s220?authuser=0", "url": "https://solararcade.github.io/cdn/bloxfruitsredirect", "new": true },
    { "name": "Soundboard", "image": "https://ogs.creatyc.com/cdn/soundboard/img/mlg-favicon.png", "url": "https://ogs.creatyc.com/cdn/soundboard", "new": false }
  ];

  const topGamesContainer = overlay.querySelector('.solar-top-games');
  topGames.forEach(game=>{
    const gameDiv = document.createElement('div');
    gameDiv.classList.add('game');
    gameDiv.innerHTML = `<img src="${game.image}" alt="${game.name}"><p>${game.name}</p>`;
    gameDiv.querySelector('img').onclick = () => window.open(game.url,'_blank');
    topGamesContainer.appendChild(gameDiv);
  });

  // Next button applies theme & closes overlay
  overlay.querySelector('.solar-next').addEventListener('click', () => {
    document.body.classList.remove('solar-blur');
    overlay.remove();
    localStorage.setItem('solarVisited','true');
    // Apply theme color
    switch(selectedTheme){
      case 'blue': document.body.style.background = '#0ff'; break;
      case 'pink': document.body.style.background = '#ff00ff'; break;
      default: document.body.style.background = '#111'; break;
    }
  });

  // Settings button
  const settingsBtn = document.createElement('button');
  settingsBtn.id = 'solarSettingsButton';
  document.body.appendChild(settingsBtn);

  settingsBtn.addEventListener('click', () => {
    overlay.style.display = 'flex';
    document.body.classList.add('solar-blur');
  });

});
