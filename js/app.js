// App-style navigation: hotspots open a modal window over the map.
const modal = document.getElementById("village-modal");
const panels = document.querySelectorAll(".modal-panel");
const hotspots = document.querySelectorAll(".hotspot");
const closers = document.querySelectorAll("[data-close]");

// Keeps Tab cycling inside an open overlay (modal or menu drawer)
// instead of leaking focus out to whatever sits behind it.
// Filtered by offsetParent (excludes display:none) because .village-modal
// holds all 5 station panels at once — only one is .active at a time,
// so querySelectorAll alone would also match buttons in the hidden ones.
function trapFocus(e, container) {
  const focusable = [...container.querySelectorAll(
    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )].filter(el => el.offsetParent !== null);
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

let modalLastFocus = null;

function openModal(id) {
  modalLastFocus = document.activeElement;
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
  // Foco entra al modal (botón cerrar) en vez de quedarse en el hotspot
  // que ya no es visible detrás del overlay.
  const closeBtn = modal.querySelector(".modal-close");
  if (closeBtn) closeBtn.focus();
}

function closeModal() {
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  if (modalLastFocus) modalLastFocus.focus();
}

hotspots.forEach(btn => {
  btn.addEventListener("click", () => openModal(btn.dataset.target));
});

closers.forEach(btn => {
  btn.addEventListener("click", closeModal);
});

// Navegación entre paneles sin cerrar el modal (ej. botón "Ways to help"
// dentro de Meet Mía, y los botones "Next" al fondo de cada estación).
document.querySelectorAll(".panel-nav").forEach(btn => {
  btn.addEventListener("click", () => {
    panels.forEach(p => p.classList.remove("active"));
    const target = document.getElementById(btn.dataset.target);
    if (target) target.classList.add("active");
    const scrollArea = modal.querySelector(".village-modal-scroll");
    if (scrollArea) scrollArea.scrollTop = 0;
    // Mueve el foco al inicio del panel nuevo (botón "Back"), igual que
    // openModal — si no, el foco queda en un botón "Next" que ya no
    // está visible dentro del panel anterior.
    const backBtn = target && target.querySelector(".back-btn");
    if (backBtn) backBtn.focus();
  });
});

// STATION MENU — hamburger drawer with the 5 stations. Stays reachable
// even while a station panel is open (app-banner sits above .village-modal
// in z-index for exactly this reason), so it always opens fresh via
// openModal() rather than assuming a panel is already showing.
const menuToggle = document.getElementById("menu-toggle");
const stationMenu = document.getElementById("station-menu");
const menuBackdrop = document.getElementById("menu-backdrop");
const menuClosers = document.querySelectorAll("[data-menu-close]");
const menuLinks = document.querySelectorAll(".station-menu-link");
let menuLastFocus = null;

function openMenu() {
  menuLastFocus = document.activeElement;
  stationMenu.classList.add("active");
  stationMenu.setAttribute("aria-hidden", "false");
  // El drawer se oculta con transform (no display:none) para poder
  // animarlo, así que aria-hidden solo no basta — sin inert, sus
  // botones seguían alcanzables con Tab incluso fuera de pantalla.
  stationMenu.inert = false;
  menuBackdrop.classList.add("active");
  menuToggle.setAttribute("aria-expanded", "true");
  const first = stationMenu.querySelector(".station-menu-link");
  if (first) first.focus();
}

function closeMenu() {
  stationMenu.classList.remove("active");
  stationMenu.setAttribute("aria-hidden", "true");
  stationMenu.inert = true;
  menuBackdrop.classList.remove("active");
  menuToggle.setAttribute("aria-expanded", "false");
  if (menuLastFocus) menuLastFocus.focus();
}

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    if (stationMenu.classList.contains("active")) closeMenu();
    else openMenu();
  });
}

menuClosers.forEach(btn => {
  btn.addEventListener("click", closeMenu);
});

menuLinks.forEach(btn => {
  btn.addEventListener("click", () => {
    closeMenu();
    openModal(btn.dataset.target);
  });
});

// Escape closes whichever overlay is on top (menu first, since it can
// open over an already-open modal); Tab stays trapped inside it.
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (stationMenu.classList.contains("active")) { closeMenu(); return; }
    if (modal.classList.contains("active")) { closeModal(); return; }
  }
  if (e.key === "Tab") {
    if (stationMenu.classList.contains("active")) trapFocus(e, stationMenu);
    else if (modal.classList.contains("active")) trapFocus(e, modal);
  }
});

