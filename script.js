// ============================
//   MARATHON PHASMO GONZZO
//   Grille 5 x 5 (25 cases)
//   - PAS de seed
//   - PAS de partage
//   - PAS de bingo
//   - 24 images random + 1 image fixe au centre
// ============================

console.log("script Marathon Phasmo chargé");

document.body.classList.add("accueil");


// --- CONFIG ---

const GRID_ROWS = 5;
const GRID_COLS = 5;
// 5 x 5 = 25 cases, dont 1 centre => 24 images random

// Case centrale (3e ligne, 3e colonne => index 2,2 en 0-based)
const CENTER_ROW = 2;
const CENTER_COL = 2;

// 24 images pour toutes les cases SAUF le centre
// ➜ on ENLÈVE Marathon.webp de cette liste, il sera utilisé seulement pour la case centrale
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
  // NOTE : Marathon.webp est retirée d'ici
];

// Image FIXE au centre
const centerImage = {
  name: "Marathon.webp", // l'image qui sera toujours en 3,3
};

// ============================
//       GÉNÉRATION CARTE
// ============================

function genererNouvelleCarte() {
  console.log("Génération de la carte Marathon 5x5...");

  // Passe en mode "carte"
document.body.classList.remove("accueil");
document.body.classList.add("carte");

// Réduit le logo
document.getElementById("Logo_Marathon").classList.add("logo-small");

  const table = document.getElementById("carte");
  const imagesFolder = "images/";

  if (!table) {
    console.error("Table #carte introuvable dans le HTML");
    return;
  }

  table.innerHTML = "";

  const imagesMelangees = shuffle([...ListeImages]);
  let indexImage = 0;

  for (let i = 0; i < GRID_ROWS; i++) {
    const row = table.insertRow(i);

    for (let j = 0; j < GRID_COLS; j++) {
      const cell = row.insertCell(j);
      const img = document.createElement("img");

      if (i === CENTER_ROW && j === CENTER_COL) {
        img.src = imagesFolder + centerImage.name;
        img.alt = "Image centre Marathon";
      } else {
        const imageData = imagesMelangees[indexImage];
        if (!imageData) continue;
        img.src = imagesFolder + imageData.name;
        img.alt = "Image " + imageData.id;
        indexImage++;
      }

      const overlay = document.createElement("div");
      overlay.className = "overlay";

      const logo = document.createElement("img");
      logo.src = "images/Valide.webp";
      logo.alt = "Valide";
      logo.className = "logo";

      overlay.appendChild(logo);
      cell.appendChild(img);
      cell.appendChild(overlay);

      cell.addEventListener("click", function () {
        toggleSelected(this);
      });
    }
  }

  // 🔽 ICI : on passe le logo en version "petite"
  const logoMarathon = document.getElementById("Logo_Marathon");
  if (logoMarathon) {
    logoMarathon.classList.add("logo-small");
  }
}


// ============================
//       SÉLECTION / SON
// ============================

function toggleSelected(cell) {
  if (cell.classList.contains("selected")) {
    cell.classList.remove("selected");
    console.log("Case unselected");
  } else {
    cell.classList.add("selected");
    console.log("Case selected");
  }

  jouerSonBingo();
}

function jouerSonBingo() {
  const audio = document.getElementById("bingoSound");
  if (!audio) return;
  audio.volume = 0.2;
  audio.play();
}

// ============================
//   FONCTION DE MÉLANGE
// ============================

function shuffle(array) {
  let currentIndex = array.length;
  let randomIndex;

  // Algorithme de Fisher–Yates
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

// ============================
//   INITIALISATION
// ============================

document.addEventListener("DOMContentLoaded", () => {
  // On peut soit générer direct, soit attendre le clic.
  // Là on attend le clic, comme pour les autres pages :
  const boutonGenerer = document.getElementById("boutonGenerer");
  if (boutonGenerer) {
    boutonGenerer.style.display = "block";
  }
});
