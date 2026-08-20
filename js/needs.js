// This Week's Needs — reads live data from the Google Sheet.
//
// SETUP REQUIRED (one-time, in Google Sheets):
// 1. Open "Necesidades de Mía - Respuestas"
// 2. File → Share → Publish to web
// 3. Choose the response tab, format: Comma-separated values (.csv)
// 4. Copy the published URL and paste it below as SHEET_CSV_URL
//
// The Form has two flows that each add their own row: create a need, or
// update an existing one (picked from a dropdown that Apps Script keeps
// synced to the current list of names, so the name always matches
// exactly). mergeNeeds() below folds every row for the same name into
// one card, latest value per field wins.
//
// Expected columns: Timestamp, ¿Qué quieres hacer?, Qué se necesita?,
// ¿Cuánto se necesita?, Cuánto se ha cubierto, ¿Cuál necesidad quieres
// actualizar?, ¿Cómo va esto?, ¿Cuánto se ha cubierto en total? (update flow)

const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSYbKG2xq6Y8xt_Syk4joRGPVbAXc7yt3rMoctm7cLn821lCJ34P1xUUGhPQFOTpqchHpVPLSbfqSrZ/pub?gid=154502616&single=true&output=csv";

const NEEDS_TEXT = {
  setupPending: { en: "Needs will appear here once the list is connected. (Setup pending)", es: "Las necesidades aparecerán aquí en cuanto se conecte la lista. (Configuración pendiente)" },
  none: { en: "No needs posted this week. Check back soon 💛", es: "No hay necesidades publicadas esta semana. Vuelve pronto 💛" },
  error: { en: "Needs will appear here once the list is connected.", es: "Las necesidades aparecerán aquí en cuanto se conecte la lista." },
  stillNeededSection: { en: "🟡 Still needed", es: "🟡 Todavía se necesita" },
  coveredSection: { en: "✅ Already covered — thank you!", es: "✅ Ya cubierto — ¡gracias!" },
  stillNeededLabel: { en: "🟡 Still needed", es: "🟡 Todavía se necesita" },
  coveredLabel: { en: "✅ Covered — thank you!", es: "✅ Cubierto — ¡gracias!" },
  needed: { en: "needed", es: "necesario" },
  coveredSoFar: { en: "covered so far", es: "cubierto hasta ahora" },
  remaining: { en: "remaining", es: "falta" },
  helpBtn: { en: "I can help →", es: "Puedo ayudar →" },
  summaryOne: { en: "need fully covered — thank you! 💛", es: "necesidad totalmente cubierta — ¡gracias! 💛" },
  summaryMany: { en: "needs fully covered — thank you! 💛", es: "necesidades totalmente cubiertas — ¡gracias! 💛" },
};

function t(key, lang) {
  const entry = NEEDS_TEXT[key];
  return (entry && entry[lang]) || entry.en;
}

function activeLang() {
  return window.miaLang || "en";
}

// Single source of truth for what #needs-list should show right now —
// render() reads it, loadNeeds() and the language-change listener are
// the only things that write it.
let state = { status: "loading" };

function render() {
  const container = document.getElementById("needs-list");
  if (!container || state.status === "loading") return;
  const lang = activeLang();

  if (state.status === "setupPending") {
    container.innerHTML = `<p class="needs-empty">${t("setupPending", lang)}</p>`;
  } else if (state.status === "error") {
    container.innerHTML = `<p class="needs-empty">${t("error", lang)}</p>`;
  } else if (state.status === "empty") {
    container.innerHTML = `<p class="needs-empty">${t("none", lang)}</p>`;
  } else if (state.status === "ready") {
    const stillNeeded = state.needs.filter(n => !n.isCovered);
    const covered = state.needs.filter(n => n.isCovered);
    const sections = [
      stillNeeded.length ? sectionHTML(t("stillNeededSection", lang), stillNeeded, lang) : "",
      covered.length ? sectionHTML(t("coveredSection", lang), covered, lang) : ""
    ].join("");
    container.innerHTML = summaryHTML(covered.length, lang) + sections;
  }
}

document.addEventListener("mia-lang-change", render);

