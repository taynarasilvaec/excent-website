# Website — Excent Capital

Angular 20 redesign del antiguo proyecto `mainpage`. Las traducciones y los componentes reutilizables viven en repos hermanos.

> **Para nuevos integrantes**: lee también [`rules.md`](./rules.md) que tiene una versión más narrada y didáctica de las reglas.

---

## Stack

- **Angular 20** (standalone components, signals, control flow `@for`/`@if`, signal inputs).
- **TypeScript** strict.
- **SCSS** para estilos (con tokens excent).
- **Tailwind v4** sólo para responsive y utilidades puntuales.
- **ngx-translate** para i18n.

---

## Estructura del proyecto

```
website/
├── src/
│   ├── app/
│   │   ├── components/            # Componentes reutilizables (excent-*)
│   │   ├── features/              # Features/páginas (trading, home, etc.)
│   │   ├── shared/                # Footer, header, navbar.config, services
│   │   │   ├── constants.ts       # URLs centralizadas
│   │   │   └── services/          # SsoRedirectService, DevicePlatformService
│   │   ├── app.config.ts
│   │   ├── app.routes.ts
│   │   └── app.ts
│   ├── styles.scss                # Tokens excent theme-aware (light/dark)
│   ├── tailwind.css               # Tokens excent estáticos
│   └── environment/
└── public/assets/                 # Imágenes e íconos
```

Repos hermanos:
- `~/Documents/translates/website/i18n/` → traducciones del sitio
- `~/Documents/libraries/` → destino futuro de componentes reutilizables

---

## Traducciones (i18n)

**Ubicación**: `~/Documents/translates/website/i18n/`
**Idiomas**: `en.json`, `es.json`, `fr.json`, `it.json`, `pt.json`, `yue.json`

**Configurado en `angular.json`** para servirse desde `/assets/i18n/` durante el build:
```json
{ "input": "../translates/website/i18n", "output": "/assets/i18n" }
```

### Convenciones obligatorias

1. **Keys en kebab-case** para palabras compuestas: `create-account`, `live-account`, `why-trade`.
2. **Estructura recursiva por sección**: cada componente/página tiene su propio bloque (`home`, `live-account`, `footer`, etc.) y dentro sub-bloques por sub-sección.
3. **Orden dentro de cada objeto** (regla recursiva):
   - **Primero** las keys flat (string values).
   - **Después** las keys que son objetos.
4. **Orden de los bloques top-level**:
   1. Keys flat sueltas (`crypto`, `commodities`, etc.)
   2. Componentes globales (`footer`, `navbar`, `browser-title`)
   3. Páginas en orden de display (`home`, `live-account`, etc.) y dentro de cada una sus secciones en orden de visualización.
5. **No duplicar palabras**: antes de crear una key, verifica si ya existe a nivel root (palabras comunes reusables como `create`, `accept`, `cancel`).
6. **Title Case en valores** cuando el diseño lo pida.

### Workflow al agregar texto

1. Identifica la sección donde vive el texto (ej. `live-account.security`).
2. Agrega la key respetando el orden flat → object.
3. Actualiza todos los idiomas (o al menos `en.json`).
4. Usa `{{ 'live-account.section.key' | translate }}` en el HTML.

---

## Estilos

### Preferencias

- **SCSS por defecto** para casi todo (layout, spacing, colores, gradients, animaciones).
- **Tailwind sólo para responsive** (`tablet:`, `desktop:` prefixes) o utilidades muy puntuales (helpers triviales de flex/grid).
- Evita Tailwind para colores, tipografía, spacing complejo, gradients, sombras — usa SCSS con tokens.

### Breakpoints (`src/tailwind.css`)

```
--breakpoint-mobile: 402px;
--breakpoint-tablet: 1024px;
--breakpoint-desktop: 1440px;
```

Uso en HTML: `class="text-sm tablet:text-base desktop:text-lg"`
Uso en SCSS: `@media (min-width: 1024px) { ... }` o `@media (min-width: 1440px) { ... }`

