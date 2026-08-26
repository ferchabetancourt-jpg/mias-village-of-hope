# PENDIENTES_MIA_VILLAGE.md
Ruta de pendientes — Proyecto "Mía's Village of Hope"
Última actualización: 20 agosto 2026
Meta de entrega: lunes 24 agosto 2026

---

## ✅ YA RESUELTO

- Onboarding: 3 pasos, marco fijo (foto no se mueve), checkbox "no volver a mostrar"
- Foto Polaroid en 4 estaciones (Village, Needs, Collaborators, Contact)
- Íconos reales de las 5 estaciones (reemplazan emojis)
- Paleta de marca oficial + jerarquía tipográfica → `IDENTIDAD_VISUAL_MIA_VILLAGE.md`

---

## 🟡 SONIA — pendientes

- [ ] Cuenta de Zelle (junto con mensaje de confianza para mostrarlo)
- [ ] Texto corto aprobado de Celpa Clinic
- [x] Info para sección Trust: quién administra, cómo llega la ayuda, quién es la familia, qué gastos cubre — completado 19 agosto: Sonia Celpa (abuela, dueña de Celpa Clinic) como responsable; gastos = traslados/alimentación/médicos no cubiertos por seguro; ayuda llega vía tarjetas de regalo, domicilios, tarjetas con dinero, GoFundMe y Zelle; frase "Managed by Mía's family and close friends" incluida
- [x] Link del Google Sheet publicado como CSV conectado en `js/needs.js` (20 agosto) — falta que Sonia cargue contenido real
- [ ] Mínimo 2-3 necesidades reales cargadas en el Google Form
- ~~Columna "¿es urgente?" en el Google Form~~ — ya no se necesita, se aceptó el sustituto visual "🟡 Still needed" / "✅ Covered" en su lugar (20 agosto)

---

## 🟡 FERCHA — pendientes

- [x] Link WhatsApp — Ok
- [x] Link Facebook — Ok
- [x] Crear cuenta GoFundMe — `gofund.me/6da1fd27a`, ya conectado en Contact y en `/guia`
- [x] Crear cuenta Gmail (para el botón de contacto) — miasvillageofhope@gmail.com
- [ ] Tener a la mano el link de Behance (para el copyright de Contact)
- [x] Reel para redes — integrado como nueva sección "El Reel de la Aldea" dentro de `/guia`: link al video (Drive, con nota de que hay que descargarlo antes de subirlo a IG/TikTok), copy sugerido + hashtags, todo copiable de un toque
- [x] Guía de entrega para la familia — se hizo como página web (`/guia`) en vez de PDF: paleta del proyecto, links de la Aldea, explicación paso a paso de cómo actualizar necesidades, y cómo guardar accesos directos en el teléfono. Oculta (no aparece en el menú ni se enlaza desde el sitio), igual que `/actualizar`.

---

## 🔧 CÓDIGO — orden de trabajo

### Bloque 1 — Fundamento ✅
- [x] Paleta de colores oficial (verde/burgundy/gold)
- [x] Jerarquía tipográfica documentada

### Bloque 2 — Efecto wow ✅ COMPLETADO (19 agosto 2026)
- [x] Arreglar bug de los destellos (se veían como bolotas amarillas, casi no aparecían) — rediseñados como estrellitas SVG (núcleo blanco + drop-shadow dorado), tamaño y opacidad ajustados para visibilidad real
- [x] Rediseñar destellos como estrellitas brillantes (blanco + brillo dorado)
- [x] Camino de luz dorada conectando las 5 estaciones al cargar el mapa — línea base se dibuja una vez + punto de luz viajero en loop continuo (offset-path)
- [x] Pulso de luz dorada alrededor del marco en onboarding pantalla 1 — controlado por JS (no `:has()`, por compatibilidad de navegador)

**Nota de aprobación:** el trazo del camino se digitalizó a mano sobre el sendero de piedra real de la ilustración (mobile y desktop) para que el pulso lo siga con fidelidad. No quedó exacto al 100%, pero mejoró notablemente frente a la curva calculada original — aprobado por Fercha así, sin necesidad de mayor ajuste.