async function loadNeeds() {
  if (SHEET_CSV_URL.startsWith("PLACEHOLDER")) {
    state = { status: "setupPending" };
    render();
    return;
  }

  try {
    const res = await fetch(SHEET_CSV_URL);
    const text = await res.text();
    const rows = parseCSV(text);
    const dataRows = rows.slice(1).filter(r => r.length > 1);
    const needs = mergeNeeds(dataRows);
    state = needs.length ? { status: "ready", needs } : { status: "empty" };
    render();
  } catch (err) {
    state = { status: "error" };
    render();
    console.error("Could not load needs sheet:", err);
  }
}

function parseMoney(value) {
  return parseFloat(String(value || "").replace(/[^0-9.-]/g, "")) || 0;
}

// Folds every CSV row into one merged need per name (see header note).
// Rows are processed in sheet order (= submission order), so later rows
// simply overwrite earlier ones field by field.
function mergeNeeds(rows) {
  const order = [];
  const map = new Map();

  rows.forEach(row => {
    const name = (row[2] || row[5] || "").trim();
    if (!name) return;
    const key = name.toLowerCase();
    if (!map.has(key)) {
      map.set(key, { name, needed: "", covered: "", status: "" });
      order.push(key);
    }
    const need = map.get(key);
    if (row[2]) need.name = row[2].trim();
    if (row[3]) need.needed = row[3];
    if (row[4]) need.covered = row[4];
    if (row[7]) need.covered = row[7]; // update flow: covered-to-date, same signal as row[4]
    if (row[6]) need.status = row[6];
  });

  return order.map(key => {
    const n = map.get(key);
    const isCovered = (n.status || "").toLowerCase().includes("listo");
    const neededAmt = parseMoney(n.needed);
    const coveredAmt = parseMoney(n.covered);
    return {
      name: n.name,
      isCovered,
      neededAmt,
      coveredAmt,
      remainingAmt: Math.max(0, neededAmt - coveredAmt),
    };
  });
}

function mailtoForNeed(name, lang) {
  const subjectText = lang === "es" ? `Puedo ayudar con: ${name}` : `I can help with: ${name}`;
  const bodyText = lang === "es"
    ? `¡Hola! Me gustaría ayudar con esta necesidad de la Aldea de Mía:\n\n${name}\n\n`
    : `Hi! I'd like to help with this need for Mía's Village:\n\n${name}\n\n`;
  return `mailto:miasvillageofhope@gmail.com?subject=${encodeURIComponent(subjectText)}&body=${encodeURIComponent(bodyText)}`;
}

// Summary above the list: how many needs are fully covered this week —
// no dollar total, since needs can be counted in different units (gift
// card dollars, number of meals, etc.) and summing those would be
// meaningless.
function summaryHTML(coveredCount, lang) {
  if (coveredCount === 0) return "";
  const word = t(coveredCount === 1 ? "summaryOne" : "summaryMany", lang);
  return `<p class="needs-summary">${coveredCount} ${word}</p>`;
}

function sectionHTML(title, needs, lang) {
  return `
    <p class="needs-section-title">${title}</p>
    ${needs.map(n => needToCardHTML(n, lang)).join("")}
  `;
}

function needToCardHTML(need, lang) {
  const label = need.isCovered ? t("coveredLabel", lang) : t("stillNeededLabel", lang);

  const amountParts = [];
  if (need.neededAmt > 0) amountParts.push(`${need.neededAmt} ${t("needed", lang)}`);
  if (need.coveredAmt > 0) amountParts.push(`${need.coveredAmt} ${t("coveredSoFar", lang)}`);
  if (!need.isCovered && need.remainingAmt > 0) amountParts.push(`${need.remainingAmt} ${t("remaining", lang)}`);
  const amounts = amountParts.length
    ? `<div class="need-amounts">${amountParts.join(" · ")}</div>`
    : "";

  const helpBtn = need.isCovered
    ? ""
    : `<a class="need-help-btn" href="${mailtoForNeed(need.name, lang)}">${t("helpBtn", lang)}</a>`;

  return `
    <div class="need-item ${need.isCovered ? "covered" : ""}">
      <div class="need-main">
        <span class="need-title">${need.name}</span>
        <span class="need-status">${label}</span>
      </div>
      ${amounts}
      ${helpBtn}
    </div>
  `;
}

// Minimal CSV parser (handles quoted fields)
function parseCSV(text) {
  const rows = [];
  let row = [], field = "", inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') { inQuotes = false; }
      else { field += c; }
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ',') { row.push(field); field = ""; }
      else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ""; }
      else if (c !== '\r') { field += c; }
    }
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows;
}

loadNeeds();