---

## Design Tokens Excent

Sistema de variables CSS centralizado para colores, opacidades y theming. **Siempre usa tokens, no hardcodees valores**.

### `src/styles.scss` — Tokens theme-aware (cambian con light/dark)

Duplicados en `:root` (light) y `.dark` (dark). Actualmente con mismos valores porque no hay design de light mode todavía. Cuando llegue, sólo se editan los valores en `:root` y todo el sitio se adapta.

**Texto sobre fondo oscuro** (escalas de opacidad):
```scss
--excent-text-on-dark-primary: #FFFFFF;
--excent-text-on-dark-soft: rgba(255,255,255,0.85);
--excent-text-on-dark-secondary: rgba(255,255,255,0.80);
--excent-text-on-dark-muted: rgba(255,255,255,0.70);
--excent-text-on-dark-dim: rgba(255,255,255,0.60);
--excent-text-on-dark-faint: rgba(255,255,255,0.50);
```

**Accent / links**: `--excent-link-blue: #086EF9;`

**Pill (reusable)**:
```scss
--excent-pill-border, --excent-pill-gradient-start, --excent-pill-gradient-end,
--excent-pill-label, --excent-pill-dot-green, --excent-pill-dot-green-glow
```

**Security cards** (con stack de destellos azules):
```scss
--excent-security-card-bg: #011C41;
--excent-security-card-border, --excent-security-card-grid-line,
--excent-security-card-glow-1..5,  // del más claro #80C4FF al más oscuro #0050FF
--excent-security-icon-bg, --excent-security-icon-shadow-inset, --excent-security-icon-shadow-drop
```

**Navbar y background global**: `--excent-background`, `--excent-navbar-*`

### `src/tailwind.css` — Tokens estáticos

Colores fijos (`bg-excent_blue-100`, etc.):
`--color-excent_blue-100/-700`, `--color-excent_red-100/-300/-500/-600`, `--color-excent_orange`, `--color-excent_yellow`, `--color-excent_gray`.

### Cuando agregues colores nuevos

- Si es **reutilizable** (texto, link, surface) → agregar a `styles.scss` en `:root` y `.dark`.
- Si es **muy específico de un componente** (ej. stack de glow de security) → namespace con el componente: `--excent-security-*`.

---

## Componentes Excent reutilizables

Viven en `src/app/components/` localmente y se promueven a `libraries/` cuando estén estables (para no republicar en cada cambio).

**Usar SIEMPRE que sea posible** antes de crear elementos nuevos:

