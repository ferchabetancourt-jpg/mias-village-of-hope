// App-style navigation: full-screen sections, no scrolling between them.
const screens = document.querySelectorAll(".screen");
const hotspots = document.querySelectorAll(".hotspot");
const backButtons = document.querySelectorAll("[data-back]");

function showScreen(id) {
  screens.forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  window.scrollTo(0, 0);
}

hotspots.forEach(btn => {
  btn.addEventListener("click", () => showScreen(btn.dataset.target));
});

backButtons.forEach(btn => {
  btn.addEventListener("click", () => showScreen("screen-home"));
});

// Language toggle (EN default, ES on tap)
let currentLang = "en";
const langBtn = document.getElementById("lang-toggle");
const translatable = document.querySelectorAll("[data-en]");

function applyLang(lang) {
  translatable.forEach(el => {
    el.textContent = el.dataset[lang];
  });
  langBtn.textContent = lang === "en" ? "ES" : "EN";
  document.documentElement.lang = lang;
}

langBtn.addEventListener("click", () => {
  currentLang = currentLang === "en" ? "es" : "en";
  applyLang(currentLang);
});
