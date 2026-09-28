// ===== Variables globales =====
let quizData = null;
let currentQuiz = null;
let currentQuestionIndex = 0;
let score = 0;
let selectedOptionIndex = null;

const lettres = ["A", "B", "C", "D"];

// ===== Éléments du DOM =====
const menuScreen = document.getElementById("menu-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const subjectList = document.getElementById("subject-list");

const quizIconEl = document.getElementById("quiz-icon");
const quizTitleEl = document.getElementById("quiz-title");
const questionCounterEl = document.getElementById("question-counter");
const questionTextEl = document.getElementById("question-text");
const optionsListEl = document.getElementById("options-list");
const errorMessageEl = document.getElementById("error-message");
const submitBtn = document.getElementById("submit-btn");
const nextBtn = document.getElementById("next-btn");

const resultIconEl = document.getElementById("result-icon");
const scoreDisplayEl = document.getElementById("score-display");
const playAgainBtn = document.getElementById("play-again-btn");

const themeToggleBtn = document.getElementById("theme-toggle");
const themeIconEl = document.getElementById("theme-icon");

// ===== Charger les données depuis data.json =====
fetch("./data.json")
  .then(response => response.json())
  .then(data => {
    quizData = data.quizzes;
    afficherMenu();
  })
  .catch(erreur => console.error("Erreur de chargement des données :", erreur));

// ===== Écran 1 : le menu des sujets =====
function afficherMenu() {
  subjectList.innerHTML = "";
  quizData.forEach((quiz, index) => {
    const bouton = document.createElement("button");
    bouton.className = "subject-btn";
    bouton.innerHTML = `<img src="${quiz.icon}" alt=""> ${quiz.title}`;
    bouton.addEventListener("click", () => demarrerQuiz(index));
    subjectList.appendChild(bouton);
  });
}

// ===== Démarrer un quiz =====
function demarrerQuiz(indexQuiz) {
  currentQuiz = quizData[indexQuiz];
  currentQuestionIndex = 0;
  score = 0;
  menuScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");
  resultScreen.classList.add("hidden");
  afficherQuestion();
}

// ===== Écran 2 : afficher une question =====
function afficherQuestion() {
  selectedOptionIndex = null;
  errorMessageEl.classList.add("hidden");
  submitBtn.classList.remove("hidden");
  submitBtn.disabled = true;
  nextBtn.classList.add("hidden");

  quizIconEl.src = currentQuiz.icon;
  quizTitleEl.textContent = currentQuiz.title;

  const question = currentQuiz.questions[currentQuestionIndex];
  questionCounterEl.textContent = `Question ${currentQuestionIndex + 1} of ${currentQuiz.questions.length}`;
  questionTextEl.textContent = question.question;

  optionsListEl.innerHTML = "";
  question.options.forEach((optionTexte, index) => {
    const bouton = document.createElement("button");
    bouton.className = "option-btn";

    const lettre = document.createElement("span");
    lettre.className = "option-letter";
    lettre.textContent = lettres[index];

    const texte = document.createElement("span");
    texte.textContent = optionTexte;

    bouton.appendChild(lettre);
    bouton.appendChild(texte);
    bouton.addEventListener("click", () => selectionnerOption(index));
    optionsListEl.appendChild(bouton);
  });
}

// ===== Sélectionner une réponse =====
function selectionnerOption(index) {
  selectedOptionIndex = index;
  errorMessageEl.classList.add("hidden");

  document.querySelectorAll(".option-btn").forEach((btn, i) => {
    btn.classList.toggle("selected", i === index);
  });

  submitBtn.disabled = false;
}

// ===== Valider la réponse =====
submitBtn.addEventListener("click", () => {
  if (selectedOptionIndex === null) {
    errorMessageEl.classList.remove("hidden");
    return;
  }

  const question = currentQuiz.questions[currentQuestionIndex];
  const boutonsOptions = document.querySelectorAll(".option-btn");
  const indexBonneReponse = question.options.indexOf(question.answer);

  boutonsOptions.forEach((btn, i) => {
    btn.disabled = true;
    btn.classList.remove("selected");
    if (i === indexBonneReponse) {
      btn.classList.add("correct");
    }
    if (i === selectedOptionIndex && i !== indexBonneReponse) {
      btn.classList.add("incorrect");
    }
  });

  if (selectedOptionIndex === indexBonneReponse) {
    score++;
  }

  submitBtn.classList.add("hidden");
  nextBtn.classList.remove("hidden");
});

// ===== Question suivante =====
nextBtn.addEventListener("click", () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < currentQuiz.questions.length) {
    afficherQuestion();
  } else {
    afficherResultat();
  }
});

// ===== Écran 3 : le résultat =====
function afficherResultat() {
  quizScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");
  resultIconEl.src = currentQuiz.icon;
  scoreDisplayEl.textContent = `${score} / ${currentQuiz.questions.length}`;
}

// ===== Rejouer =====
playAgainBtn.addEventListener("click", () => {
  resultScreen.classList.add("hidden");
  menuScreen.classList.remove("hidden");
});

// ===== Thème clair / sombre =====
function appliquerTheme(sombre) {
  document.body.classList.toggle("dark-theme", sombre);
  themeIconEl.src = sombre
    ? "./assets/images/icon-sun-light.svg"
    : "./assets/images/icon-moon-dark.svg";
  try {
    localStorage.setItem("theme", sombre ? "dark" : "light");
  } catch (e) {}
}

themeToggleBtn.addEventListener("click", () => {
  appliquerTheme(!document.body.classList.contains("dark-theme"));
});

// Restaurer le thème choisi lors de la visite précédente
try {
  if (localStorage.getItem("theme") === "dark") {
    appliquerTheme(true);
  }
} catch (e) {}