### Bloque 3 — Estructura y contenido de estaciones ✅ COMPLETADO (19 agosto 2026)
- [x] Meet Mía: quitar foto fija (sticky), volver a scroll normal
- [x] Meet Mía: dos secciones — "Resumen" (formato "Mía loves: __, __, __") y "Escrito de Sonia" (historia larga)
- [x] Meet Mía: botón final a This Week's Needs ("Ways to help" / "How to help") — también agregado justo después del Resumen
- [x] Sección Trust nueva — completa, ver contenido en pendientes de Sonia arriba
- [x] This Week's Needs: botón/etiqueta "I can help" por necesidad
- [x] This Week's Needs: "most urgent" resuelto vía estado "🟡 Still needed" vs. "✅ Covered" (sustituto aceptado, no requiere columna nueva del Form)
- [x] This Week's Needs: mostrar también necesidades cumplidas + valor recogido
- [x] Collaborators: resumen corto → lleva al detalle de cada colaborador
- [x] Contact: separar visualmente íconos de redes sociales vs. botones de donación
- [x] Onboarding pantalla 1: texto bajo la foto (sin sonar a lástima) + tono más serio/confiable

**Nota:** implementado en 3 commits (`Bloque 3: Meet Mía, Trust, Needs, Collaborators, Contact, onboarding`, `Bloque 3 round 2: ajustes de feedback`, `Meet Mía: botones también después del Resumen`), ya en `main`.

### Bloque 4 — Navegación y accesibilidad ✅ COMPLETADO (20 agosto 2026)
- [x] Labels flotantes sobre cada estación del mapa (mobile y desktop)
- [x] Menú hamburguesa (☰) en el banner con las 5 estaciones — siempre disponible, incluso con un panel de estación abierto
- [x] Botón "Next" (flecha con diseño propio) entre estaciones, en orden del camino del mapa, con loop de Contact de vuelta a Meet Mía
- [x] Accesibilidad: alt del mapa nombra las 5 estaciones; foco entra/sale del modal y del menú correctamente (trampa de Tab + restaura el foco al cerrar); `--gold-text` (oro oscurecido, ≥4.5:1) para el eyebrow y el outline de foco, sin tocar el gold decorativo
- [ ] Mejorar el emblema (muy complicado, no se ve bien en FB/WhatsApp) — sigue en baja prioridad, sin tocar

---

## 🏁 ÚLTIMOS PENDIENTES — última ronda antes del lanzamiento (20 agosto)

