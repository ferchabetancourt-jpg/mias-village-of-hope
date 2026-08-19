// App-style navigation: hotspots open a modal window over the map.
const modal = document.getElementById("village-modal");
const panels = document.querySelectorAll(".modal-panel");
const hotspots = document.querySelectorAll(".hotspot");
const closers = document.querySelectorAll("[data-close]");

function openModal(id) {
  panels.forEach(p => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  const scrollArea = modal.querySelector(".village-modal-scroll");
  if (scrollArea) scrollArea.scrollTop = 0;
  // Reprocesa el embed de Instagram cada vez que se abre un panel —
  // si no, el reel puede quedar en blanco porque el panel estaba
  // oculto (display:none) cuando el script de Instagram cargó.
  if (window.instgrm) window.instgrm.Embeds.process();
}

function closeModal() {
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

hotspots.forEach(btn => {
  btn.addEventListener("click", () => openModal(btn.dataset.target));
});

closers.forEach(btn => {
  btn.addEventListener("click", closeModal);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("active")) closeModal();
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

// Audio de Mía — play/pause, sin autoplay
const miaAudio = document.getElementById("mia-audio");
const miaAudioBtn = document.getElementById("mia-audio-btn");
if (miaAudio && miaAudioBtn) {
  const icon = miaAudioBtn.querySelector(".mia-audio-icon");
  miaAudioBtn.addEventListener("click", () => {
    if (miaAudio.paused) {
      miaAudio.play();
      icon.textContent = "⏸️";
    } else {
      miaAudio.pause();
      icon.textContent = "🔊";
    }
  });
  miaAudio.addEventListener("ended", () => {
    icon.textContent = "🔊";
  });
}

// Destellos de luz dorada — solo en la pantalla del mapa (screen-home).
// Reemplaza el efecto de mariposas: color fijo (no variable CSS), sin
// depender de que el navegador renderice un emoji — mismo enfoque
// seguro que ya usamos para el barrido de luz (.map-sweep).
function createSparkles(containerSelector, count) {
  document.querySelectorAll(containerSelector).forEach(container => {
    for (let i = 0; i < count; i++) {
      const s = document.createElement("span");
      s.className = "sparkle";
      s.style.left = (Math.random() * 90 + 3).toFixed(1) + "%";
      s.style.top = (Math.random() * 88 + 4).toFixed(1) + "%";
      s.style.animationDelay = (Math.random() * 4).toFixed(2) + "s";
      s.style.animationDuration = (2 + Math.random() * 2).toFixed(2) + "s";
      container.appendChild(s);
    }
  });
}
createSparkles(".map-wrap", 9);

// ============================================================
// ONBOARDING — one fixed screen (window + photo never move).
// 3 steps of content swap underneath it. Shows every visit by
// default; "Don't show this again" skips it from then on.
// ============================================================
const ONBOARDING_HIDE_KEY = "mia_onboarding_hide";

function showTopScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  const target = document.getElementById(id);
  if (target) target.classList.add("active");
}

function showOnboardingStep(id) {
  document.querySelectorAll(".onboarding-step").forEach(s => s.classList.remove("active"));
  const target = document.getElementById(id);
  if (target) target.classList.add("active");
}

document.querySelectorAll(".onboarding-next").forEach(btn => {
  btn.addEventListener("click", () => showOnboardingStep(btn.dataset.next));
});

const onboardingEnterBtn = document.getElementById("onboarding-enter-btn");
const onboardingHideCheckbox = document.getElementById("onboarding-hide-checkbox");
if (onboardingEnterBtn) {
  onboardingEnterBtn.addEventListener("click", () => {
    if (onboardingHideCheckbox && onboardingHideCheckbox.checked) {
      localStorage.setItem(ONBOARDING_HIDE_KEY, "true");
    }
    showTopScreen("screen-home");
  });
}

// Decide what to show first, as soon as the script runs.
if (localStorage.getItem(ONBOARDING_HIDE_KEY) === "true") {
  showTopScreen("screen-home");
} else {
  showTopScreen("screen-onboarding");
}
