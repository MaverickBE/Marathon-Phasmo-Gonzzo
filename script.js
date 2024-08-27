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
  { id: 25, name: "Marathon.webp" },
  // Ajoutez le reste des images ici
];

function genererNouvelleCarte(images) {
  if (images === undefined) {
    // Mélanger les images
    images = shuffle(ListeImages);
    var seed = "";
    for (const image of images) {
      if (image.id <= 9) {
        seed += "0";
      }
      seed += image.id;
    }

    seed = seed.substring(0, 50);
    var url = "?seed=" + seed;
    window.history.pushState({ path: url }, "", url);
    console.log(url);

    // Afficher le bouton de partage
    document.getElementById("boutonPartager").style.display = "block";
  }

  // Récupérer la référence de la table
  var table = document.getElementById("carte");
  console.log("Carte générée");

  // Effacer le contenu de la table //
  table.innerHTML = "";

  // Récupérer la liste des images dans le dossier "images"
  var imagesFolder = "images/";

  // Remplir la table avec les images
  var count = 0;
  for (var i = 0; i < 5; i++) {
    var row = table.insertRow(i);
    for (var j = 0; j < 5; j++) {
      var cell = row.insertCell(j);
      var img = document.createElement("img");
      img.src = imagesFolder + images[count].name;
      img.alt = "Image " + (count + 1);

      // Créer un overlay pour la superposition du logo de validation
      var overlay = document.createElement("div");
      overlay.className = "overlay";

      // Ajouter un logo de validation (visible lorsque sélectionné)
      var logo = document.createElement("img");
      logo.src = "images/Valide.webp";
      logo.alt = "Bingo_confirme";
      logo.className = "logo";

      overlay.appendChild(logo);
      cell.appendChild(img);
      cell.appendChild(overlay);

      cell.addEventListener("click", function () {
        toggleSelected(this);
        verifierBingo();
      });

      count++;
    }
  }
}

function ControlSeedURL() {
  var paramsString = window.location.search;
  var searchParams = new URLSearchParams(paramsString);
  if (searchParams.has("seed") === true) {
    if (searchParams.get("seed").length == 50) {
      CutSeed(searchParams.get("seed"));
    } else {
      alert("Mauvais format de seed");
    }
  }
}

ControlSeedURL();

function doublon(tableau) {
  var tableauunique = Array.from(new Set(tableau));
  return tableau.length !== tableauunique.length;
}

// Découpe le seed
function CutSeed(seed) {
  var ListeImagesGenerees = [];
  var tableidimages = seed.match(/.{1,2}/g);
  for (id of tableidimages) {
    for (image of ListeImages) {
      if (image.id == id) {
        ListeImagesGenerees.push(image);
      }
    }
  }
  // Vérifie s'il y a des doublons dans la liste d'ID
  if (doublon(ListeImagesGenerees)) {
    alert("Mauvais format de seed");
  } else {
    // Vérifie qu'il y a bien 25 ID's d'images
    if (ListeImagesGenerees.length == 25) {
      genererNouvelleCarte(ListeImagesGenerees);
    } else {
      alert("Mauvais format de seed");
    }
  }
}

function copierLien() {
  var lienGeneré = window.location.href;

  // Créer un élément textarea temporaire
  var textarea = document.createElement("textarea");
  textarea.value = lienGeneré;

  // Ajouter l'élément textarea à la page
  document.body.appendChild(textarea);

  // Sélectionner le texte dans l'élément textarea
  textarea.select();
  textarea.setSelectionRange(0, 99999); // Pour les navigateurs mobiles

  // Copier le texte dans le presse-papiers
  document.execCommand("copy");

  // Retirer l'élément textarea temporaire de la page
  document.body.removeChild(textarea);

  // Afficher une notification  après la copie
  alert("Lien copié dans le presse-papiers");
}

// Fonction pour mélanger un tableau
function shuffle(array) {
  var currentIndex = array.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

// Fonction pour basculer l'état sélectionné d'une cellule
function toggleSelected(cell) {
  // Vérifier si la cellule est déjà sélectionnée
  if (cell.classList.contains("selected")) {
    // Supprimer la classe "selected"
    cell.classList.remove("selected");
    console.log("Case unselected");
  } else {
    // Ajouter la classe "selected"
    cell.classList.add("selected");
    console.log("Case selected");
  }

  jouerSonBingo();
}

function jouerSonBingo() {
  var audio = document.getElementById("bingoSound");
  audio.volume = 0.2;
  audio.play();
}