### Código ✅ COMPLETADO (20 agosto 2026)
- [x] Bug: quitar pantalla 2 duplicada del onboarding (NO la 1) — Step 2 repetía el texto del Step 1 sin aportar nada; onboarding pasó de 3 a 2 pantallas de contenido
- [x] Botón "siguiente estación": mover arriba, extremo opuesto al botón "volver" — ahora viven en una fila (`.panel-topbar`), mismo estilo de pill que "Volver", etiqueta corta ("Back"/"Next") con el texto completo como `aria-label` para que no queden apretados en mobile. Además, "Volver" ahora navega a la estación anterior en el orden del camino (no cierra el modal) — cerrar al mapa queda solo en la ✕
- [x] Foto de Mía por estación: agrandar (mismo alto vertical que el título) — tamaño fijo (108px, 84px en <380px), centrada verticalmente contra el bloque de título
- [x] Fondo de las estaciones: cambiar de crema a verde pálido (`--green` #EAF3C9), igual que el fondo del mapa — variable `--green` creada (no existía en el CSS pese a estar documentada); solo el fondo general cambia, las tarjetas internas (village-card, need-item, trust-card, collaborator-card) se quedan blancas/crema para resaltar como tarjetas
- [x] Meet Mía: texto del botón cambia a "The Village Needs" / "La Aldea Necesita" (mismo link)
- [x] This Week's Needs: rediseño de claridad — `js/needs.js` ahora agrupa "🟡 Still needed" primero y "✅ Covered" después con encabezados de sección, en vez de mezclar el orden del CSV. Nota: `/actualizar.html` (lista + formulario lado a lado para Sonia) ya existía en el código, no estaba marcado aquí — confirmado con Fercha.
- [x] This Week's Needs — bugs encontrados con datos reales (20 agosto, ronda 2): (1) cada necesidad generaba una tarjeta por cada fila del Form (crear + cada actualización) — ahora se fusionan por nombre, valor más reciente de cada campo gana, "remaining" se calcula (needed − covered) en vez de leerse directo del sheet; (2) se quitó el "$" fijo de los montos — el resumen de arriba ya no suma montos heterogéneos, solo cuenta necesidades cubiertas; (3) el contenido dinámico de Needs ahora respeta el idioma activo del sitio (antes quedaba fijo en inglés)
- [x] Collaborators: botón "¿Quieres unirte?" debajo del título, link a mailto:miasvillageofhope@gmail.com
- [x] Contact: agregar links de Facebook y WhatsApp — Facebook `facebook.com/profile.php?id=61593459297860`, WhatsApp `chat.whatsapp.com/ECNqCHebKnv8JJXzsBJNhq`; GoFundMe y Zelle quedan en placeholder hasta que existan las cuentas
- [x] Copyright discreto "© María Fernanda Betancourt" — agregado al final de Contact y al pie de `/guia`. Falta solo el link a Behance (bloqueado hasta tener el link a mano)
- [x] `/guia` y `/actualizar` — cada uno con su propio ícono al agregar a inicio (libro+cinta y canasta "NEEDS", respectivamente), en vez de compartir el de la Aldea. Además: bug preexistente arreglado — `.banner-emblem` en `/actualizar` no tenía regla de tamaño en el CSS y se renderizaba gigante (`emblem.png` a 1254px nativo); y `emblem.png` se actualizó al diseño de marca actual (cinta + casitas + logo).
- [x] `/guia` — ronda de ajustes (22 agosto): los 2 links de "actualizar necesidades" apuntaban al formulario suelto en vez de a `/actualizar` (el link directo queda solo como respaldo); se agregó explicación de cómo hacer tocable el link del reel al postearlo en IG/TikTok (link en bio propia, primer comentario, o DM); mensaje listo para copiar e invitar a alguien a la Aldea por WhatsApp; se quitó el copyright del footer.
- [x] The Village: callout "Pray for Mía" con link al post fijado de Facebook donde la gente deja oraciones en los comentarios — Fase 1, sin moderación ni backend nuevo. Vive dentro de la estación The Village existente (no se tocó el mapa ni el menú — una estación nueva de verdad requeriría arte nuevo para un 6to edificio ilustrado).
- [x] GoFundMe conectado (`gofund.me/6da1fd27a`) — placeholder de Contact reemplazado por el link real; en `/guia` la tarjeta pasó de "Próximamente" a link real, con nota de que la info de pagos (GoFundMe, Zelle, bancos) se puede actualizar escribiendo al correo de la Aldea. Zelle sigue pendiente.
- [x] Contact: botón de Zelle roto arreglado — tenía `href="PLACEHOLDER_ZELLE_INFO"` (llevaba a un 404); ahora es un elemento sin link, atenuado, con etiqueta "Coming soon" / "Próximamente".
- [x] Copyright discreto agregado (Contact + pie de `/guia`) — texto final: "Website & Creative Design © María Fernanda Betancourt" (precisado para no insinuar autoría sobre la historia/idea, que es de Sonia). Falta solo el link a Behance.
- [x] Meet Mía: dos cartas colapsables después del Resumen y "The Village Needs" — "To Mía" (el "Escrito de Sonia" que ya existía, ahora en el mismo patrón `<details>` de Collaborators) y "To Sonia" (nueva, carta de Sonia Celpa sobre Sonia Rivas). El botón de audio y el CTA se movieron después de ambas cartas para que sigan siempre visibles.
- [x] `/guia` — reorganización completa (26 agosto), a partir de un modelo que Fercha armó como referencia: se corrigió el idioma (Fercha habla en singular "yo", no "nosotros" — "armé", "estoy"); se agregó un sistema de etiquetas **TU TAREA** / **SOLO CONSULTA** para separar lo que Sonia debe hacer de lo que es solo informativo; toda la Bienvenida se reescribió con un mini-diagrama del flujo (Reel/mensaje → clic → Aldea) para que quede claro que todo conecta a un solo lugar; se creó una sección única "Lo que tienes que hacer" con las 6 tareas de Sonia en orden (Zelle, completar GoFundMe con pasos y sin escribir la contraseña, primer comentario de oración con texto copiable, compartir el Reel en Facebook simplificado a 4 pasos, actualizar Necesidades, colaboradores genérico); se agregó sección de referencia "Cómo funciona cada lugar" (Facebook = muro de oración, WhatsApp = Announcements vs. Aldea de Mía, sitio web = la Aldea completa); "Los links de la Aldea" se convirtió en sección de solo consulta "Todos los links, en un solo lugar".

### No es código (contenido / cuentas)
- [ ] Información de Zelle de Sonia

---

## ⏸️ APLAZADO (si sobra tiempo)

- [ ] Mapa a pantalla completa (riesgo de romper hotspots — pausado por decisión de Fercha)
- [ ] Barra de progreso automática en "This Week's Needs" (necesita/cubierto/falta) — recordatorio: esto es Fase 2 según `FLUJO_MIA_VILLAGE.md`, no tocar en Fase 1. Bloque 3 sí incluye mostrar los números en texto simple.

---

## 🔒 REGLA DE CONTROL
Cualquier pendiente nuevo se agrega aquí antes de construirse.
Comando: "Vera actualiza PENDIENTES_MIA_VILLAGE: [cambio]"

---
FIN DOCUMENTO
