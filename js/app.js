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
function createButterflies(containerSelector, count) {
  document.querySelectorAll(containerSelector).forEach(container => {
    for (let i = 0; i < count; i++) {
      const b = document.createElement("span");
      b.className = "butterfly";
      b.style.left = (Math.random() * 84 + 4).toFixed(1) + "%";
      b.style.top = (Math.random() * 78 + 4).toFixed(1) + "%";
      b.style.animationDelay = (Math.random() * 6).toFixed(2) + "s";
      b.style.animationDuration = (7 + Math.random() * 4).toFixed(2) + "s";
      b.innerHTML = `
        <svg viewBox="0 0 24 24" class="butterfly-svg" aria-hidden="true">
          <g class="wing wing-left"><path d="M12 12 C6 3, -1 5, 1 12 C-1 19, 6 21, 12 12 Z" fill="var(--gold)"/></g>
          <g class="wing wing-right"><path d="M12 12 C18 3, 25 5, 23 12 C25 19, 18 21, 12 12 Z" fill="var(--burgundy)"/></g>
          <line x1="12" y1="5" x2="12" y2="19" stroke="var(--navy)" stroke-width="1"/>
        </svg>`;
      container.appendChild(b);
    }
  });
}
createButterflies(".map-wrap", 8);
