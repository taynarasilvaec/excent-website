import { inject } from '@angular/core'
import { CanMatchFn, Router, UrlSegment } from '@angular/router'
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '../constants'

export const languageGuard: CanMatchFn = (_route, segments: UrlSegment[]) => {
  const router = inject(Router)
  const lang = segments[0]?.path
  if (lang && (SUPPORTED_LANGUAGES as readonly string[]).includes(lang)) {
    return true
  }
  return router.parseUrl('/en')
}

export function isSupportedLanguage(value: string): value is SupportedLanguage {
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(value)
}
