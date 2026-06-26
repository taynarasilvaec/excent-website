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
          title: 'Accounts',
          items: [
            { label: 'Live Account', link: 'live-account' },
            { label: 'Demo Account', link: 'demo-account' },
            { label: 'MAM Account', link: 'mam-ecosystem' },
          ]
        },
        {
          title: 'Execution',
          items: [
            { label: 'Platform', link: 'platform' },
            { label: 'Deposits & Withdrawals', link: 'deposits-and-withdrawals' },
            { label: 'Instant Execution', link: 'instant-execution' },
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
      sections: [
        {
          title: 'Asset Classes',
          items: [
            { label: 'Asset Classes', link: 'markets/asset-classes' },
            { label: 'Asset Groups', link: 'markets/asset-groups' },
          ],
        },
        {
          title: 'Trading Conditions',
          items: [
            { label: 'Spread', link: 'markets/conditions/spread' },
            { label: 'Leverage & Margin', link: 'markets/conditions/leverage-and-margin' },
            { label: 'Swap', link: 'markets/conditions/swap' },
          ],
        },
      ],
    },
  },
  {
    label: 'navbar.resources',
    link: 'resources',
    mega: {
      sections: [
        {
          title: 'Tools',
          items: [
            { label: 'Economic Calendar', link: 'resources/tools/economic-calendar' },
            { label: 'Corporate Calendar', link: 'resources/tools/corporate-calendar' },
            { label: 'Analysis IQ', link: 'resources/tools/analysis-iq' },
            { label: 'News IQ', link: 'resources/tools/news-iq' },
            { label: 'Calculators', link: 'resources/tools/calculators' },
          ],
        },
        {
          title: 'Excent Academy',
          items: [
            { label: 'Market Blog', link: 'resources/excent-academy/market-blog' },
            { label: 'Webinars', link: 'resources/excent-academy/webinars' },
            { label: 'Glossary', link: 'resources/excent-academy/glossary' },
            { label: 'Knowledge Base', link: 'resources/knowledge-base' },
          ],
        },
      ],
    },
  },
  {
    label: 'navbar.company',
    link: 'company',
    mega: {
      sections: [
        {
          title: 'About Us',
          items: [
            { label: 'About Us', link: 'company/about-us' },
            { label: 'Regulations', link: 'company/about-us/regulations' },
            { label: 'Legal Area', link: 'company/about-us/legal-area' },
          ],
        },
        {
          title: 'Help',
          items: [
            { label: 'Help Center', link: 'company/help-center' },
            { label: 'Support', link: 'company/help/support' },
            { label: 'FAQ', link: 'company/help/faq' },
          ],
        },
      ],
    },
  },
  {
    label: 'navbar.partners',
    link: 'https://partners.excent.capital',
    external: true
  }
]
