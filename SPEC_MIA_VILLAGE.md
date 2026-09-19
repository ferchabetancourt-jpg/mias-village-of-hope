# SPEC_MIA_VILLAGE.md
Spec funcional — Mía's Village of Hope
Creado: 19 septiembre 2026, documentando el sitio tal como funciona hoy en el código (no un diseño previo — el `FLUJO_MIA_VILLAGE.md` original que el README viejo mencionaba nunca se encontró en el repo).

---

## 🎯 Qué es

Sitio estático de una sola página (`index.html`) con forma de "cuento ilustrado a mano": un mapa de aldea con 5 edificios-estación que se abren como ventanas modales. Pensado para la comunidad de Mía (familia, amigos, donantes) — no es una app SaaS ni tiene backend propio.

Dos páginas ocultas complementan el sitio público:
- `/actualizar` — para que Sonia actualice la lista de necesidades.
- `/guia` — guía de uso para la familia (cómo compartir el sitio, actualizar necesidades, etc.).

Ninguna de las dos aparece en el menú del sitio ni se enlaza desde `index.html`.

---

## 🗺️ Las 5 estaciones (`index.html`)

Cada una es un `<section class="modal-panel">` dentro de un único modal (`#village-modal`) que vive siempre en el DOM; solo se muestra/oculta con la clase `.active`. Se entra por dos caminos: tocando un hotspot sobre el mapa ilustrado, o desde el menú hamburguesa (☰) que siempre está disponible en el banner.

| Estación | id | Contenido |
|---|---|---|
| Meet Mía | `screen-meet-mia` | Resumen ("Mía loves: __"), audio de Mía, dos cartas colapsables ("To Mía" de Sonia, "To Sonia" de la abuela), botón a Needs |
| The Village | `screen-village` | Presentación de la comunidad, callout "Pray for Mía" (enlaza al post fijado de Facebook, sin backend propio de comentarios) |
| This Week's Needs | `screen-needs` | Lista en vivo de necesidades, ver sección de datos abajo |
| Collaborators | `screen-collaborators` | Tarjetas colapsables por colaborador (ej. Sonia Dueñas / música, Dra. Cabrera / Celpa Clinic), botón "¿Quieres unirte?" (mailto) |
| Contact | `screen-contact` | Redes (Facebook, WhatsApp, email), sección Trust & Transparency, botones de donación (GoFundMe real, Zelle pendiente) |

**Navegación dentro del modal** (`js/app.js`):
- `openModal(id)` — abre un panel, mueve el foco al botón de cerrar, re-procesa el embed de Instagram si aplica.
- Botones `.panel-nav` (Back / Next) cambian de panel sin cerrar el modal — recorren las 5 estaciones en el orden del camino del mapa, en loop (Contact → vuelve a Meet Mía).
- Trampa de foco (Tab) y Escape para cerrar — tanto el modal como el drawer del menú.
- Todo el texto vive en inglés en el HTML con atributos `data-en` / `data-es`; el botón de idioma (`#lang-toggle`) sobrescribe `textContent` de cada nodo marcado. Contenido que se genera dinámicamente después de ese barrido inicial (como Needs) escucha el evento custom `mia-lang-change` para re-renderizarse en el idioma activo.

**Onboarding**: 2 pantallas de contenido sobre un marco fijo (la foto no se mueve). Se muestra siempre salvo que el usuario marque "no volver a mostrar" (guardado en `localStorage`, key `mia_onboarding_hide`).

**Camino dorado + destellos**: solo decorativo, se dibuja con JS sobre `screen-home` a partir de coordenadas trazadas a mano sobre las imágenes del mapa (`TRACED_PATH` en `js/app.js`) — no tiene relación con datos ni lógica de negocio.

---

## 🔄 This Week's Needs — el único flujo de datos real del sitio

Es la única estación con datos dinámicos. No hay base de datos ni backend: la fuente de verdad es un **Google Form → Google Sheet publicado como CSV público**, leído directo desde el navegador con `fetch()` (`js/needs.js`, usado tanto en `index.html` como en `actualizar.html`).

**Flujo end to end:**
1. Sonia (o quien administre) abre `/actualizar` → completa el Google Form embebido ahí (iframe) para crear una necesidad nueva o actualizar una existente.
2. El Form escribe una fila nueva en el Google Sheet — nunca edita filas existentes, cada envío agrega una fila.
3. El Sheet está publicado a la web como CSV (`Archivo → Compartir → Publicar en la web`), URL pegada en `SHEET_CSV_URL` dentro de `js/needs.js`.
4. `loadNeeds()` hace `fetch(SHEET_CSV_URL)`, parsea el CSV con un parser propio (`parseCSV`, maneja campos con comillas) y llama a `mergeNeeds()`.

**Lógica de `mergeNeeds()` — por qué existe:**
El Form tiene dos flujos que escriben columnas distintas (crear necesidad nueva vs. actualizar una existente elegida de un dropdown). Cada envío es una fila nueva, así que una misma necesidad puede tener varias filas en el Sheet a lo largo del tiempo. `mergeNeeds()` agrupa todas las filas por nombre (normalizado a minúsculas) y se queda con el valor más reciente de cada campo (última fila que lo trae, gana) — así se arma **una sola tarjeta por necesidad**, sin duplicados.

Columnas esperadas del CSV (por posición, no por nombre de header):
`Timestamp | ¿Qué quieres hacer? | ¿Qué se necesita? | ¿Cuánto se necesita? | Cuánto se ha cubierto | ¿Cuál necesidad quieres actualizar? | ¿Cómo va esto? | Escribe la cantidad (cubierto a la fecha, flujo de actualización)`

De cada necesidad fusionada se calcula:
- `isCovered` — true si la columna de estado contiene la palabra "listo" (case-insensitive).
- `remainingAmt` — `max(0, needed − covered)`, nunca negativo.

**Render:** la lista se separa en dos secciones — "🟡 Still needed" primero, "✅ Covered" después — con un resumen arriba que solo cuenta cuántas necesidades están 100% cubiertas (no suma montos en dólares, porque las unidades no son homogéneas: puede ser dinero, comidas, tarjetas de regalo, etc.). Cada necesidad sin cubrir tiene un botón "I can help →" que abre un `mailto:` pre-llenado al correo de la Aldea.

**Estados posibles de `state.status`:** `loading` (inicial) → `setupPending` (si `SHEET_CSV_URL` sigue siendo el placeholder original) | `error` (fetch falló) | `empty` (CSV sin filas de datos) | `ready` (con necesidades).

---

## 🔐 Lo que este sitio NO tiene (a propósito, Fase 1)

- Sin backend ni base de datos propia — todo el estado dinámico vive en el Google Sheet.
- Sin autenticación — `/actualizar` y `/guia` están "ocultas" solo por no estar enlazadas ni en el menú (seguridad por oscuridad, no por control de acceso real). `actualizar.html` sí tiene `<meta name="robots" content="noindex, nofollow">` para no aparecer en buscadores.
- Sin moderación de comentarios — "Pray for Mía" delega los comentarios al post de Facebook, no hay sistema propio.
- Sin barra de progreso automática en Needs — aplazado a Fase 2 (ver `PENDIENTES_MIA_VILLAGE.md`), hoy solo se muestran los montos en texto.

---

## 🔒 REGLA DE CONTROL
Este documento describe el comportamiento real del código. Si el código cambia de forma que contradiga algo aquí, hay que actualizar este archivo en el mismo PR que cambia el comportamiento — no dejarlo desactualizado.

---
FIN DOCUMENTO
