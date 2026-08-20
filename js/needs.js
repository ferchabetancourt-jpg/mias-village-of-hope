// This Week's Needs — reads live data from the Google Sheet.
//
// SETUP REQUIRED (one-time, in Google Sheets):
// 1. Open "Necesidades de Mía - Respuestas"
// 2. File → Share → Publish to web
// 3. Choose the response tab, format: Comma-separated values (.csv)
// 4. Copy the published URL and paste it below as SHEET_CSV_URL

const SHEET_CSV_URL = "PLACEHOLDER_PUBLISH_TO_WEB_CSV_URL";

async function loadNeeds() {
  const container = document.getElementById("needs-list");

  if (SHEET_CSV_URL.startsWith("PLACEHOLDER")) {
    container.innerHTML = `<p class="needs-empty">
      Needs will appear here once the list is connected. (Setup pending)
    </p>`;
    return;
  }

  try {
    const res = await fetch(SHEET_CSV_URL);
    const text = await res.text();
    const rows = parseCSV(text);

    // Expected columns from the Form:
    // Timestamp, ¿Qué quieres hacer?, Qué se necesita?, ¿Cuánto se necesita?,
    // Cuánto se ha cubierto, ¿Cuál necesidad quieres actualizar?, ¿Cómo va esto?, ¿Cuánto falta?
    const needs = rows.slice(1).filter(r => r.length > 1);

    if (needs.length === 0) {
      container.innerHTML = `<p class="needs-empty">No needs posted this week. Check back soon 💛</p>`;
      return;
    }

    const stillNeeded = needs.filter(row => !isNeedCovered(row));
    const covered = needs.filter(isNeedCovered);
    const sections = [
      stillNeeded.length ? sectionHTML("🟡 Still needed", stillNeeded) : "",
      covered.length ? sectionHTML("✅ Already covered — thank you!", covered) : ""
    ].join("");

    container.innerHTML = summaryHTML(needs) + sections;
  } catch (err) {
    container.innerHTML = `<p class="needs-empty">Needs will appear here once the list is connected.</p>`;
    console.error("Could not load needs sheet:", err);
  }
}

function parseMoney(value) {
  return parseFloat(String(value || "").replace(/[^0-9.-]/g, "")) || 0;
}

function isNeedCovered(row) {
  return (row[6] || "").toLowerCase().includes("listo");
}

// Resumen arriba de la lista: cuántas necesidades ya se cubrieron y
// cuánto se ha recogido en total esta semana — en texto simple, sin
// barra de progreso (eso queda para Fase 2).
function summaryHTML(needs) {
  const coveredCount = needs.filter(isNeedCovered).length;
  const totalCovered = needs.reduce((sum, row) => sum + parseMoney(row[4]), 0);
  if (coveredCount === 0 && totalCovered === 0) return "";
  const needWord = coveredCount === 1 ? "need" : "needs";
  return `<p class="needs-summary">${coveredCount} ${needWord} fully covered — $${totalCovered.toFixed(0)} raised so far this week 💛</p>`;
}

function mailtoForNeed(item) {
  const subject = encodeURIComponent(`I can help with: ${item}`);
  const body = encodeURIComponent(`Hi! I'd like to help with this need for Mía's Village:\n\n${item}\n\n`);
  return `mailto:miasvillageofhope@gmail.com?subject=${subject}&body=${body}`;
}

// Groups needs into two clearly-labeled sections so a visitor sees at a
// glance what's still open vs. what's already covered, instead of reading
// each row's status one by one.
function sectionHTML(title, rows) {
  return `
    <p class="needs-section-title">${title}</p>
    ${rows.map(rowToNeedHTML).join("")}
  `;
}

function rowToNeedHTML(row) {
  const [, , item, needed, covered, , status, remaining] = row;
  const isCovered = isNeedCovered(row);
  const label = isCovered ? "✅ Covered — thank you!" : "🟡 Still needed";

  const amountParts = [];
  if (needed) amountParts.push(`$${needed} needed`);
  if (covered) amountParts.push(`$${covered} covered so far`);
  if (!isCovered && remaining) amountParts.push(`$${remaining} remaining`);
  const amounts = amountParts.length
    ? `<div class="need-amounts">${amountParts.join(" · ")}</div>`
    : "";

  const helpBtn = isCovered
    ? ""
    : `<a class="need-help-btn" href="${mailtoForNeed(item || "")}">I can help →</a>`;

  return `
    <div class="need-item ${isCovered ? "covered" : ""}">
      <div class="need-main">
        <span class="need-title">${item || ""}</span>
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
