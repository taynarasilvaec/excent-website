import { Component, computed, inject } from '@angular/core'
import { TranslateModule } from '@ngx-translate/core'
import { ThemeService } from '../services/theme.service'

interface FooterNavItem {
  labelKey: string
  href: string
  external?: boolean
}

interface FooterNavGroup {
  titleKey: string
  href?: string
  external?: boolean
  items?: FooterNavItem[]
}

interface FooterSocial {
  id: string
  href: string
  icon: string
  ariaLabel: string
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  private readonly _theme = inject(ThemeService)

  protected readonly currentYear = new Date().getFullYear()
  // Blue wings always; black wordmark on light, white on dark.
  protected readonly logoSrc = computed(() =>
    this._theme.isDark()
      ? '/assets/images/logo-excent.svg'
      : '/assets/images/logo-excent-black.svg',
  )

  protected readonly socials: readonly FooterSocial[] = [
    {
      id: 'linkedin',
      href: 'https://es.linkedin.com/company/excentcapital',
      icon: '/assets/icons/linkedin.svg',
      ariaLabel: 'LinkedIn',
    },
    {
      id: 'instagram',
      href: 'https://www.instagram.com/excentcapital?igsh=MXJ0MW82ZG1xMWxmaQ==',
      icon: '/assets/icons/instagram.svg',
      ariaLabel: 'Instagram',
    },
    {
      id: 'facebook',
      href: 'http://facebook.com/people/Excent-Capital-Ltd/61567995550399/?locale=pt_BR#',
      icon: '/assets/icons/facebook.svg',
      ariaLabel: 'Facebook',
    },
    {
      id: 'telegram',
      href: 'https://t.me/excentcapitalspn',
      icon: '/assets/icons/telegram.svg',
      ariaLabel: 'Telegram',
    },
    {
      id: 'x',
      href: 'https://x.com/ExcentCapital',
      icon: '/assets/icons/x.svg',
      ariaLabel: 'X',
    },
    {
      id: 'youtube',
      href: 'https://www.youtube.com/@ExcentCapital',
      icon: '/assets/icons/youtube.svg',
      ariaLabel: 'YouTube',
    },
  ]

  protected readonly navGroups: readonly FooterNavGroup[] = [
    {
      titleKey: 'footer.nav.trading.title',
      items: [
        { labelKey: 'footer.nav.trading.accounts', href: '#' },
        { labelKey: 'footer.nav.trading.execution', href: '#' },
      ],
    },
    {
      titleKey: 'footer.nav.markets.title',
      items: [
        { labelKey: 'footer.nav.markets.asset-classes', href: '#' },
        { labelKey: 'footer.nav.markets.conditions', href: '#' },
      ],
    },
    {
      titleKey: 'footer.nav.resources.title',
      items: [
        { labelKey: 'footer.nav.resources.tools', href: '#' },
        { labelKey: 'footer.nav.resources.excent-academy', href: '#' },
      ],
    },
    {
      titleKey: 'footer.nav.company.title',
      items: [
        { labelKey: 'footer.nav.company.about-us', href: '#' },
        { labelKey: 'footer.nav.company.contact-us', href: '#' },
      ],
    },
    {
      titleKey: 'footer.nav.help.title',
      items: [
        { labelKey: 'footer.nav.help.support', href: '#', external: true },
        { labelKey: 'footer.nav.help.help-center', href: '#' },
        { labelKey: 'footer.nav.help.faqs', href: '#' },
      ],
    },
    {
      titleKey: 'footer.nav.partner',
      href: '#',
      external: true,
    },
  ]
}
