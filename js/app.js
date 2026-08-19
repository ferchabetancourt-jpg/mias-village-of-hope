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

// Camino de luz dorada + destellos — solo en la pantalla del mapa
// (screen-home). Antes los destellos caían en posiciones al azar sobre
// todo el mapa (a veces flotando en el cielo o sobre los techos, sin
// relación con el camino ilustrado). Ahora se calculan a partir de las
// estaciones reales (.hotspot) de cada mapa: se traza un camino que las
// conecta en orden y los destellos se colocan sobre ese camino, igual
// que el brillo animado del SVG (.golden-path). Así ambos elementos
// quedan alineados con la ilustración en mobile y desktop, sin importar
// si las coordenadas de las estaciones cambian más adelante.
const SVG_NS = "http://www.w3.org/2000/svg";

// Estrella de 4 puntas (viewBox 0 0 24 24) para los destellos —
// "estrellitas brillantes", no círculos.
const SPARKLE_STAR_D = "M12 0 L14.5 9.5 L24 12 L14.5 14.5 L12 24 L9.5 14.5 L0 12 L9.5 9.5 Z";

function parsePercent(value) {
  return parseFloat(value) || 0;
}

// Cada hotspot cubre todo el edificio/estación (para que sea fácil de
// tocar), pero el camino ilustrado pasa por su base, no por el centro
// vertical de la caja. Por eso el punto se toma cerca del borde
// inferior del hotspot en vez de su centro exacto.
function hotspotCenters(wrap) {
  return [...wrap.querySelectorAll(".hotspot")].map(hotspot => {
    const left = parsePercent(hotspot.style.left);
    const top = parsePercent(hotspot.style.top);
    const width = parsePercent(hotspot.style.width);
    const height = parsePercent(hotspot.style.height);
    return { x: left + width / 2, y: top + height * 0.85 };
  });
}

// Punto medio entre dos estaciones, desplazado perpendicularmente para
// que el camino se sienta sinuoso en vez de una línea recta entre postes.
function jitteredMidpoint(a, b, sign) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const px = -dy / len;
  const py = dx / len;
  const jitter = 4; // % del ancho/alto del contenedor
  return { x: mx + px * jitter * sign, y: my + py * jitter * sign };
}

function pathPoints(centers) {
  const points = [];
  centers.forEach((center, i) => {
    points.push(center);
    if (i < centers.length - 1) {
      points.push(jitteredMidpoint(center, centers[i + 1], i % 2 === 0 ? 1 : -1));
    }
  });
  return points;
}

// Curva suave (Catmull-Rom convertida a Bézier cúbica) a través de los
// puntos, en vez de tramos rectos — evita el zig-zag anguloso que deja
// un trazo recto entre estación y punto medio.
function smoothPathD(points) {
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

function buildGoldenPath(wrap) {
  const rect = wrap.getBoundingClientRect();
  if (!rect.width || !rect.height) return; // oculto en este breakpoint

  wrap.querySelectorAll(".sparkle, .golden-path-svg").forEach(el => el.remove());

  const centers = hotspotCenters(wrap);
  if (centers.length < 2) return;
  const points = pathPoints(centers);
  const pixelPoints = points.map(p => ({ x: (p.x / 100) * rect.width, y: (p.y / 100) * rect.height }));

  // SVG con viewBox igual al tamaño real del contenedor, para que el
  // grosor del trazo no se distorsione entre mobile y desktop.
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("class", "golden-path-svg");
  svg.setAttribute("viewBox", `0 0 ${rect.width} ${rect.height}`);
  svg.setAttribute("aria-hidden", "true");

  const d = smoothPathD(pixelPoints);
  const path = document.createElementNS(SVG_NS, "path");
  path.setAttribute("class", "golden-path");
  path.setAttribute("d", d);
  // pathLength normaliza el largo del trazo a 100 unidades abstractas,
  // sin importar cuántos px mida en mobile vs. desktop — así el
  // stroke-dasharray:100 del CSS siempre dibuja el camino completo.
  path.setAttribute("pathLength", "100");
  svg.appendChild(path);
  wrap.appendChild(svg);

  points.forEach(p => {
    const s = document.createElementNS(SVG_NS, "svg");
    s.setAttribute("class", "sparkle");
    s.setAttribute("viewBox", "0 0 24 24");
    s.setAttribute("aria-hidden", "true");
    s.style.left = p.x.toFixed(1) + "%";
    s.style.top = p.y.toFixed(1) + "%";
    s.style.animationDelay = (Math.random() * 4).toFixed(2) + "s";
    s.style.animationDuration = (2 + Math.random() * 2).toFixed(2) + "s";
    const star = document.createElementNS(SVG_NS, "path");
    star.setAttribute("d", SPARKLE_STAR_D);
    s.appendChild(star);
    wrap.appendChild(s);
  });
}

function buildGoldenPaths() {
  document.querySelectorAll(".map-wrap").forEach(buildGoldenPath);
}

let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(buildGoldenPaths, 200);
});

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
  // El mapa recién tiene tamaño real una vez que screen-home queda
  // visible, así que el camino dorado y los destellos se construyen
  // justo aquí (antes, al correr en la carga inicial con el mapa
  // todavía oculto por el onboarding, medían 0×0 y no se dibujaban).
  if (id === "screen-home") buildGoldenPaths();
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
