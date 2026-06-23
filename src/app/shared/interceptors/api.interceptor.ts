import { HttpInterceptorFn } from '@angular/common/http'
import { inject } from '@angular/core'
import { catchError, throwError } from 'rxjs'
import { env } from '../../../environment/environment'
import { AuthCookieService } from '../services/auth-cookie.service'
import { StoreService } from '../services/store.service'

const PUBLIC_ROUTES = [
  '/i18n/',
  '/assets/',
  '/core/refresh/',
  '/core/token/',
  '/core/code/',
  '/core/country/',
  '/users/register/',
  '/users/reset-password/',
  '/users/verify/',
  '/catalog/countries/',
  '/catalog/login-status/',
  '/catalog/languages/',
  'google-auth',
  'apple-auth',
]

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(StoreService)
  const auth = inject(AuthCookieService)

  const isAbsolute = /^https?:\/\//.test(req.url)
  const url = isAbsolute ? req.url : env.BACKEND + ensureLeadingSlash(req.url)

  const isPublic = PUBLIC_ROUTES.some((route) => url.includes(route))
  let headers = req.headers
  const token = store.token

  if (!isPublic && token) {
    headers = headers.set('Authorization', `Bearer ${token}`)
  }

  const cloned = req.clone({ headers, url })

  return next(cloned).pipe(
    catchError((error: unknown) => {
      const status = (error as { status?: number })?.status
      if (status === 401 && !isPublic) {
        auth.logout()
      }
      return throwError(() => error)
    })
  )
}

function ensureLeadingSlash(path: string): string {
  return path.startsWith('/') ? path : `/${path}`
}
