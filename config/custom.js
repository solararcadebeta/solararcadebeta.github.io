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







// ==============================
// SOLAR COMPLETE UI SYSTEM
// ==============================

(function () {
  window.addEventListener("load", () => {
    applyTheme();
    createSettingsButton();

    if (!localStorage.getItem("solar_setup_complete")) {
      createSolarSetup();
    }
  });
})();

// ==============================
// THEME SYSTEM
// ==============================

function selectTheme(theme) {
  if (theme === "default") {
    localStorage.removeItem("solar_theme");
  } else {
    localStorage.setItem("solar_theme", theme);
  }
  applyTheme();
}

function applyTheme() {
  const theme = localStorage.getItem("solar_theme");
  document.body.style.background = "";

  if (theme === "light") {
    document.body.style.background = "#f2f2f2";
  } 
  else if (theme === "dark") {
    document.body.style.background = "#0d0d0d";
  } 
  else if (theme === "vapor") {
    document.body.style.background =
      "linear-gradient(135deg, #ff00cc, #00c3ff)";
  }
}

// ==============================
// FIRST TIME SETUP
// ==============================

function createSolarSetup() {
  const overlay = document.createElement("div");
  overlay.id = "solarSetupOverlay";

  overlay.innerHTML = `
    <div class="solar-setup-box">
      
      <div class="solar-step active" id="step1">
        <h1>Welcome to Solar</h1>
        <p>
          Solar is simple, enjoyable, and filled with fun games.
          No clutter. No distractions. Just a clean place to play.
        </p>
      </div>

      <div class="solar-step" id="step2">
        <h1>Choose a Theme</h1>
        <div class="solar-theme-options">

          ${themeCard("default","Default","default-preview")}
          ${themeCard("dark","Dark","dark-preview")}
          ${themeCard("light","Light","light-preview")}
          ${themeCard("vapor","Vapor","vapor-preview")}

        </div>
      </div>

      <div class="solar-step" id="step3">
        <h1>Top Games</h1>
        <div id="solarTopGames" class="solar-top-games"></div>
      </div>

      <button class="solar-next-btn" id="solarNextBtn">Next</button>
    </div>
  `;

  document.body.appendChild(overlay);

  let currentStep = 1;
  const nextBtn = document.getElementById("solarNextBtn");

  nextBtn.onclick = () => {
    if (currentStep === 2 && !localStorage.getItem("solar_theme") && !localStorage.getItem("solar_theme") === null) {
      return;
    }

    if (currentStep === 3) {
      localStorage.setItem("solar_setup_complete", "true");
      overlay.remove();
      return;
    }

    document.getElementById(`step${currentStep}`).classList.remove("active");
    currentStep++;
    document.getElementById(`step${currentStep}`).classList.add("active");

    if (currentStep === 3) {
      nextBtn.textContent = "Enter Solar";
      loadTopGames();
    }
  };
}

function themeCard(value, label, previewClass) {
  return `
    <div class="theme-card" onclick="selectTheme('${value}')">
      <div class="theme-preview ${previewClass}"></div>
      <span>${label}</span>
    </div>
  `;
}

function loadTopGames() {
  fetch("./config/games.json")
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("solarTopGames");
      const top = data.slice(0, 4);

      top.forEach(game => {
        const div = document.createElement("div");
        div.classList.add("game");

        const img = document.createElement("img");
        img.src = game.image;

        const p = document.createElement("p");
        p.textContent = game.name;

        div.appendChild(img);
        div.appendChild(p);
        container.appendChild(div);
      });
    });
}

// ==============================
// SETTINGS BUTTON
// ==============================

function createSettingsButton() {
  const btn = document.createElement("div");
  btn.id = "solarSettingsBtn";
  btn.innerText = "Settings";
  btn.onclick = openSettingsModal;
  document.body.appendChild(btn);
}

function openSettingsModal() {
  if (document.getElementById("solarSettingsModal")) return;

  const modal = document.createElement("div");
  modal.id = "solarSettingsModal";

  modal.innerHTML = `
    <div class="solar-settings-box">
      <h2>Theme Settings</h2>

      <div class="solar-theme-options">
        ${themeCard("default","Default","default-preview")}
        ${themeCard("dark","Dark","dark-preview")}
        ${themeCard("light","Light","light-preview")}
        ${themeCard("vapor","Vapor","vapor-preview")}
      </div>

      <button onclick="closeSettingsModal()" class="solar-close-btn">
        Close
      </button>
    </div>
  `;

  document.body.appendChild(modal);
}

function closeSettingsModal() {
  const modal = document.getElementById("solarSettingsModal");
  if (modal) modal.remove();
}

// Start waiting
waitForGamesData();
