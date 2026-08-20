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
- [ ] Mínimo 2-3 necesidades reales cargadas en el Google Form
- ~~Columna "¿es urgente?" en el Google Form~~ — ya no se necesita, se aceptó el sustituto visual "🟡 Still needed" / "✅ Covered" en su lugar (20 agosto)

---

## 🟡 FERCHA — pendientes

- [x] Link WhatsApp — Ok
- [x] Link Facebook — Ok
- [ ] Crear cuenta GoFundMe
- [x] Crear cuenta Gmail (para el botón de contacto) — miasvillageofhope@gmail.com
- [ ] Tener a la mano el link de Behance (para el copyright de Contact)
- [ ] Reel para redes — invitación a la Aldea, con buen gancho + URL de la web
- [ ] PDF guía de entrega para la familia (paleta del proyecto, logos, explicación sencilla para Sonia Dueñas, URL pública, URL de /actualizar + explicación de uso)

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

### Código
- [ ] Bug: quitar pantalla 2 duplicada del onboarding (NO la 1)
- [ ] Botón "siguiente estación": mover arriba, extremo opuesto al botón "volver"
- [ ] Foto de Mía por estación: agrandar (mismo alto vertical que el título)
- [ ] Fondo de las estaciones: cambiar de crema a verde pálido (`--green` #EAF3C9), igual que el fondo del mapa
- [ ] Meet Mía: texto del botón cambia a "La Aldea Necesita" (mismo link)
- [ ] This Week's Needs: rediseño de claridad — qué ve quien aporta, qué ve Sonia (vía /actualizar)
- [ ] Collaborators: botón "¿Quieres unirte?" debajo del título, link a mailto:miasvillageofhope@gmail.com
- [ ] Contact: agregar links de Facebook y WhatsApp (ya definidos); GoFundMe y Zelle quedan en placeholder hasta que existan las cuentas
- [ ] Contact: copyright discreto al final — "© María Fernanda Betancourt" + link a Behance (bloqueado hasta tener el link a mano)

### No es código (contenido / cuentas)
- [ ] Crear cuenta GoFundMe
- [ ] Información de Zelle de Sonia
- [ ] Reel para redes
- [ ] PDF guía de entrega para la familia

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
