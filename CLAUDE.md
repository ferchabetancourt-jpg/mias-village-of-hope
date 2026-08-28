# CLAUDE.md — Mía's Village of Hope

Instrucciones de trabajo para cualquier sesión de Claude en este repo. Léelo completo antes de tocar código.

Repo: `ferchabetancourt-jpg/mias-village-of-hope` — sitio estático (HTML/CSS/JS puro, sin build/npm).
Deploy: Vercel, conectado al repo de GitHub.

---

## A) Metodología general

1. Antes de tocar código: diagnostica leyendo el código real (no asumas), compáralo contra la documentación del proyecto si existe, y da un diagnóstico concreto con causa raíz — no una opinión vaga.
2. Agrupa las mejoras en una lista numerada antes de empezar a programar, para que Fercha vea el alcance completo y pueda priorizar u ordenar.
3. Si hay una decisión de diseño, UX, nombre o contenido que es subjetiva (no tiene una respuesta técnica correcta), pregunta con 2-4 opciones concretas en vez de adivinar o implementar una preferencia propia sin confirmar.
4. Espera un "GO" explícito antes de tocar código, correr un comando, o ejecutar cualquier acción no 100% reversible con un simple deshacer — esto incluye: `git push`, merge de PR, cambios de configuración fuera del código (hosting, dominios, variables de entorno). Dile primero qué vas a hacer.
5. Si mientras se implementa algo se traba, o aparece ambigüedad real, o un fork de diseño — para y pregunta. No improvises solo.
6. Cuando la configuración es externa (no código): un paso a la vez, esperando confirmación de que se hizo antes de dar el siguiente.
7. Verifica que el sitio funcione de verdad antes de subir cualquier cambio — nunca subas algo sin probarlo primero (ver sección D).
8. Explica en español simple, sin jerga técnica, qué cambió y por qué — Fercha no es programadora.
9. Sé honesta si algo falla o no tienes acceso/control sobre una herramienta externa (Vercel, GitHub, etc.) — nunca inventes que "ya quedó" sin confirmarlo. Da pasos claros para resolverlo del otro lado si hace falta.
10. Con PRs de GitHub: abre el PR, da el link del preview para probar, y espera confirmación antes de mergear a producción — nunca mergees sin que se pida explícitamente. Al mergear, no borres la rama salvo que se pida.
11. Mantén viva la lista de pendientes a lo largo del proyecto — cosas identificadas pero pospuestas, deuda técnica, ideas que surgieron pero no eran prioridad. Sácalas a relucir cuando tenga sentido retomarlas, no dejes que se pierdan en el chat.
12. Sugiere optimizaciones de forma proactiva cuando veas algo que puede ayudar (patrón repetido, fricción de UX, riesgo a futuro) aunque no se haya pedido — coméntalo breve, no lo implementes sin que se pida.
13. **El contenido final (copy, textos de marca, mensajes a la familia/donantes) siempre lo aprueba Fercha.** Puedes proponer y redactar borradores, pero no lo des por publicado sin su visto bueno explícito.
14. Nunca commitees `.env`, API keys ni credenciales. Si algo las necesita, avisa y pide que se agreguen directo en Vercel/donde corresponda — nunca las pidas por chat ni las escribas en el código.

---

## B) Los 3 documentos del repo — leer siempre al empezar

1. **PENDIENTES_MIA_VILLAGE.md** — fuente de verdad de qué está hecho y qué falta. Tiene fecha de "Última actualización" y "Meta de entrega" arriba — revísalas primero. Está organizado por **dueño y tipo**, no solo por bloque de feature:
   - `🟡 SONIA` — pendientes que dependen de la familia (cuentas, textos, aprobaciones)
   - `🟡 FERCHA` — pendientes que dependen de Fercha
   - `🔧 CÓDIGO` — bloques de trabajo técnico, numerados
   - Si algo aparece implementado en el código pero sin marcar en el doc (o viceversa), avisa en vez de asumir — y actualiza el doc cuando se cierre un bloque.

2. **IDENTIDAD_VISUAL_MIA_VILLAGE.md** — paleta de marca (green/gold/burgundy/cream/navy) y jerarquía tipográfica (Alex Brush solo para "Mía's", Nunito para estructura, Caveat para eyebrows/toques cálidos, Lato para texto largo). Ningún color o fuente nueva se agrega sin anotarlo aquí primero.

3. **SPEC / FLUJO_MIA_VILLAGE.md** — el `README.md` original de este repo referencia un `FLUJO_MIA_VILLAGE.md` como el spec funcional del proyecto (Fase 1 MVP), pero ese archivo **no existe en el repo** — se perdió o nunca se llegó a commitear. Si en algún momento hace falta reconstruirlo, avisa antes de inventar contenido — pregunta a Fercha qué debía tener.

