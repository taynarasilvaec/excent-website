let base_url: string = "dev.excent.capital"
let static_url: string = "https://excent-static-dev.s3.us-east-1.amazonaws.com"

export const env = {
  NAME: "dev",
  TAG: "Development",
  VERSION: "",
  IS_PROD: false,
  REFRESH: "refresh_dev",
  PARAMS: "params_dev",
  // Static Files
  I18N_URL: `${static_url}/i18n/website/`,
  SYMBOLS_URL: `${static_url}/images/symbols/`,
  FLAGS_URL: `${static_url}/images/flags/`,
  AGREEMENTS_URL: `${static_url}/agreements/`,
  ICONS_URL: `${static_url}/images/icons/`,
  // SSO
  DOMAIN: `.${base_url}`,
  SUBDOMAIN: `.${base_url}`,
  // FRONTEND
  TRADING: `https://app.${base_url}`,
  MOBILE: `https://mobile.${base_url}`,
  ACCOUNTS: `https://accounts.${base_url}`,
  BACKOFFICE: `https://boffice.${base_url}`,
  // WEB
  WEBSITE: `https://${base_url}`,
  KNOWLEDGE: `https://knowledgebase.${base_url}`,
  // API
  BACKEND: `https://api.${base_url}/api/v1`,
  SYMBOLS_WS: `wss://api.${base_url}/api/v1/ws/symbols/`,
  NOTIFICATIONS_WS: `wss://api.${base_url}/api/v1/ws/notifications/`,
  // Keys
  USE_CAPTCHA: false,
  RECAPTCHA: "",
  RECAPTCHA_KEY_V2: "",
  SENTRY_DSN: "",
  BANK_ACCOUNT: "DEV-ABC00DEF00000000000"
}
