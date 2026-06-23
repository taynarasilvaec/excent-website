import { NavbarLogo, NavItem } from '../components/navbar/navbar.types'

export const NAVBAR_LOGO: NavbarLogo = {
  src: '/assets/images/logo-excent.svg',
  alt: 'Excent Capital',
  class: 'h-[21.34px] w-31.75 tablet:w-39.75 tablet:h-[26.717px]',
}

export const NAVBAR_ITEMS: NavItem[] = [
  {
    label: 'navbar.trading',
    link: 'trading',
    mega: {
      sections: [
        {
          title: 'navbar.trading-submenu.accounts',
          items: [
            { label: 'navbar.trading-submenu.live-account', link: 'trading/accounts/live-account' },
            { label: 'navbar.trading-submenu.demo-account', link: 'trading/accounts/demo-account' },
            { label: 'navbar.trading-submenu.mam-account', link: 'trading/accounts/mam-ecosystem' },
          ]
        },
        {
          title: 'navbar.trading-submenu.execution',
          items: [
            { label: 'navbar.trading-submenu.platform', link: 'trading/execution/platform' },
            { label: 'navbar.trading-submenu.deposits-and-withdrawals', link: 'trading/execution/deposits-and-withdrawals' },
            { label: 'navbar.trading-submenu.instant-execution', link: 'trading/execution/instant-execution' },
          ]
        }
      ],
      // MOCK: webinar promo (matches Figma 529-8637). Image + link are placeholders
      // until the webinar page exists.
      promo: {
        kicker: 'Watch Our Latest Webinar:',
        title: 'Resumen de Febrero',
        image: '/assets/images/trump.png',
        link: '/en/resources/excent-academy/webinars',
      }
    }
  },
  {
    label: 'navbar.markets',
    link: 'markets',
    mega: {
      sections: []
    }
  },
  {
    label: 'navbar.resources',
    link: 'resources',
    mega: {
      sections: []
    }
  },
  {
    label: 'navbar.company',
    link: 'company',
    mega: {
      sections: []
    }
  },
  {
    label: 'navbar.partners',
    link: 'https://partners.excent.capital',
    external: true
  }
]
