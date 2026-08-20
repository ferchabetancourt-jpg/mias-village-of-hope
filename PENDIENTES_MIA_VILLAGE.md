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

## 🟡 SONIA — 4 pendientes

- [ ] Cuenta de Zelle (junto con mensaje de confianza para mostrarlo)
- [ ] Texto corto aprobado de Celpa Clinic
- [ ] Info para sección Trust: quién administra, cómo llega la ayuda, quién es la familia, qué gastos cubre *(ya hay frase sugerida: "Managed by Mía's family and close friends")*
- [ ] Mínimo 2-3 necesidades reales cargadas en el Google Form

---

## 🟡 FERCHA (MF) — 2 pendientes

- [x] Link WhatsApp — Ok
- [x] Link Facebook — Ok
- [ ] Crear cuenta GoFundMe
- [x] Crear cuenta Gmail (para el botón de contacto) — miasvillageofhope@gmail.com

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
- [x] Sección Trust nueva (quién administra → cómo llega la ayuda → familia → gastos)
- [x] This Week's Needs: botón/etiqueta "I can help" por necesidad
- [x] This Week's Needs: marcar visualmente las "most urgent" *(vía estado "🟡 Still needed" vs. "✅ Covered")*
- [x] This Week's Needs: mostrar también necesidades cumplidas + valor recogido
- [x] Collaborators: resumen corto → lleva al detalle de cada colaborador
- [x] Contact: separar visualmente íconos de redes sociales vs. botones de donación
- [x] Onboarding pantalla 1: texto bajo la foto (sin sonar a lástima) + tono más serio/confiable

**Nota:** este bloque se implementó en 3 commits (`Bloque 3: Meet Mía, Trust, Needs, Collaborators, Contact, onboarding`, `Bloque 3 round 2: ajustes de feedback`, `Meet Mía: botones también después del Resumen`) ya en `main`. El checklist quedó sin marcar por error — se corrige acá sin tocar código.

### Bloque 4 — Navegación y accesibilidad ✅ COMPLETADO (20 agosto 2026)
- [x] Labels flotantes sobre cada estación del mapa (mobile y desktop)
- [x] Menú hamburguesa (☰) en el banner con las 5 estaciones — siempre disponible, incluso con un panel de estación abierto
- [x] Botón "Next" (flecha con diseño propio) entre estaciones, en orden del camino del mapa, con loop de Contact de vuelta a Meet Mía
- [x] Accesibilidad: alt del mapa nombra las 5 estaciones; foco entra/sale del modal y del menú correctamente (trampa de Tab + restaura el foco al cerrar); `--gold-text` (oro oscurecido, ≥4.5:1) para el eyebrow y el outline de foco, sin tocar el gold decorativo
- [ ] Mejorar el emblema (muy complicado, no se ve bien en FB/WhatsApp) — sigue en baja prioridad, sin tocar

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
