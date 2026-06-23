import { HttpClient } from '@angular/common/http'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { env } from '../../environment/environment'

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, env.I18N_URL, '.json')
}

export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const ca: Array<string> = document.cookie.split(';')
  const caLen: number = ca.length
  const cookieName = `${name}=`
  let c: string

  for (let i = 0; i < caLen; i += 1) {
    c = ca[i].replace(/^\s+/g, '')
    if (c.indexOf(cookieName) == 0) {
      return c.substring(cookieName.length, c.length)
    }
  }
  return null
}
