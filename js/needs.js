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

    container.innerHTML = needs.map(rowToNeedHTML).join("");
  } catch (err) {
    container.innerHTML = `<p class="needs-empty">Needs will appear here once the list is connected.</p>`;
    console.error("Could not load needs sheet:", err);
  }
}

function rowToNeedHTML(row) {
  const [, , item, needed, covered, , status, remaining] = row;
  const isCovered = (status || "").toLowerCase().includes("listo");
  const label = isCovered ? "✅ Covered — thank you!" : `🟡 Still needed${remaining ? " — $" + remaining : ""}`;
  return `
    <div class="need-item ${isCovered ? "covered" : ""}">
      <span>${item || ""}</span>
      <span class="need-status">${label}</span>
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
