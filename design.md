# Excent Capital — Design System

Guia da identidade visual do site (Angular 20). Fonte de verdade dos tokens: `src/styles.scss` e `src/tailwind.css`. Página viva: **`/designsystem`**.

> Regra de ouro: **sempre use tokens e componentes `excent-*` existentes**. Não hardcode cores, tamanhos de fonte ou espaçamentos. "Muda um, muda todos."

---

## 1. Princípios

1. **Tokens primeiro** — toda cor/opacidade/espaçamento vem de uma CSS variable (`--excent-*`). Nada hardcoded.
2. **Componentes compartilhados** — antes de criar algo novo, use um `excent-*`. Bento e FAQ têm **um** componente cada para o site inteiro.
3. **Theme-aware** — tudo responde a light/dark via `.dark` no `<html>`. Default é dark.
4. **Title Case** em todos os títulos/headings (capitaliza cada palavra).
5. **Quebras de linha autorais** — títulos respeitam exatamente as quebras escritas (`<br>`); nunca deixar auto-wrap quebrar diferente.

---

## 2. Tema (light / dark)

- `ThemeService` adiciona/remove a classe `.dark` no `<html>` (persiste em `localStorage`, default **dark**). Toggle no navbar.
- Tokens são duplicados em `:root` (light) e `.dark` (dark) em `src/styles.scss`. Para mudar o tema, edita-se só os valores — o site inteiro se adapta.
- Heros internos (live-account, MAM) são **palcos navy escuros nos dois temas** (fundo fixo), não viram claros no light.

---

## 3. Tokens de cor (`src/styles.scss`)

### Texto sobre fundo (escala de hierarquia, theme-aware)
| Token | Uso |
|---|---|
| `--excent-text-on-dark-primary` | Títulos / texto principal |
| `--excent-text-on-dark-secondary` | Subtítulos |
| `--excent-text-on-dark-soft` | Texto suave |
| `--excent-text-on-dark-muted` | Descrições |
| `--excent-text-on-dark-dim` | Texto auxiliar |
| `--excent-text-on-dark-faint` | Fine print |

