import { Component, inject } from '@angular/core'
import { ExcentAccordion } from '../../components/excent-accordion/excent-accordion'
import { ExcentAccordionItem } from '../../components/excent-accordion/excent-accordion-item'
import { ExcentButton } from '../../components/excent-button/excent-button'
import { ExcentCard } from '../../components/excent-card/excent-card'
import { ExcentText } from '../../components/excent-text/excent-text'
import { ThemeService } from '../../shared/services/theme.service'

interface TokenSwatch {
  name: string
  label: string
}

@Component({
  selector: 'app-design-system',
  standalone: true,
  imports: [ExcentButton, ExcentCard, ExcentText, ExcentAccordion, ExcentAccordionItem],
  templateUrl: './design-system.html',
  styleUrl: './design-system.scss',
})
export class DesignSystem {
  private readonly _theme = inject(ThemeService)

  protected readonly isDark = this._theme.isDark

  protected readonly buttonColors = ['blue', 'white', 'outline', 'outline-white'] as const
  protected readonly buttonSizes = ['md', 'lg'] as const
  protected readonly textVariants = ['display', 'title', 'subtitle', 'body', 'footer-text', 'kicker'] as const
  protected readonly cardColors = ['blue', 'blue-bright', 'white-transparent', 'transparent', 'flag'] as const

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
