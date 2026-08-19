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

// Mariposas — solo en la pantalla del mapa (screen-home)
// Usamos el emoji 🦋 en vez de SVG con color dinámico: el color por
// variable CSS dentro de un SVG no siempre se ve bien en Safari de
// iPhone. El emoji nativo se ve igual en todos los celulares.
function createButterflies(containerSelector, count) {
  document.querySelectorAll(containerSelector).forEach(container => {
    for (let i = 0; i < count; i++) {
      const b = document.createElement("span");
      b.className = "butterfly";
      b.textContent = "🦋";
      b.style.fontSize = (16 + Math.random() * 10).toFixed(0) + "px";
      b.style.left = (Math.random() * 82 + 4).toFixed(1) + "%";
      b.style.top = (Math.random() * 74 + 4).toFixed(1) + "%";
      b.style.animationDelay = (Math.random() * 6).toFixed(2) + "s";
      b.style.animationDuration = (7 + Math.random() * 4).toFixed(2) + "s";
      container.appendChild(b);
    }
  });
}
createButterflies(".map-wrap", 8);
