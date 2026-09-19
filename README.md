# Mía's Village of Hope — Web

Sitio web para acompañar a Mía y su familia durante su tratamiento: un mapa ilustrado a mano con 5 "estaciones" que cuentan su historia, muestran qué necesita la familia esta semana, y dan formas concretas de ayudar (donar, compartir, conectar). Está pensado como un cuento, no como una app — sin dashboards ni jerga técnica visible para quien lo visita.

**Para quién es:** la comunidad de Mía — familia, amigos, donantes — que llega desde un link compartido por WhatsApp o redes.

## Stack técnico

HTML/CSS/JS puro, sin build ni npm. Deploy en [Vercel](https://vercel.com), conectado directo al repo de GitHub — cada push a una rama con PR abierto genera un preview automático.

`vercel.json` tiene `cleanUrls` activado, así que las páginas ocultas funcionan sin `.html` (`/guia`, `/actualizar`).

No hay base de datos propia: la única sección con datos dinámicos ("This Week's Needs") lee en vivo un Google Sheet publicado como CSV. El detalle completo de ese flujo está en `SPEC_MIA_VILLAGE.md`.

## Cómo correrlo en local

No necesita instalación. Cualquiera de estas dos formas funciona:

```bash
# Opción 1: abrir el archivo directo
open index.html

# Opción 2: servidor local simple (recomendado para probar /guia y /actualizar)
python3 -m http.server
# luego abrir http://localhost:8000
```

## Estructura de carpetas

```
index.html       Sitio principal — onboarding + mapa + 5 estaciones
guia.html         /guia — guía oculta de uso para la familia (no enlazada en el menú)
actualizar.html   /actualizar — formulario oculto para que Sonia actualice necesidades
css/styles.css    Todos los estilos — paleta y tipografía en IDENTIDAD_VISUAL_MIA_VILLAGE.md
js/app.js         Navegación (onboarding, modal de estaciones, menú, idioma, efectos del mapa)
js/needs.js       Trae y procesa los datos en vivo del Google Sheet de necesidades
images/           Fotos, íconos, mapa, emblema y demás assets
vercel.json       Config de deploy (cleanUrls)
```

## Páginas ocultas

No aparecen en el menú ni se enlazan desde el sitio público, pero son parte del producto:
- **`/actualizar`** — lista + formulario lado a lado para que Sonia actualice las necesidades de la semana.
- **`/guia`** — guía de entrega para la familia: paleta del proyecto, links de la Aldea, cómo actualizar necesidades, cómo compartir el Reel, cómo guardar accesos directos en el teléfono.

## Documentos del proyecto

- **[CLAUDE.md](./CLAUDE.md)** — cómo trabajar en este repo (ramas, PRs, cuándo pedir permiso).
- **[SPEC_MIA_VILLAGE.md](./SPEC_MIA_VILLAGE.md)** — spec funcional: cómo funciona el sitio de verdad (estaciones, flujo de datos, lógica core).
- **[IDENTIDAD_VISUAL_MIA_VILLAGE.md](./IDENTIDAD_VISUAL_MIA_VILLAGE.md)** — paleta de marca y jerarquía tipográfica oficiales.
- **[PENDIENTES_MIA_VILLAGE.md](./PENDIENTES_MIA_VILLAGE.md)** — qué está hecho y qué falta, organizado por dueño (Sonia / Fercha / código).
