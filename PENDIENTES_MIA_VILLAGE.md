# PENDIENTES_MIA_VILLAGE.md
Ruta de pendientes — Proyecto "Mía's Village of Hope"
Última actualización: 19 agosto 2026
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

### Bloque 3 — Estructura y contenido de estaciones
- [ ] Meet Mía: quitar foto fija (sticky), volver a scroll normal
- [ ] Meet Mía: dos secciones — "Resumen" (formato "Mía loves: __, __, __") y "Escrito de Sonia" (historia larga)
- [ ] Meet Mía: botón final a This Week's Needs ("Ways to help" / "How to help")
- [ ] Sección Trust nueva (quién administra → cómo llega la ayuda → familia → gastos)
- [ ] This Week's Needs: botón/etiqueta "I can help" por necesidad *(a planear juntas)*
- [ ] This Week's Needs: marcar visualmente las "most urgent"
- [ ] This Week's Needs: mostrar también necesidades cumplidas + valor recogido
- [ ] Collaborators: resumen corto → lleva al detalle de cada colaborador
- [ ] Contact: separar visualmente íconos de redes sociales vs. botones de donación
- [ ] Onboarding pantalla 1: texto bajo la foto (sin sonar a lástima) + tono más serio/confiable

### Bloque 4 — Navegación y accesibilidad
- [ ] Labels flotantes sobre cada estación del mapa
- [ ] Menú hamburguesa (☰) en el banner con las 5 estaciones
- [ ] Botón "Next" (flecha con diseño) entre estaciones
- [ ] Accesibilidad: alt text completo, orden de navegación, contraste de texto
- [ ] Mejorar el emblema (muy complicado, no se ve bien en FB/WhatsApp)

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