| Componente | Selector | Para qué |
|---|---|---|
| `excent-button` | `<excent-button>` | Botones. Props: `color`, `radius`, `size`, `width` |
| `excent-card` | `<excent-card>` | Cards. Variants: `blue`, `blue-bright`, `white-transparent`, `transparent`, `flag`. `showGrid` para cuadrícula |
| `excent-text` | `<excent-text>` | Tipografía con variantes |
| `excent-pill` | `<excent-pill>` | **Pill/tag único de la identidad** (kickers, badges, eyebrows). Props: `variant` (soft · outline · solid) × `color` (neutral · blue · green) × `size` (sm · md · lg), `dot` (status), `uppercase`. Label por content projection. Ej.: "Live Market Access" (soft+dot), "Error 404" (outline blue upper), "24/7 Human Support" (solid blue). |
| `excent-accordion` + `excent-accordion-item` | wrapper con items adentro | Acordeón reusable. Props del item: `itemId`, `question`, `answer`. Del wrapper: `initialActiveId` |
| `excent-bento-card` | `<excent-bento-card>` | **Shell del bento** (fuente única del look, fiel a Figma: base `#011C41` + un **glow azul difuso posicionable** ("Ellipse 2" como SVG, blur fuerte, opacity 0.4) + **grid blueprint cyan** `#0BCACA` 48px + **sparkles** (cruces blancas con puntas desvanecidas) + **dots** cyan, todo bajo **máscara radial**; borde, radius 24px). **Sin cuadrados** cyan (removidos). Contenido por `<ng-content>`. Props: `variant` (`navy` default · `blue-bright` — la única variante sancionada, igual que excent-card), `pad` (bool, default true → padding 32/42px; `false` cuando el contenido proyectado controla su propio padding, p.ej. sub-paneles full-bleed), `name`, y la **posición del bg por card**: `glowX`/`glowY`/`glowW`/`glowFlip` (glow) + `patX`/`patY` (tile de accents 768px) — con defaults sensatos para cards que no los setean. Úsalo directo cuando un layout necesita un arreglo que el grid uniforme no expresa (columnas con alturas asimétricas, contenido bespoke). |
| `excent-bento` | `<excent-bento>` | **Bento de la identidad** (grid). Renderiza un grid de `<excent-bento-card>`. Props: `[cols]` (columnas), `[items]` (`BentoItem`: `icon?`, `media?`/`mediaPanel?`, `title?`+`titleDim?`, `description?`, `stat?`+`statLabel?`, `button?`, `link?`, `variant?`, `colSpan?`, `rowSpan?`), `name`. `(cardAction)` emite el item del botón. Textos aceptan string o key i18n. |
| `excent-faq` | `<excent-faq>` | **FAQ único de la identidad** (título Title Case + `excent-accordion`). Props: `title` (string o key), `[items]` (`FaqEntry[]`: `id`, `question`, `answer` — string o key, aplica `\| translate`), `initialActiveId`. |
| `live-spark` | `<live-spark>` | Sparkline **animado** (random-walk rolando, `requestAnimationFrame`, SSR-safe). Stroke 1px non-scaling + área con degradé a azul oscuro opacidad 0. Prop: `up` (color positive/negative). Solo decorativo (mock). |

**REGLA — bento**: todos los bento reusan SIEMPRE el shell `<excent-bento-card>` (vía `<excent-bento>` para grids uniformes, o directo para layouts asimétricos/bespoke). El **shell es idéntico** en todo el sitio (borde, stroke, gap 12px, patrón) — NUNCA se duplica ni se reestiliza. La **única** variación de fill sancionada es `variant="blue-bright"` (royal blue, base `#01296E` + glow). Lo que cambia libremente: el **arreglo del grid** (`[cols]` + `colSpan`/`rowSpan`, o un grid propio) y el **contenido proyectado**. (Ej.: MAM = 3 cols con card alto + wide; live-account security = 3 cols con assets alto; platform capabilities = dos columnas con alturas asimétricas + cards `blue-bright` + contenido bespoke.)

Cuando creas un componente nuevo, evalúa primero si lo puedes resolver con un excent component existente.

---

## Servicios y constantes

### `src/app/shared/services/`

- **`SsoRedirectService`** → redirige a accounts/trading:
  - `goTo('sign-in' | 'sign-up')` → accounts SSO
  - `goToTrading()` → plataforma de trading
- **`DevicePlatformService`** → detecta SO (Android/iOS/other) con getters `isAndroid`, `isIOS`, `isMobileOS`. SSR-safe.

### `src/app/shared/constants.ts`

URLs centralizadas. Si necesitas una URL externa que se usa en más de un componente, agrégala aquí (ej. `STORE_URLS.appStore`, `STORE_URLS.playStore`).

---

## Code style (resumen — ver `rules.md` para detalle)

### Inyección y propiedades

- Usa **`inject()`** en lugar de constructor injection.
- Nomenclatura de servicios inyectados: **sin el sufijo `Service` en la variable**.
  ```ts
  private readonly _translate = inject(TranslateService)   // ✅
  private readonly _translateService = inject(TranslateService) // ❌
  ```
- Si encuentras código viejo con `_xxxService`, refactorízalo cuando lo toques.