// Language toggle (EN default, ES on tap)
let currentLang = "en";
const langBtn = document.getElementById("lang-toggle");
const translatable = document.querySelectorAll("[data-en]");
const translatableAria = document.querySelectorAll("[data-aria-en]");

function applyLang(lang) {
  translatable.forEach(el => {
    el.textContent = el.dataset[lang];
  });
  translatableAria.forEach(el => {
    el.setAttribute("aria-label", lang === "en" ? el.dataset.ariaEn : el.dataset.ariaEs);
  });
  langBtn.textContent = lang === "en" ? "ES" : "EN";
  document.documentElement.lang = lang;
  // Lets scripts outside this static sweep (needs.js renders its content
  // dynamically, after this NodeList snapshot was taken) know the language
  // changed so they can re-render themselves in the new language.
  window.miaLang = lang;
  document.dispatchEvent(new CustomEvent("mia-lang-change", { detail: { lang } }));
}

langBtn.addEventListener("click", () => {
  currentLang = currentLang === "en" ? "es" : "en";
  applyLang(currentLang);
});

// Audio de Mía — play/pause, sin autoplay. Hay dos botones (arriba y
// abajo de la historia) controlando el mismo <audio>, por eso se usa
// una clase en vez de un id y se sincronizan los íconos de ambos.
const miaAudio = document.getElementById("mia-audio");
const miaAudioBtns = document.querySelectorAll(".mia-audio-btn");
if (miaAudio && miaAudioBtns.length) {
  const icons = [...miaAudioBtns].map(btn => btn.querySelector(".mia-audio-icon"));
  const setIcon = text => icons.forEach(icon => { icon.textContent = text; });
  miaAudioBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      if (miaAudio.paused) {
        miaAudio.play();
        setIcon("⏸️");
      } else {
        miaAudio.pause();
        setIcon("🔊");
      }
    });
  });
  miaAudio.addEventListener("ended", () => setIcon("🔊"));
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

// Coordenadas trazadas a mano sobre el camino de piedra real de cada
// ilustración del mapa (medidas con una grilla sobre village-map-mobile.png
// y village-map-desktop.png, no calculadas desde los hotspots). Se usan
// SOLO para la línea/pulso del camino — los destellos siguen anclados a
// los hotspots (hotspotCenters/pathPoints), sin cambios.
// [x%, y%] en el sistema de coordenadas de cada imagen completa.
// Trade-off: si se rediseña el mapa, hay que volver a trazar esto.
const TRACED_PATH = {
  mobile: [
    [47.5,22.0],[48.0,24.2],[43.4,25.5],[34.7,26.6],[24.3,27.2],[16.2,27.5],
    [8.7,28.6],[5.8,30.8],[7.5,33.5],[14.5,35.2],[23.1,35.7],[31.8,36.0],
    [39.4,36.5],[45.1,37.9],[48.0,40.1],[46.3,42.0],[53.2,42.8],[60.2,43.4],
    [55.6,46.7],[46.3,49.4],[38.2,51.6],[32.4,57.7],[25.5,63.2],[23.1,68.1],
    [17.4,70.8],[11.6,74.1],[15.0,76.3],[32.4,74.1],[49.0,73.0],[60.2,70.8],
    [67.1,69.2],[70.6,73.0],[72.3,78.0],[73.0,82.4],[73.0,84.6]
  ],
  desktop: [
    [23.33,45.16],[22.43,48.88],[17.94,52.07],[14.35,54.73],[11.96,56.32],
    [13.46,58.45],[17.94,59.51],[23.33,58.98],[28.41,57.39],[32.89,55.79],
    [37.38,53.13],[40.37,51.01],[40.67,56.32],[44.86,57.92],[49.04,60.57],
    [53.83,61.64],[56.82,58.98],[57.84,59.19],[61.79,60.89],[65.79,62.38],
    [69.80,63.02],[72.79,63.76],[76.73,62.70],[80.74,61.32],[84.75,62.17],
    [88.70,62.70],[87.92,69.07],[85.53,74.39],[84.03,76.41]
  ]
};

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

