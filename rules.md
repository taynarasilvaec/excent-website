# Reglas del proyecto — Onboarding
Bienvenido al proyecto **Website** de Excent Capital. Este documento es tu guía para contribuir consistentemente con el resto del equipo.
Si vienes a hacer un PR, esto es lo que tu código tiene que cumplir.

> Para una versión más compacta orientada a Claude/AI, ver [`CLAUDE.md`](./CLAUDE.md).

---
## Tabla de contenidos
1. [Stack y prácticas generales](#1-stack-y-prácticas-generales)
2. [Estructura del proyecto](#2-estructura-del-proyecto)
3. [Reglas de TypeScript](#3-reglas-de-typescript)
4. [Reglas de HTML](#4-reglas-de-html)
5. [Reglas de SCSS y estilos](#5-reglas-de-scss-y-estilos)
6. [Design Tokens (Excent)](#6-design-tokens-excent)
7. [Componentes reutilizables (excent-*)](#7-componentes-reutilizables-excent-)
8. [Servicios y constantes](#8-servicios-y-constantes)
9. [Traducciones (i18n)](#9-traducciones-i18n)
10. [Naming conventions](#10-naming-conventions)
11. [Workflow al crear un componente](#11-workflow-al-crear-un-componente)
12. [Checklist de PR](#12-checklist-de-pr)

---
## 1. Stack y prácticas generales

- **Framework**: Angular 20.
- **Lenguaje**: TypeScript estricto.
- **Estilos**: SCSS (prefer) + Tailwind v4 sólo para responsive y utilidades puntuales.
- **i18n**: ngx-translate. Las traducciones viven en el repo `~/Documents/translates/website`.

**Mejores prácticas Angular 20** (obligatorias):

- ✅ **Standalone components**. Cero NgModules.
- ✅ **Signals** para estado: `signal()`, `computed()`, `effect()`.
- ✅ **Signal inputs**: `input()`, `input.required<T>()` en vez de `@Input()` legacy.
- ✅ **Signal outputs**: `output<T>()` en vez de `@Output()`.
- ✅ **`inject()`** para inyección de dependencias (no constructor).
- ✅ **Control flow nativo**: `@for`, `@if`, `@switch` en vez de `*ngFor`, `*ngIf`, `*ngSwitch`.

---
## 2. Estructura del proyecto

```
website/
├── src/
│   ├── app/
│   │   ├── components/            # Componentes reutilizables (excent-*)
│   │   ├── features/              # Páginas y features
│   │   │   └── trading/
│   │   │       └── accounts/
│   │   │           └── live-accounts/
│   │   │               ├── market/
│   │   │               ├── security/
│   │   │               ├── highlights/
│   │   │               └── faq/
│   │   ├── shared/
│   │   │   ├── constants.ts       # URLs y constantes globales
│   │   │   ├── footer/
│   │   │   ├── header/
│   │   │   ├── navbar.config.ts
│   │   │   └── services/
│   │   │       ├── sso-redirect.service.ts
│   │   │       └── device-platform.service.ts
│   │   ├── app.config.ts
│   │   ├── app.routes.ts
│   │   └── app.ts
│   ├── styles.scss                # Tokens excent theme-aware
│   ├── tailwind.css               # Tokens excent estáticos
│   └── environment/
└── public/assets/                 # Imágenes e íconos
```

**Repos hermanos** (clonados al lado de este):

- `~/Documents/translates/website/i18n/` → traducciones por idioma.
- `~/Documents/libraries/` → componentes excent compartidos (futuro).

---

## 3. Reglas de TypeScript

### 3.1 Inyección de dependencias

Usa siempre **`inject()`**, nunca constructor injection:

```ts
// ✅ Correcto
export class Component {
  private readonly _sso = inject(SsoRedirectService)
}

// ❌ Incorrecto
export class Component {
  constructor(private sso: SsoRedirectService) {}
}
```

### 3.2 Nomenclatura de servicios inyectados

**Sin el sufijo `Service`** en el nombre de la variable. Era repetitivo y lo eliminamos:

```ts
// ✅ Correcto
private readonly _translate = inject(TranslateService)
private readonly _sso = inject(SsoRedirectService)
private readonly _device = inject(DevicePlatformService)
private readonly _http = inject(HttpClient)

// ❌ Incorrecto
private readonly _translateService = inject(TranslateService)
private readonly _ssoService = inject(SsoRedirectService)
```

Si encuentras código viejo con `_xxxService`, refactorízalo cuando toques ese archivo.

### 3.3 Orden de miembros en la clase

Sigue este orden, en este orden de prioridad:

1. **Por modificador de acceso**: `private` → `protected` → `public`.
2. **Dentro de cada modificador, por tipo**:
   1. Strings
   2. Números
   3. Booleans
   4. Arrays
   5. Objetos / interfaces
   6. Signals (`signal()`, `computed()`)
   7. Servicios inyectados (`inject(...)`)
   8. Métodos
3. **Excepciones**:
   - `constructor` (si existe) va arriba.
   - Lifecycle hooks (`ngOnInit`, `ngAfterViewInit`, etc.) entre métodos, en orden de ejecución.
   - `ngOnDestroy` al final.

Ejemplo:

```ts
export class ExampleComp {
  // --- private ---
  private readonly _apiUrl = '/api/v1'                          // string
  private readonly _retryLimit = 3                              // number
  private _isLoading = signal(false)                            // signal
  private readonly _data = signal<Data[]>([])                   // signal array
  private readonly _sso = inject(SsoRedirectService)            // service
  private _fetch(): void { /* ... */ }
  private _handleError(err: unknown): void { /* ... */ }

  // --- protected ---
  protected readonly defaultLang = 'en'
  protected readonly maxItems = 10
  protected readonly items = computed(() => this._data().slice(0, this.maxItems))
  protected onClick(): void { /* ... */ }

  // --- public ---
  public readonly title = input.required<string>()
  public ngOnInit(): void { /* ... */ }
  public ngOnDestroy(): void { /* ... */ }
}
```

> No fuerces el orden si rompe la lógica (cuando hay inicializaciones dependientes entre propiedades). Documenta la excepción con un comentario si pasa.

### 3.4 Sin comentarios innecesarios

No agregues comentarios obvios. Solo cuando el código tenga una decisión no evidente que vale la pena documentar.

---

## 4. Reglas de HTML

### 4.1 Atributos obligatorios

**Todo elemento visible o interactivo** debe tener:

- `id` único
- `data-cy` único (para tests Cypress)

Convención de naming: `<feature>-<section>-<element>`, en kebab-case.

Ejemplos:
```html
<button id="live-account-faq-help-btn" data-cy="live-account-faq-help-btn" />
<h2 id="live-account-faq-title" data-cy="live-account-faq-title" />
```

### 4.2 Orden de atributos HTML:
Sigue este orden estricto:

1. **Element ref** (`#refName`)
2. **Directivas estructurales** (`*ngIf`, `*ngFor` — preferimos `@if`/`@for` pero si quedan algunos legacy van aquí)
3. **`id`**
4. **`data-cy`**
5. **Atributos estáticos**: `class`, `type`, `aria-*`, `alt`, `src`, `href`, `width`, `height`, etc.
6. **Inputs / bindings**: `[property]`, `[class.*]`, `[attr.*]`, `[style.*]`
7. **Outputs / eventos**: `(click)`, `(submit)`, etc.

Ejemplo completo:
```html
<button
  #cancelBtn
  *ngIf="canCancel"
  id="live-account-form-cancel-btn"
  data-cy="live-account-form-cancel-btn"
  class="btn btn--ghost"
  type="button"
  [disabled]="isLoading()"
  [class.btn--loading]="isLoading()"
  (click)="onCancel()">
  Cancel
</button>
```

### 4.3 Control flow
Preferimos el nativo de Angular:
```html
@if (isLoading()) {
  <app-spinner />
} @else {
  <app-content />
}

@for (item of items; track item.id) {
  <app-item [data]="item" />
}
```

---

## 5. Reglas de SCSS y estilos

### 5.1 Preferencias
- **SCSS por defecto** para colores, tipografía, spacing, gradients, animaciones, sombras.
- **Tailwind sólo para responsive** (`tablet:`, `desktop:`) o utilidades flex/grid triviales.
- Si dudas, usa SCSS.

### 5.2 Breakpoints

Definidos en `src/tailwind.css`:
```
--breakpoint-mobile: 402px;
--breakpoint-tablet: 1024px;
--breakpoint-desktop: 1440px;
```

Tailwind: `class="text-sm tablet:text-base desktop:text-lg"`
SCSS: `@media (min-width: 1024px) { ... }`

### 5.3 BEM

Usa BEM para clases:
- Bloque: `.component`
- Elemento: `.component__element`
- Modificador: `.component--modifier`

### 5.4 Host por defecto

En cada componente:
```scss
:host {
  display: block;
  width: 100%;
}
```

### 5.5 Tokens, no hardcode

❌ Mal: `color: rgba(255, 255, 255, 0.7);`
✅ Bien: `color: var(--excent-text-on-dark-muted);`

---

## 6. Design Tokens (Excent)

Sistema centralizado de variables CSS para colores, opacidades y theming. **Siempre usa tokens**.

### 6.1 `src/styles.scss` — Theme-aware

Duplicados en `:root` (light) y `.dark` (dark). Hoy con mismos valores porque no hay diseño de light mode todavía. Cuando llegue, sólo se editan los valores en `:root` y todo el sitio se adapta.

**Texto sobre fondo oscuro**:
```
--excent-text-on-dark-primary    // #FFFFFF (1.0)
--excent-text-on-dark-soft       // 0.85
--excent-text-on-dark-secondary  // 0.80
--excent-text-on-dark-muted      // 0.70
--excent-text-on-dark-dim        // 0.60
--excent-text-on-dark-faint      // 0.50
```

**Accent**: `--excent-link-blue: #086EF9;`

**Pill** (reusable): `--excent-pill-border`, `--excent-pill-gradient-start/-end`, `--excent-pill-label`, `--excent-pill-dot-green/-glow`.

**Security cards**: `--excent-security-card-bg` (`#011C41`), `--excent-security-card-border`, `--excent-security-card-grid-line`, `--excent-security-card-glow-1..5` (del más claro `#80C4FF` al más oscuro `#0050FF`), `--excent-security-icon-bg`, etc.

**Navbar**: `--excent-navbar-*`.

### 6.2 `src/tailwind.css` — Estáticos

Colores fijos disponibles como utilidades Tailwind:
`--color-excent_blue-100/-700`, `--color-excent_red-*`, `--color-excent_orange`, `--color-excent_yellow`, etc.

### 6.3 Cuando agregues colores nuevos

- **Reutilizable** (texto, link, surface) → agregar a `styles.scss` en `:root` y `.dark` (mismos valores hasta que haya design de light).
- **Específico de un componente** → namespace con prefijo del componente: `--excent-<componente>-*`.

---

## 7. Componentes reutilizables (excent-*)

Viven en `src/app/components/` localmente y se promueven a `libraries/` cuando se estabilicen.

**Usa estos siempre que puedas antes de hacer uno desde cero**:

| Componente | Para qué |
|---|---|
| `<excent-button>` | Botones. Props: `color`, `radius`, `size`, `width` |
| `<excent-card>` | Cards. Variants: `blue`, `blue-bright`, `white-transparent`, `transparent`, `flag`. Toggle `showGrid` para cuadrícula |
| `<excent-text>` | Tipografía con variantes |
| `<excent-accordion>` + `<excent-accordion-item>` | Acordeón. `itemId`, `question`, `answer` como inputs |

Antes de crear un componente custom, pregúntate:
- ¿Existe ya un excent que resuelve esto?
- ¿Puedo extender uno con props/variants?
- ¿Es realmente reutilizable o sólo lo uso en un lugar?

---

## 8. Servicios y constantes

### 8.1 Servicios disponibles

`src/app/shared/services/`:

- **`SsoRedirectService`**: redirige al SSO de accounts/trading.
  - `goTo('sign-in' | 'sign-up')`
  - `goToTrading()`
- **`DevicePlatformService`**: detecta SO del dispositivo. Getters: `isAndroid`, `isIOS`, `isMobileOS`. Es SSR-safe (usa `isPlatformBrowser`).

### 8.2 Constantes centralizadas

`src/app/shared/constants.ts`. Si una URL externa se usa en más de un componente, agrégala aquí:
```ts
export const STORE_URLS = {
  appStore: '...',
  playStore: '...',
} as const
```

Antes de hardcodear una URL en un componente, agrégala aquí.

---

## 9. Traducciones (i18n)

### 9.1 Ubicación

`~/Documents/translates/website/i18n/`
Idiomas: `en.json`, `es.json`, `fr.json`, `it.json`, `pt.json`, `yue.json`.

Angular las carga desde `/assets/i18n/` (mapeado en `angular.json`).

### 9.2 Convenciones obligatorias

1. **Keys en kebab-case** para palabras compuestas.
2. **Una jerarquía por sección**: `live-account.security.cards.assets.title`.
3. **Orden recursivo dentro de cada objeto**:
   - Primero **keys flat** (string values).
   - Después **keys que son objetos**.

   Ejemplo correcto:
   ```json
   "faq": {
     "title": "FAQ",
     "contact-support": "Contact Support",
     "help-center": "Help Center",
     "questions": {
       "q1": { "question": "...", "answer": "..." }
     }
   }
   ```

4. **Orden de bloques top-level**:
   1. Keys flat sueltas (`crypto`, `commodities`, etc.)
   2. Componentes globales (`footer`, `navbar`, `browser-title`)
   3. Páginas en orden de display (`home`, `live-account`, etc.) con sub-secciones en orden visual.

5. **No duplicar palabras**: si una palabra común reusable existe a nivel root (`create-account`), úsala antes de duplicar.

6. **Title Case en valores** cuando el diseño lo pida.

### 9.3 Workflow al agregar texto

1. Identifica la sección donde vive el texto.
2. Agrega la key respetando el orden flat → object.
3. Actualiza todos los idiomas disponibles (o al menos `en.json`).
4. Usa en HTML: `{{ 'section.key' | translate }}`.

---

## 10. Naming conventions

### 10.1 Componentes

- **Kebab-case**, **máximo 3 palabras cortas**.
- Ejemplos válidos: `card-stats`, `nombre-comp-3`, `excent-accordion`.
- Ejemplos a evitar: `super-long-component-name-with-too-many-words`, `Card_Stats` (snake/Pascal).

### 10.2 Servicios

- Sufijo `Service` en la **clase**: `SsoRedirectService`, `DevicePlatformService`.
- **Sin sufijo `Service` en la variable inyectada**: `_sso`, `_device`.

### 10.3 Archivos

- Componentes: `component-name.ts`, `.html`, `.scss`, `.spec.ts`.
- Servicios: `service-name.service.ts`.
- Carpetas: kebab-case.

### 10.4 IDs y data-cy

- Patrón: `<feature>-<section>-<element>`.
- Ejemplos: `live-account-faq-title`, `home-hero-create-btn`.

---

## 11. Workflow al crear un componente

1. **Decide ubicación**:
   - Reutilizable → `src/app/components/excent-<nombre>/`
   - Específico de feature → dentro del feature correspondiente.
2. **Nombre kebab-case, máx 3 palabras**.
3. **Estructura**:
   ```
   componente/
   ├── componente.ts
   ├── componente.html
   ├── componente.scss
   └── componente.spec.ts
   ```
4. **Registra en el padre** (imports + uso en HTML).
5. **TS**: sigue orden private → protected → public, dentro por tipo.
6. **HTML**: sigue orden de atributos (#ref, directivas, id, data-cy, class/type/aria, [bindings], (events)).
7. **SCSS**: BEM, tokens excent, `:host { display: block; width: 100%; }` por defecto.
8. **Agrega traducciones** en `~/Documents/translates/website/i18n/`.
9. **Tests**: completa el `.spec.ts` con al menos el smoke test.
10. **Verifica en navegador** (`ng serve`).

---

## 12. Checklist de PR

Antes de abrir el PR, verifica:

- [ ] El código sigue **inject()** (no constructor).
- [ ] Servicios inyectados **sin sufijo `Service`** en la variable.
- [ ] **Orden de miembros**: private → protected → public, por tipo.
- [ ] **HTML**: `id` y `data-cy` en todos los elementos visibles/interactivos.
- [ ] **Orden de atributos** HTML respetado.
- [ ] **Control flow** nativo (`@if`, `@for`) en vez de `*ngIf`/`*ngFor`.
- [ ] **Signals** para estado (no `BehaviorSubject` cuando no se necesita).
- [ ] **Standalone**, sin NgModules.
- [ ] **Estilos en SCSS**, Tailwind sólo para responsive.
- [ ] **Tokens excent** en todos los colores (no hardcoded).
- [ ] **Componente excent** usado donde aplica (en vez de un elemento crudo).
- [ ] **Traducciones** agregadas en `~/Documents/translates/website/i18n/` con orden correcto.
- [ ] **Sin comentarios** innecesarios.
- [ ] **Nombre del componente**: kebab-case, máx 3 palabras.
- [ ] **Tests**: el `.spec.ts` al menos crea el componente sin error.

---

## Recursos

- Angular 20 docs: https://angular.dev/
- Signals: https://angular.dev/guide/signals
- Control flow: https://angular.dev/guide/templates/control-flow
- ngx-translate: https://github.com/ngx-translate/core
- Tailwind v4: https://tailwindcss.com/docs/v4-beta

---
