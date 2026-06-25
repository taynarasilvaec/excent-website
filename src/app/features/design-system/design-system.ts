import { Component, inject } from '@angular/core'
import { ExcentAccordion } from '../../components/excent-accordion/excent-accordion'
import { ExcentAccordionItem } from '../../components/excent-accordion/excent-accordion-item'
import { BentoItem, ExcentBento } from '../../components/excent-bento/excent-bento'
import { ExcentButton } from '../../components/excent-button/excent-button'
import { ExcentFaq, FaqEntry } from '../../components/excent-faq/excent-faq'
import { ExcentPill } from '../../components/excent-pill/excent-pill'
import { ExcentCard } from '../../components/excent-card/excent-card'
import { ExcentText } from '../../components/excent-text/excent-text'
import { ThemeService } from '../../shared/services/theme.service'

interface TokenSwatch {
  name: string
  label: string
}

interface HeadingSpec {
  variant: 'display' | 'title' | 'subtitle' | 'body' | 'footer-text' | 'kicker'
  tag: string
  size: string
  weight: string
  usage: string
}

@Component({
  selector: 'app-design-system',
  standalone: true,
  imports: [ExcentButton, ExcentCard, ExcentText, ExcentBento, ExcentFaq, ExcentPill, ExcentAccordion, ExcentAccordionItem],
  templateUrl: './design-system.html',
  styleUrl: './design-system.scss',
})
export class DesignSystem {
  private readonly _theme = inject(ThemeService)

  protected readonly isDark = this._theme.isDark

  protected readonly buttonColors = ['blue', 'white', 'outline', 'outline-white'] as const
  protected readonly buttonSizes = ['md', 'lg'] as const
  protected readonly cardColors = ['blue', 'blue-bright', 'white-transparent', 'transparent', 'flag'] as const

  // The ONE bento card style. Every page reuses <excent-bento>; only the grid
  // arrangement (cols + per-card colSpan/rowSpan) changes — never the card shell.
  protected readonly bentoCards: BentoItem[] = [
    { mediaPanel: true, title: 'Tall card with a media slot.', button: 'Get Started', rowSpan: 2 },
    { icon: '/assets/icons/balance.svg', title: 'Title with', titleDim: 'a dimmed tail' },
    { icon: '/assets/icons/security.svg', stat: '24/7', statLabel: 'Stat + label' },
    { icon: '/assets/icons/terminal.svg', title: 'Wide card.', titleDim: 'Spans two columns.', colSpan: 2 },
  ]

  // The ONE FAQ block. Every page reuses <excent-faq> — title + items only.
  protected readonly faqItems: FaqEntry[] = [
    { id: 1, question: 'How do I reuse the FAQ block?', answer: 'Drop <excent-faq [title]="…" [items]="…" /> on the page — never rebuild the title + accordion by hand.' },
    { id: 2, question: 'Can the title and answers be translated?', answer: 'Yes — pass an i18n key or a literal string; the component applies the translate pipe either way.' },
  ]

  // Canonical heading/type scale — the ONLY source of truth. Use <excent-text>
  // with these variants; never hardcode font-size/weight/color on a page.
  protected readonly headings: HeadingSpec[] = [
    { variant: 'display', tag: 'h1', size: '40 → 56px', weight: '400', usage: 'Hero headline' },
    { variant: 'title', tag: 'h2', size: '28 → 44px', weight: '500', usage: 'Section title' },
    { variant: 'subtitle', tag: 'h3', size: '18 → 24px', weight: '500', usage: 'Card / sub-section' },
    { variant: 'body', tag: 'p', size: '16px', weight: '400', usage: 'Body copy' },
    { variant: 'footer-text', tag: 'span', size: '12 → 14px', weight: '400', usage: 'Fine print / footer' },
    { variant: 'kicker', tag: 'span', size: '11px', weight: '500', usage: 'Uppercase label' },
  ]

  // Semantic text colors (theme-aware tokens consumed by excent-text).
  protected readonly textColors: TokenSwatch[] = [
    { name: '--excent-text-on-dark-primary', label: 'Text primary' },
    { name: '--excent-text-on-dark-secondary', label: 'Text secondary' },
    { name: '--excent-text-on-dark-muted', label: 'Text muted' },
    { name: '--excent-text-on-dark-dim', label: 'Text dim' },
    { name: '--excent-text-on-dark-faint', label: 'Text faint' },
  ]

  protected readonly colorTokens: TokenSwatch[] = [
    { name: '--excent-link-blue', label: 'Link / accent' },
    { name: '--excent-positive', label: 'Positive (up)' },
    { name: '--excent-negative', label: 'Negative (down)' },
    { name: '--excent-background', label: 'Background' },
    { name: '--excent-text-on-dark-primary', label: 'Text primary' },
    { name: '--excent-card-blue-bg', label: 'Card surface' },
    { name: '--excent-hairline', label: 'Hairline' },
  ]

  protected readonly spacingTokens: TokenSwatch[] = [
    { name: '--excent-gutter', label: 'Page gutter (responsive)' },
    { name: '--excent-fullbleed-pad', label: 'Full-bleed inner padding' },
    { name: '--excent-card-pad', label: 'Card padding' },
  ]

  protected toggleTheme(): void {
    this._theme.toggle()
  }
}
