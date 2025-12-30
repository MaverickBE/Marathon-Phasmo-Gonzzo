// --- CONFIG ---

const GRID_ROWS = 4;
const GRID_COLS = 7;
// 4 x 7 = 28 cases

const TOTAL_SELECTABLE = 27; // 27 cases cochables (toutes sauf le centre)

// Case "centrale" choisie (tu peux bouger si tu veux)
const CENTER_ROW = 1; // 2e ligne (0-based)
const CENTER_COL = 3; // 4e colonne (0-based)

// 27 entités (TOUTES sauf Marathon.webp)
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

  // NOUVELLES ENTITÉS
  { id: 25, name: "Obambo.webp" },
  { id: 26, name: "Gallu.webp" },
  { id: 27, name: "Dayan.webp" },
];

// Image FIXE au centre
const centerImage = { name: "Marathon.webp" };

function genererNouvelleCarte() {
  console.log("Génération de la carte Marathon 4x7...");

  document.body.classList.remove("accueil");
  document.body.classList.add("carte");

  const logoEl = document.getElementById("Logo_Marathon");
  if (logoEl) logoEl.classList.add("logo-small");

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
        if (!imageData) {
          // Si un jour tu changes la taille et qu'il manque des images, on évite le crash
          cell.classList.add("empty");
          continue;
        }
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

      // ✅ Centre = pas cliquable
      if (i === CENTER_ROW && j === CENTER_COL) {
        cell.classList.add("cell-center");
        cell.style.cursor = "default";
        // Pas d'event listener
      } else {
        cell.addEventListener("click", function () {
          toggleSelected(this);
        });
      }
     }
     }
     } 
      


  // 🔽 ICI : on passe le logo en version "petit"
  const logoMarathon = document.getElementById("Logo_Marathon");
  if (logoMarathon) {
    logoMarathon.classList.add("logo-small");
  }



// ============================
//       SÉLECTION / SON
// ============================

function toggleSelected(cell) {
  // Sécurité: si un jour un clic arrive sur la case centre, on ignore
  if (cell.classList.contains("cell-center")) return;

  if (cell.classList.contains("selected")) {
    cell.classList.remove("selected");
    cell.classList.remove("show-logo");
    console.log("Case unselected");
  } else {
    cell.classList.add("selected");
    cell.classList.add("show-logo");
    console.log("Case selected");
  }

  jouerSonBingo();
  verifierFinMarathon();
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

function verifierFinMarathon() {
  const table = document.getElementById("carte");
  if (!table) return;

  // ✅ on compte uniquement les cases selected (la case centre n'est jamais selected)
  const selectedCount = table.querySelectorAll("td.selected").length;

  if (selectedCount === TOTAL_SELECTABLE) {
    afficherMessageBravoEtRetour();
  }
}

// ============================
//   VERIF FIN DE MARATHON
// ============================

function afficherMessageBravoEtRetour() {
  // éviter de déclencher 2 fois
  if (document.body.classList.contains("fin-marathon")) return;
  document.body.classList.add("fin-marathon");

  // Crée/affiche un message
  let msg = document.getElementById("marathon-message");
  if (!msg) {
    msg = document.createElement("div");
    msg.id = "marathon-message";
    document.body.appendChild(msg);
  }

  msg.textContent = " Marathon terminé 🎉";
  msg.style.display = "block";

  // Après 10 secondes: reset + retour accueil
  setTimeout(() => {
    // Supprime la grille
    const table = document.getElementById("carte");
    if (table) table.innerHTML = "";

    // Revenir en accueil
    document.body.classList.remove("carte");
    document.body.classList.add("accueil");
    document.body.classList.remove("fin-marathon");

    // Remettre logo grand
    const logo = document.getElementById("Logo_Marathon");
    if (logo) logo.classList.remove("logo-small");

    // Cache le message
    msg.style.display = "none";

    // (Optionnel) remonter en haut
    window.scrollTo(0, 0);
  }, 10000);
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