> Dark = brancos com opacidade decrescente (#FFF → 0.85 → 0.80 → 0.70 → 0.62 → 0.55).
> Light = navy `#111827` com opacidade decrescente (0.92 → 0.78 → … → 0.55).

### Acento e estado
| Token | Valor (aprox.) | Uso |
|---|---|---|
| `--excent-link-blue` | `#086EF9` | Links / acento |
| `--excent-positive` | dark `#22c55e` · light `#15803d` | Alta / sucesso |
| `--excent-negative` | dark `#ef4444` · light `#dc2626` | Baixa / erro |

### Superfícies / linhas
`--excent-background`, `--excent-surface-translucent`, `--excent-hairline`, `--excent-card-blue-bg`, `--excent-navbar-*`.

### Namespaces de componente
- **Security/Bento cards:** `--excent-security-card-bg`, `--excent-security-card-border`, `--excent-security-card-grid-line`, `--excent-security-card-glow-1..5`, `--excent-security-icon-*`.
- **Pill:** `--excent-pill-border`, `--excent-pill-gradient-start/-end`, `--excent-pill-label`, `--excent-pill-dot-green`.

### Cores estáticas (`src/tailwind.css`)
`--color-excent_blue-100/-700`, `--color-excent_red-*`, `--color-excent_orange`, `--color-excent_yellow`, `--color-excent_gray`.

**Onde adicionar cor nova:** reutilizável (texto/link/surface) → `:root` + `.dark` em `styles.scss`. Específica de componente → namespace (`--excent-<comp>-*`).

---

## 4. Tipografia — `<excent-text>`

Uma única escala. **Nunca** hardcode `font-size`/`weight`. Use `<excent-text variant="…" as="…">`.

| variant | tag | tamanho (mob → desk) | peso | uso |
|---|---|---|---|---|
| `display` | h1 | 40 → 56px | 400 | Headline de hero |
| `title` | h2 | 28 → 44px | 500 | Título de seção |
| `subtitle` | h3 | 18 → 24px | 500 | Card / sub-seção |
| `body` | p | 16px | 400 | Corpo de texto |
| `footer-text` | span | 12 → 14px | 400 | Fine print / footer |
| `kicker` | span | 11px | 500 | Label uppercase |

Cores vêm dos tokens (`color="inherit"` para herdar). Títulos em **Title Case**.

---

## 5. Layout & containers

Breakpoints (`src/tailwind.css`): **mobile 402px · tablet 1024px · desktop 1440px**.

### Sistema de gutter (REGRA dos containers)
- O `<main>` / `.page-shell` é **largura total, sem gutter**.
- O gutter é responsabilidade de **cada seção**, via `.section-contained` (`padding-inline: var(--excent-gutter)` → 6 / 16 / 20px).
- Seções full-bleed (faixas coloridas, heros) usam `.full-bleed`; conteúdo interno alinha com `.full-bleed__inner` (40px).
- Isso permite que seções full-bleed toquem as bordas da viewport.

```scss
--excent-gutter: 6px;            /* mobile */
@media (min-width: 1024px) { --excent-gutter: 16px; }
@media (min-width: 1440px) { --excent-gutter: 20px; }
```

### Hero das páginas internas — `.section-hero`
`min-height: 80vh` + `padding-top: 120px` (mobile) / `180px` (desktop) — para o conteúdo não ficar sob o navbar fixo. (O hero da home é full-bleed 100vh, exceção.)

---

## 6. Componentes `excent-*`

| Componente | Selector | Para quê |
|---|---|---|
| Button | `<excent-button>` | Botões. Props: `color` (blue, white, outline, outline-white), `radius`, `size` (md/lg), `width` |
| Card | `<excent-card>` | Cards. `color`: blue, blue-bright, white-transparent, transparent, flag. `background="grid"` para cuadrícula |
| Text | `<excent-text>` | Tipografia (ver §4) |
| Accordion | `<excent-accordion>` + `<excent-accordion-item>` | Acordeão. Item: `itemId`, `question`, `answer`, `linkLabel?`, `linkHref?`. Wrapper: `initialActiveId` |
| **Bento** | `<excent-bento>` | **Grid bento ÚNICO** da identidade (ver §7) |
| **FAQ** | `<excent-faq>` | **Bloco de FAQ ÚNICO** (ver §7) |
| Glow | `<excent-glow>` | Brilho radial decorativo. Props: `position`/`top/right/bottom/left`, `width`, `height`, `blur` |
| Static Icon | `<excent-static-icon>` | Ícone remoto (símbolos/flags). `type`, `name`, `size`, `shape`, `radius`. Resolve de `${SYMBOLS_URL}<name>.svg` (S3) |
| Live Spark | `<live-spark>` | Sparkline **animado** (random-walk, rAF, SSR-safe). Stroke 1px + área com degradê a azul escuro op.0. Prop: `up` |

---

## 7. Padrões obrigatórios (um componente para todo o site)

### Bento grid — `<excent-bento>`
3 colunas / **5 slots fixos**: `0 tall · 1 short · 2 short · 3 medium · 4 tall+link`.
- Props: `[items]` (`BentoItem[]`: `icon`, `title`, `description?`, `link?`), `name` (prefixo de ids).
- `title`/`description`/`link` aceitam string **ou** key i18n (aplica `| translate`).
- **REGRA:** todo bento usa `<excent-bento>`. As páginas só **reordenam os items** — nunca reconstroem o grid à mão. (live-account e MAM compartilham o mesmo grid, só muda a ordem.)

### FAQ — `<excent-faq>`
Título Title Case (`excent-text`) + `excent-accordion`.
- Props: `title` (string/key), `[items]` (`FaqEntry[]`: `id`, `question`, `answer`, `link?{label,href}`), `initialActiveId`.
- **REGRA:** todo FAQ usa `<excent-faq>`. Só muda título + items.

---

## 8. Regras de código (resumo)

- **Standalone components** + **signals** (`signal`, `computed`, `effect`, `input()`, `output()`), `inject()` (sem sufixo `Service` na variável).
- HTML: ordem de atributos `#ref` → estruturais → `id` → `data-cy` → estáticos → `[inputs]` → `(outputs)`. `id` e `data-cy` obrigatórios em elementos com identidade/interativos (`<feature>-<section>-<element>`).
- SCSS: BEM (`.bloco__elemento--modificador`), tokens excent, `:host { display:block; width:100% }`.
- i18n: keys em kebab-case, traduções em repo irmão remoto (`I18N_URL`). Texto novo segue ordem flat → object por seção.

---

## 9. Conteúdo client-facing (compliance)

FX/CFD é alto risco. Em conteúdo externo: **nunca** prometer/projetar lucros, incluir aviso de risco, sem conselho de investimento personalizado. Números nunca inventados (rotular ESTIMATE com premissas). Moeda explícita (USD/BRL/MXN), datas ISO. Toda publicação externa passa por revisão de compliance/management.

---

## Referências
- `src/styles.scss` — todos os tokens theme-aware
- `src/tailwind.css` — breakpoints + cores estáticas
- `/designsystem` — página viva com swatches e componentes
- `CLAUDE.md` / `rules.md` — regras detalhadas e onboarding