**Precisión en créditos:** cuando el crédito de código/diseño y el de contenido/historia son de personas distintas (ej. Fercha diseña y desarrolla, Sonia es dueña de la historia de Mía), sé precisa en cómo se redacta cualquier atribución/copyright — no dejes que el crédito de una persona insinúe autoría sobre lo que hizo la otra.

---

## C) Diseño — nada "moderno" por defecto

Este sitio es un cuento ilustrado a mano, no una app SaaS. Antes de aplicar un estilo nuevo (chips, botones, labels), pregúntate "¿esto combina con una ilustración pintada a mano?" — evita píldoras perfectas, bordes duros/geométricos, sombras genéricas de UI. Cuando algo necesite fondo, preferir formas orgánicas/irregulares (manchas, no rectángulos).

Voz de marca: verifica el tono real en vez de asumirlo. Fercha habla en singular ("armé", "estoy"), no en plural ("nosotros") — ya pasó que un texto de `/guia` se escribió en plural y hubo que corregirlo.

---

## D) Flujo técnico — verificar antes de pushear

- Levanta el sitio local (`python3 -m http.server`) y verifica con capturas reales (mobile ~390px y desktop ~1280px) antes de reportar algo como listo.
- Si hay texto/elementos superpuestos a una ilustración (labels sobre el mapa, etc.): no calcules posición "a ojo" desde una captura chica — recorta/inspecciona la imagen fuente en zoom, o dibuja una grilla/óvalo de verificación sobre el mapa antes de fijar coordenadas.
- **Prueba con datos reales antes de dar una feature por terminada**, no solo con datos de ejemplo. El listado de "This Week's Needs" tuvo bugs reales (tarjetas duplicadas, montos mal sumados, idioma que no respetaba el toggle) que solo aparecieron con datos reales de Sonia — con datos de prueba no se veían.
- **Audita cualquier `PLACEHOLDER` antes de dar algo por listo.** Un placeholder dentro de un atributo vivo (`href`, `src`) no es una nota — es un bug real (404, link roto) esperando a que alguien lo toque. El botón de Zelle en Contact tuvo este problema.
- Cuidado con font-size chico + texto acentuado (tildes): en este entorno de render, tildes por debajo de ~0.85rem o en peso 800 a veces no dibujan bien, sin importar la técnica de contorno usada. Si agregas texto nuevo con acentos, verifícalo con zoom.
- No uses `text-shadow` con blur para dar contraste a texto sobre imagen — ya causó que tildes desaparecieran más de una vez en este proyecto. Preferir `-webkit-text-stroke` con `paint-order: stroke fill`.
- Commits descriptivos explicando el "por qué", no solo el "qué".

---

## E) Ramas y PRs

- Trabaja siempre en una rama `claude/<descripción-corta>`, nunca directo en `main`.
- **Default:** una rama nueva por bloque/tarea (más fácil de rastrear qué PR trajo qué). Si un feature grande necesita muchas rondas de ajuste seguidas (como pasó con `/guia`, ~24 PRs sobre la misma rama `claude/mias-village-workflow-mghj3m`), reutilizar una sola rama es válido — pero confírmalo con Fercha antes de adoptar ese patrón en vez del default.
- El preview de una rama NO aparece solo con el push — hay que abrir un Pull Request (`main` ← rama) para que el bot de Vercel comente la URL de preview en el PR. Esa URL se mantiene igual y se actualiza sola con cada push nuevo a la misma rama mientras el PR siga abierto.
- Cuando Fercha dé "Aprobado / GO" final sobre un bloque: mergear el PR sin borrar la rama (salvo que pida lo contrario), y marcar el bloque como completado en PENDIENTES_MIA_VILLAGE.md.

---

## F) Páginas ocultas del sitio

Además de `index.html` (el sitio principal), este repo tiene páginas ocultas — no aparecen en el menú ni se enlazan desde el sitio, pero son parte del producto:
- `/actualizar` (`actualizar.html`) — lista + formulario lado a lado para que Sonia actualice las necesidades de la semana.
- `/guia` (`guia.html`) — guía de entrega para la familia: paleta del proyecto, links de la Aldea, cómo actualizar necesidades, cómo compartir el Reel, cómo guardar accesos directos en el teléfono. Usa el sistema de etiquetas **TU TAREA** / **SOLO CONSULTA** para separar lo que Sonia debe hacer de lo que es solo informativo — mantenlo si se edita esta página.

`vercel.json` tiene `cleanUrls` activado para que estas rutas funcionen sin extensión `.html`.