### Orden de miembros en una clase TS

1. **Por modificador de acceso**: `private` → `protected` → `public`.
2. **Dentro de cada modificador, por tipo de miembro**:
   1. Strings
   2. Números
   3. Booleans
   4. Arrays / objetos / signals
   5. Métodos
3. Excepción: `constructor` (si existe) va arriba; `ngOnInit`/lifecycle entre métodos en orden de ejecución; `ngOnDestroy` al final.

> No reordenes si rompe lógica (raro pero posible cuando hay inicialización dependiente entre propiedades).

### Componentes Angular 20

- **Standalone** siempre. No usar NgModules.
- **Signals** para estado: `signal()`, `computed()`, `effect()`.
- **Signal inputs**: `input()`, `input.required<T>()` en vez de `@Input()`.
- **Signal outputs**: `output<T>()` en vez de `@Output()` cuando sea posible.
- Nombre del componente en kebab-case, **máximo 3 palabras** y cortas. Ej.: `nombre-comp-3`, `card-stats`, `excent-accordion`.

### HTML — orden de atributos

```html
<div
  #refElement
  *ngIf="..."          <!-- (raro hoy, se prefiere @if) -->
  id="my-id"
  data-cy="my-cy"
  class="..."
  type="button"
  [property]="..."
  (event)="...">
</div>
```

1. **Element ref** (`#refName`)
2. **Directivas estructurales** (`*ngIf`, `*ngFor` — si las usas)
3. **`id`** (obligatorio)
4. **`data-cy`** (obligatorio)
5. **`class`, `type`, `aria-*`, `alt`, `src`, `href`, `width`, `height`, etc.** (atributos estáticos)
6. **Inputs** (`[property]`, `[class.*]`, `[attr.*]`, `[style.*]`)
7. **Outputs** (`(click)`, `(submit)`, etc.)

Tanto `id` como `data-cy` son **obligatorios** en todo elemento que tenga identidad visual o sea interactivo. Convención de naming: `<feature>-<section>-<element>`.

### SCSS

- BEM-style (`.component`, `.component__element`, `.component--modifier`).
- Usa tokens excent (no hardcodees colores).
- `:host { display: block; width: 100%; }` por defecto en componentes Angular.

---

## Workflow al crear un componente nuevo

1. **Decide ubicación**:
   - Reutilizable → `src/app/components/excent-<nombre>/`
   - Específico de feature → `src/app/features/<feature>/<sub-feature>/<nombre>/`
2. **Nombre kebab-case, máximo 3 palabras cortas**.
3. **Estructura típica**:
   ```
   componente/
   ├── componente.ts
   ├── componente.html
   ├── componente.scss
   └── componente.spec.ts
   ```
4. **Registra** el componente en su padre (imports + uso en HTML).
5. **Agrega traducciones** en `~/Documents/translates/website/i18n/` respetando convenciones de orden.
6. **Usa tokens excent** y componentes excent siempre que sea posible.
7. **Sigue el orden** de atributos HTML y miembros TS.
8. **Verifica** en navegador (`ng serve` en `http://localhost:4200`).

---

## Notas adicionales

- **Idioma de comunicación**: el usuario escribe en español, responde en español.
- **Memoria personal** (`~/.claude/projects/.../memory/`) NO se comparte con el equipo. Todo el contexto compartido vive en este archivo y en `rules.md`.
- **Pasos pequeños** al construir UI: build → verify → iterar.
- **Preview server**: cuando esté disponible (puerto 4200), usar las preview tools para verificar visualmente antes de declarar tarea completa.

---

## Documentación adicional

- [`rules.md`](./rules.md) — Reglas detalladas y onboarding para nuevos integrantes.
- `src/styles.scss` — todos los tokens
- `src/tailwind.css` — breakpoints y colores estáticos
- `angular.json` — configuración de build y assets
- `~/Documents/translates/website/i18n/en.json` — referencia maestra de translations
