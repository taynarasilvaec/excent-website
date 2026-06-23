import { env } from '../../environment/environment'

export const STORE_URLS = {
  appStore: 'https://apps.apple.com/br/app/excent-capital-mobile-trading/id6749273352',
  playStore: 'https://play.google.com/store/apps/details?id=capital.excent.app&pcampaignid=web_share',
} as const

/** App del ecosistema Excent para el launcher (icono de apps en el navbar). */
export interface EcosystemApp {
  id: string
  label: string
  description: string
  url: string
  icon: string
}

/**
 * Ecosistema Excent Capital. URLs centralizadas desde `environment`.
 * NOTA: MaM apunta al portal de cuentas (ACCOUNTS) por ahora — confirmar si
 * tiene subdominio propio y, de ser así, agregarlo a `environment`.
 */
export const ECOSYSTEM_APPS: EcosystemApp[] = [
  {
    id: 'trading',
    label: 'Trading',
    description: 'Trading platform',
    url: env.TRADING,
    icon: '/assets/icons/terminal.svg',
  },
  {
    id: 'mam',
    label: 'MaM Account',
    description: 'Multi-Account Manager',
    url: env.ACCOUNTS,
    icon: '/assets/icons/balance.svg',
  },
  {
    id: 'accounts',
    label: 'Client Portal',
    description: 'Account & funding',
    url: env.ACCOUNTS,
    icon: '/assets/icons/coins.svg',
  },
  {
    id: 'backoffice',
    label: 'Backoffice',
    description: 'Partner & IB area',
    url: env.BACKOFFICE,
    icon: '/assets/icons/security.svg',
  },
  {
    id: 'mobile',
    label: 'Mobile App',
    description: 'Trade on the go',
    url: env.MOBILE,
    icon: '/assets/icons/android.svg',
  },
  {
    id: 'knowledge',
    label: 'Knowledge Base',
    description: 'Guides & help',
    url: env.KNOWLEDGE,
    icon: '/assets/icons/security.svg',
  },
]

export const SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'it', 'pt', 'yue'] as const
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

export interface LanguageItem {
  id: number
  name: string
  shortName: string
  img?: string
}

export interface LanguageOption {
  code: SupportedLanguage
  label: string
  flag: string
}

export const LANGUAGE_MENU_OPTIONS: LanguageOption[] = [
  { code: 'en', label: 'English',    flag: '/assets/icons/eng.svg' },
  { code: 'es', label: 'Español',    flag: '/assets/icons/esg.svg' },
  { code: 'pt', label: 'Português',  flag: '/assets/icons/ptg.svg' },
  { code: 'fr', label: 'Français',   flag: '/assets/icons/frg.svg' },
  { code: 'it', label: 'Italiano',   flag: '/assets/icons/itg.svg' },
]