// Punto sobre el segmento a-b (en la fracción t), desplazado
// perpendicularmente para que el camino se sienta sinuoso en vez de una
// línea recta entre estaciones.
function jitteredPoint(a, b, t, sign) {
  const mx = a.x + (b.x - a.x) * t;
  const my = a.y + (b.y - a.y) * t;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const px = -dy / len;
  const py = dx / len;
  const jitter = 4; // % del ancho/alto del contenedor
  return { x: mx + px * jitter * sign, y: my + py * jitter * sign };
}

// Tres puntos intermedios por tramo (en vez de dos) para que haya más
// destellos a lo largo del camino — antes eran 9, luego 13, ahora 17.
// Siguen anclados cerca del camino a propósito: si se reparten por
// todo el mapa vuelven a caer sobre el cielo o los techos, donde no
// se notan.
function pathPoints(centers) {
  const points = [];
  centers.forEach((center, i) => {
    points.push(center);
    if (i < centers.length - 1) {
      const next = centers[i + 1];
      const sign = i % 2 === 0 ? 1 : -1;
      points.push(jitteredPoint(center, next, 0.25, sign));
      points.push(jitteredPoint(center, next, 0.5, -sign));
      points.push(jitteredPoint(center, next, 0.75, sign));
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

  wrap.querySelectorAll(".sparkle, .golden-path-svg, .golden-pulse").forEach(el => el.remove());

  const centers = hotspotCenters(wrap);
  if (centers.length < 2) return;
  // Los destellos siguen anclados a los hotspots (sin cambios).
  const points = pathPoints(centers);

  // La línea/pulso, en cambio, sigue el camino real trazado a mano
  // sobre la ilustración (TRACED_PATH) — no los puntos de arriba.
  const tracedKey = wrap.classList.contains("map-wrap-desktop") ? "desktop" : "mobile";
  const tracedPixelPoints = TRACED_PATH[tracedKey].map(([x, y]) => ({
    x: (x / 100) * rect.width,
    y: (y / 100) * rect.height
  }));

  // SVG con viewBox igual al tamaño real del contenedor, para que el
  // grosor del trazo no se distorsione entre mobile y desktop.
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("class", "golden-path-svg");
  svg.setAttribute("viewBox", `0 0 ${rect.width} ${rect.height}`);
  svg.setAttribute("aria-hidden", "true");

  const d = smoothPathD(tracedPixelPoints);
  const path = document.createElementNS(SVG_NS, "path");
  path.setAttribute("class", "golden-path");
  path.setAttribute("d", d);
  // pathLength normaliza el largo del trazo a 100 unidades abstractas,
  // sin importar cuántos px mida en mobile vs. desktop — así el
  // stroke-dasharray:100 del CSS siempre dibuja el camino completo.
  path.setAttribute("pathLength", "100");
  svg.appendChild(path);
  wrap.appendChild(svg);

  // Punto de luz que viaja en loop por el mismo trazo — el efecto de
  // movimiento visible que conecta las 5 estaciones (no solo la línea
  // estática de fondo).
  const pulse = document.createElement("span");
  pulse.className = "golden-pulse";
  pulse.style.offsetPath = `path('${d}')`;
  wrap.appendChild(pulse);

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

const onboardingFrame = document.querySelector(".onboarding-frame");

function showOnboardingStep(id) {
  document.querySelectorAll(".onboarding-step").forEach(s => s.classList.remove("active"));
  const target = document.getElementById(id);
  if (target) target.classList.add("active");
  // El pulso alrededor del marco solo corre en el paso 1 (primera
  // impresión). Se controla con una clase por JS en vez de un
  // selector :has() en CSS: :has() no lo soportan todos los
  // navegadores, y ahí la regla entera se invalida sin aviso. La clase
  // va en el contenedor (.onboarding-frame), no en la imagen, porque
  // el anillo que se expande es un ::before del contenedor.
  if (onboardingFrame) {
    onboardingFrame.classList.toggle("frame-pulse", id === "onboarding-step-1");
  }
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

// El paso 1 ya viene marcado "active" en el HTML estático, pero el
// pulso del marco depende de la clase que pone esta función — sin
// esta llamada no arranca hasta el primer click en "Enter".
showOnboardingStep("onboarding-step-1");

// Decide what to show first, as soon as the script runs.
if (localStorage.getItem(ONBOARDING_HIDE_KEY) === "true") {
  showTopScreen("screen-home");
} else {
  showTopScreen("screen-onboarding");
}
