// ============================
//   MARATHON PHASMO GONZZO (OPTI + STATE)
// ============================

console.log("script Marathon Phasmo (opti+state) chargé");

document.body.classList.add("accueil");
document.body.classList.remove("carte");

const TOTAL_SELECTABLE = 27;

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

// ----------------------------
// STATE (pour conserver la grille au resize)
// ----------------------------
let state = {
  hasGrid: false,
  imagesOrder: [],              // 27 noms d'images dans l'ordre tiré
  selected: new Set(),          // indices linéaires (0..27) sélectionnés, hors centre
};

let selectedCount = 0;

// PERF resize
let lastLayoutMode = null;
let resizeTimer = null;

function getLayoutMode() {
  return window.innerWidth <= 700 ? "mobile" : "desktop";
}

function getLayout() {
  const w = window.innerWidth;
  if (w <= 700) return { rows: 7, cols: 4, centerRow: 3, centerCol: 1 };
  return { rows: 4, cols: 7, centerRow: 1, centerCol: 3 };
}

function centerIndexForLayout(layout) {
  return layout.centerRow * layout.cols + layout.centerCol;
}

function shuffle(array) {
  let currentIndex = array.length;
  while (currentIndex !== 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

// Audio: armement
let audioArmed = false;
function armAudio() {
  if (audioArmed) return;
  const audio = document.getElementById("bingoSound");
  if (!audio) return;

  audio.volume = 0;
  audio.currentTime = 0;
  audio.play()
    .then(() => {
      audio.pause();
      audio.currentTime = 0;
      audio.volume = 0.2;
      audioArmed = true;
    })
    .catch(() => {
      audio.volume = 0.2;
    });
}

function jouerSonBingo() {
  const audio = document.getElementById("bingoSound");
  if (!audio) return;
  audio.volume = 0.2;
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

function resetToAccueil() {
  const grid = document.getElementById("carte");
  if (grid) grid.innerHTML = "";

  document.body.classList.remove("carte");
  document.body.classList.add("accueil");
  document.body.classList.remove("fin-marathon");

  const logo = document.getElementById("Logo_Marathon");
  if (logo) logo.classList.remove("logo-small");

  const msg = document.getElementById("marathon-message");
  if (msg) msg.style.display = "none";

  // reset state
  state.hasGrid = false;
  state.imagesOrder = [];
  state.selected = new Set();
  selectedCount = 0;

  window.scrollTo(0, 0);
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

  setTimeout(resetToAccueil, 10000);
}

// ----------------------------
// Build grid from state/imagesOrder
// ----------------------------
function buildGridFromState() {
  const grid = document.getElementById("carte");
  if (!grid) return;

  const layout = getLayout();
  lastLayoutMode = getLayoutMode();

  grid.style.setProperty("--cols", layout.cols);
  grid.innerHTML = "";

  const frag = document.createDocumentFragment();
  const imagesFolder = "images/";

  const centerIndex = centerIndexForLayout(layout);

  // On place 28 cellules: 27 images + centre fixe
  // Mapping: on remplit toutes les positions sauf centre avec state.imagesOrder (27 items)
  let k = 0;

  for (let idx = 0; idx < layout.rows * layout.cols; idx++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.idx = String(idx);

    const img = document.createElement("img");
    img.className = "cell-img";
    img.loading = "lazy";
    img.decoding = "async";
    img.onerror = function () { this.style.display = "none"; };

    if (idx === centerIndex) {
      img.src = imagesFolder + centerImage.name;
      img.alt = "Centre Marathon";
      cell.classList.add("cell-center");
      cell.dataset.center = "1";
    } else {
      const name = state.imagesOrder[k++];
      if (name) {
        img.src = imagesFolder + name;
        img.alt = name;
      }
    }

    const overlay = document.createElement("div");
    overlay.className = "overlay";

    const logo = document.createElement("img");
    logo.className = "logo";
    logo.src = "images/Valide.webp";
    logo.alt = "Valide";
    logo.loading = "lazy";
    logo.decoding = "async";

    overlay.appendChild(logo);
    cell.appendChild(img);
    cell.appendChild(overlay);

    // Ré-applique la sélection
    if (state.selected.has(idx)) {
      cell.classList.add("selected", "show-logo");
    }

    frag.appendChild(cell);
  }

  grid.appendChild(frag);
}

// Génère une nouvelle carte (nouvel ordre) + build
function genererNouvelleCarte() {
  document.body.classList.remove("fin-marathon");
  document.body.classList.remove("accueil");
  document.body.classList.add("carte");

  const logoMarathon = document.getElementById("Logo_Marathon");
  if (logoMarathon) logoMarathon.classList.add("logo-small");

  // Nouveau tirage
  const order = shuffle([...ListeImages]).map(x => x.name); // 27 noms
  state.hasGrid = true;
  state.imagesOrder = order;
  state.selected = new Set();
  selectedCount = 0;

  buildGridFromState();
}

// 1 listener grid
function onGridClick(e) {
  const grid = document.getElementById("carte");
  if (!grid) return;

  const cell = e.target.closest(".cell");
  if (!cell || !grid.contains(cell)) return;

  if (cell.dataset.center === "1") return;
  if (document.body.classList.contains("fin-marathon")) return;

  const idx = Number(cell.dataset.idx);
  if (Number.isNaN(idx)) return;

  const wasSelected = cell.classList.contains("selected");
  if (wasSelected) {
    cell.classList.remove("selected", "show-logo");
    state.selected.delete(idx);
    selectedCount--;
  } else {
    cell.classList.add("selected", "show-logo");
    state.selected.add(idx);
    selectedCount++;
  }

  jouerSonBingo();

  if (selectedCount === TOTAL_SELECTABLE) {
    afficherMessageBravoEtRetour();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  lastLayoutMode = getLayoutMode();

  document.addEventListener("pointerdown", armAudio, { once: true, passive: true });

  const boutonGenerer = document.getElementById("boutonGenerer");
  if (boutonGenerer) {
    boutonGenerer.addEventListener("click", () => {
      armAudio();
      genererNouvelleCarte();
    });
  }

  const grid = document.getElementById("carte");
  if (grid) {
    grid.addEventListener("click", onGridClick);
  }
});

// Resize: si changement mobile/desktop, on rebuild avec la même grille + mêmes coches
window.addEventListener("resize", () => {
  if (!document.body.classList.contains("carte")) return;
  if (document.body.classList.contains("fin-marathon")) return;
  if (!state.hasGrid) return;

  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    const mode = getLayoutMode();
    if (mode !== lastLayoutMode) {
      lastLayoutMode = mode;

      // 🔁 On conserve imagesOrder + selected (par index)
      // MAIS: centreIndex change, donc les indices sélectionnés doivent être remappés proprement.
      // On fait un remap "position -> position" via tableau de 28 cases, puis on rebuild.
      remapSelectionBetweenLayouts();
      buildGridFromState();
    }
  }, 200);
});

// Remap pour garder les mêmes cases cochées malgré changement centre position
function remapSelectionBetweenLayouts() {
  const oldLayout = (lastLayoutMode === "mobile")
    ? { rows: 4, cols: 7, centerRow: 1, centerCol: 3 }   // on vient de quitter desktop
    : { rows: 7, cols: 4, centerRow: 3, centerCol: 1 };  // on vient de quitter mobile

  const newLayout = getLayout();

  const oldCenter = centerIndexForLayout(oldLayout);
  const newCenter = centerIndexForLayout(newLayout);

  // tableau des 28 positions (true/false) sauf centre
  const oldFlags = Array(oldLayout.rows * oldLayout.cols).fill(false);
  for (const idx of state.selected) {
    if (idx !== oldCenter) oldFlags[idx] = true;
  }

  // On transfère par ordre de lecture, en ignorant le centre
  // On crée une liste linéaire de 27 bools correspondant aux 27 cases non-centre
  const list27 = [];
  for (let i = 0; i < oldFlags.length; i++) {
    if (i === oldCenter) continue;
    list27.push(oldFlags[i]);
  }

  // On re-pose dans le nouveau layout (en ignorant le nouveau centre)
  const newSelected = new Set();
  let k = 0;
  for (let i = 0; i < newLayout.rows * newLayout.cols; i++) {
    if (i === newCenter) continue;
    if (list27[k]) newSelected.add(i);
    k++;
  }

  state.selected = newSelected;
  selectedCount = state.selected.size;
}
