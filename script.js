// ============================
//   MARATHON PHASMO GONZZO
//   Grille responsive (28 cases)
//   - 27 images random + 1 image fixe au centre
//   - Desktop: 7x4
//   - Mobile: 4x7
// ============================

console.log("script Marathon Phasmo chargé");

// Force l'accueil au chargement
document.body.classList.add("accueil");
document.body.classList.remove("carte");

// --- CONFIG ---
const TOTAL_SELECTABLE = 27; // 27 cases cochables (toutes sauf centre)

const ListeImages = [
  { id: 1, name: "Banshee.webp" },
  { id: 2, name: "Démon.webp" },
  { id: 3, name: "Djinn.webp" },
  { id: 4, name: "Esprit.webp" },
  { id: 5, name: "Goryo.webp" },
  { id: 6, name: "Oni.webp" },
  { id: 7, name: "Polter.webp" },
  { id: 8, name: "Revenant.webp" },
  { id: 9, name: "Thaye.webp" },
  { id: 10, name: "Yokai.webp" },
  { id: 11, name: "Hantu.webp" },
  { id: 12, name: "Spectre.webp" },
  { id: 13, name: "Fantome.webp" },
  { id: 14, name: "Ombre.webp" },
  { id: 15, name: "Yurei.webp" },
  { id: 16, name: "Cauchemar.webp" },
  { id: 17, name: "Deogen.webp" },
  { id: 18, name: "Jumeaux.webp" },
  { id: 19, name: "Mimic.webp" },
  { id: 20, name: "Moroi.webp" },
  { id: 21, name: "Myling.webp" },
  { id: 22, name: "Obake.webp" },
  { id: 23, name: "Onryo.webp" },
  { id: 24, name: "Raiju.webp" },
  { id: 25, name: "Obambo.webp" },
  { id: 26, name: "Gallu.webp" },
  { id: 27, name: "Dayan.webp" },
];

const centerImage = { name: "Marathon.webp" };

// PERF resize mobile (Safari)
let lastLayoutMode = null;
let resizeTimer = null;

function getLayoutMode() {
  return window.innerWidth <= 700 ? "mobile" : "desktop";
}

function getLayout() {
  const w = window.innerWidth;

  if (w <= 700) {
    return { rows: 7, cols: 4, centerRow: 3, centerCol: 1 };
  }

  return { rows: 4, cols: 7, centerRow: 1, centerCol: 3 };
}

// ============================
//       GÉNÉRATION CARTE
// ============================

function genererNouvelleCarte() {
  console.log("Génération de la carte Marathon responsive...");

  document.body.classList.remove("fin-marathon");
  document.body.classList.remove("accueil");
  document.body.classList.add("carte");

  const logoMarathon = document.getElementById("Logo_Marathon");
  if (logoMarathon) logoMarathon.classList.add("logo-small");

  const table = document.getElementById("carte");
  const imagesFolder = "images/";
  if (!table) return;

  const { rows: GRID_ROWS, cols: GRID_COLS, centerRow: CENTER_ROW, centerCol: CENTER_COL } = getLayout();
  lastLayoutMode = getLayoutMode();

  table.innerHTML = "";

  const imagesMelangees = shuffle([...ListeImages]);
  let indexImage = 0;

  for (let i = 0; i < GRID_ROWS; i++) {
    const row = table.insertRow(i);

    for (let j = 0; j < GRID_COLS; j++) {
      const cell = row.insertCell(j);

      // Image principale de la case
      const img = document.createElement("img");
      img.className = "cell-img"; // ✅ IMPORTANT

      // Cache le ? bleu si image manquante
      img.onerror = function () {
        this.style.display = "none";
      };

      if (i === CENTER_ROW && j === CENTER_COL) {
        img.src = imagesFolder + centerImage.name;
        img.alt = "Image centre Marathon";
        cell.classList.add("cell-center");
        cell.style.cursor = "default";
      } else {
        const imageData = imagesMelangees[indexImage];
        if (imageData) {
          img.src = imagesFolder + imageData.name;
          img.alt = "Image " + imageData.id;
        } else {
          cell.classList.add("cell-empty");
        }
        indexImage++;
      }

      // Overlay + logo validation
      const overlay = document.createElement("div");
      overlay.className = "overlay";

      const logo = document.createElement("img");
      logo.src = "images/Valide.webp";
      logo.alt = "Valide";
      logo.className = "logo";

      overlay.appendChild(logo);
      cell.appendChild(img);
      cell.appendChild(overlay);

      if (!(i === CENTER_ROW && j === CENTER_COL)) {
        cell.addEventListener("click", function () {
          toggleSelected(this);
        });
      }
    }
  }
}

// ============================
//       SÉLECTION / SON
// ============================

function toggleSelected(cell) {
  if (cell.classList.contains("cell-center")) return;
  if (document.body.classList.contains("fin-marathon")) return;

  cell.classList.toggle("selected");
  cell.classList.toggle("show-logo");

  jouerSonBingo();
  verifierFinMarathon();
}

function jouerSonBingo() {
  const audio = document.getElementById("bingoSound");
  if (!audio) return;
  audio.volume = 0.2;
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

// ============================
//       FIN MARATHON
// ============================

function verifierFinMarathon() {
  const table = document.getElementById("carte");
  if (!table) return;

  const selectedCount = table.querySelectorAll("td.selected").length;
  if (selectedCount === TOTAL_SELECTABLE) afficherMessageBravoEtRetour();
}

function afficherMessageBravoEtRetour() {
  if (document.body.classList.contains("fin-marathon")) return;
  document.body.classList.add("fin-marathon");

  let msg = document.getElementById("marathon-message");
  if (!msg) {
    msg = document.createElement("div");
    msg.id = "marathon-message";
    document.body.appendChild(msg);
  }

  msg.textContent = "Marathon terminé 🎉";
  msg.style.display = "block";

  setTimeout(() => {
    const table = document.getElementById("carte");
    if (table) table.innerHTML = "";

    document.body.classList.remove("carte");
    document.body.classList.add("accueil");
    document.body.classList.remove("fin-marathon");

    const logo = document.getElementById("Logo_Marathon");
    if (logo) logo.classList.remove("logo-small");

    msg.style.display = "none";
    window.scrollTo(0, 0);
  }, 10000);
}

// ============================
//   SHUFFLE
// ============================

function shuffle(array) {
  let currentIndex = array.length;
  let randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

// ============================
//   INIT + RESIZE PERF
// ============================

document.addEventListener("DOMContentLoaded", () => {
  const boutonGenerer = document.getElementById("boutonGenerer");
  if (boutonGenerer) boutonGenerer.style.display = "block";
  lastLayoutMode = getLayoutMode();
});

window.addEventListener("resize", () => {
  if (!document.body.classList.contains("carte")) return;
  if (document.body.classList.contains("fin-marathon")) return;

  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    const mode = getLayoutMode();
    if (mode !== lastLayoutMode) {
      lastLayoutMode = mode;
      genererNouvelleCarte();
    }
  }, 200);
});
