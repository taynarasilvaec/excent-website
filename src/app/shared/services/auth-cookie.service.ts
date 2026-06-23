import { isPlatformBrowser } from '@angular/common'
import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core'
import { ExcentServCatalogsService } from '../../../excent-shims/excent-serv-catalogs/index'
import { CookieService } from 'ngx-cookie-service'
import { firstValueFrom } from 'rxjs'
import { env } from '../../../environment/environment'
import { getCookie } from '../utils'
import { ConnectSocketService } from './connect-socket.service'
import { LanguageService } from './language.service'
import { IUserLogin, StoreService } from './store.service'

interface RefreshCookiePayload {
  refresh: string
  email: string
  access: string
  timestamp: number
}

interface RefreshTokenResponse {
  access: string
  refresh: string
  login: IUserLogin
}

@Injectable({ providedIn: 'root' })
export class AuthCookieService {
  private readonly _platformId = inject(PLATFORM_ID)
  private readonly _cookie = inject(CookieService)
  private readonly _http = inject(HttpClient)
  private readonly _store = inject(StoreService)
  private readonly _catalogs = inject(ExcentServCatalogsService)
  private readonly _socket = inject(ConnectSocketService)
  private readonly _language = inject(LanguageService)
  private readonly _payload = signal<RefreshCookiePayload | null>(this._readPayload())

  public readonly isLoggedIn = computed(() => this._payload() !== null)
  public readonly userEmail = computed(() => this._payload()?.email ?? null)
  public readonly userInfo = this._store.login

  constructor() {
    if (!isPlatformBrowser(this._platformId)) return
    if (this._payload() === null) this._store.setPremium(false)
  }

  public async init(): Promise<void> {
    if (!isPlatformBrowser(this._platformId)) return
    const payload = this._payload()
    if (!payload) return

    try {
      const refreshStored = this._store.refreshToken
      const tokenStored = this._store.token

      if (!tokenStored) {
        await this._createJWT(payload)
      } else if (payload.refresh !== refreshStored) {
        this._store.clear()
        await this._createJWT(payload)
      }

      const login = this._store.login()
      if (this._store.token && login?.uuid) {
        await this._fetchUserDetails(login.uuid)
        this._language.updateFromStore()
        this._catalogs.init()
        this._socket.connectNotifications()
      }
    } catch (error: unknown) {
      const status = (error as { status?: number })?.status
      if (status === 401) {
        this._store.clear()
        this._cookie.delete(env.REFRESH, '/', env.DOMAIN)
        this._payload.set(null)
      }
    }
  }

  public refresh(): void {
    this._payload.set(this._readPayload())
  }

  public logout(): void {
    if (!isPlatformBrowser(this._platformId)) return
    this._cookie.delete(env.REFRESH, '/', env.DOMAIN)
    this._store.clear()
    this._payload.set(null)
  }

  private _readPayload(): RefreshCookiePayload | null {
    if (!isPlatformBrowser(this._platformId)) return null
    const raw = getCookie(env.REFRESH)
    if (!raw) return null
    try {
      const parsed = JSON.parse(decodeURIComponent(raw)) as Partial<RefreshCookiePayload>
      const { refresh, email, access, timestamp } = parsed
      if (!refresh || !email || !access || !timestamp) return null
      return { refresh, email, access, timestamp }
    } catch {
      return null
    }
  }

  private async _createJWT(payload: RefreshCookiePayload): Promise<void> {
    const { refresh, email, access, timestamp } = payload
    this._store.refreshToken = refresh

    const jwt = await this._signJWT({ refresh, access, timestamp }, access)
    const persist = this._readPersistFromParams()

    const body: { refresh: string; user: string; persist?: boolean } = {
      refresh: jwt,
      user: email,
    }
    if (persist !== undefined) body.persist = persist

    const params = new HttpParams()
      .set('fullPermissions', 'true')
      .set('details', 'true')

    const url = `${env.BACKEND}/core/refresh/`
    const response = await firstValueFrom(
      this._http.post<RefreshTokenResponse>(url, body, { params })
    )
    if (response?.access) {
      this._store.token = response.access
      this._store.refreshToken = response.refresh
      this._store.setLogin(response.login)
    }
  }

  private async _fetchUserDetails(uuid: string): Promise<void> {
    const params = new HttpParams()
      .set('fullPermissions', 'true')
      .set('details', 'true')

    const url = `${env.BACKEND}/users/${uuid}/`
    try {
      const user = await firstValueFrom(
        this._http.get<IUserLogin>(url, { params })
      )
      if (user) {
        const current = this._store.login()
        const merged = current?.menus
          ? { ...user, menus: structuredClone(current.menus) }
          : user
        this._store.setLogin(merged)
      }
    } catch (error: unknown) {
      const status = (error as { status?: number })?.status
      if (status === 401) throw error
    }
  }

  private _readPersistFromParams(): boolean | undefined {
    const raw = getCookie(env.PARAMS)
    if (!raw) return undefined
    try {
      const parsed = JSON.parse(decodeURIComponent(raw)) as { persist?: boolean }
      return parsed?.persist
    } catch {
      return undefined
    }
  }

  private async _signJWT(payload: object, secret: string): Promise<string> {
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )

    const header = { alg: 'HS256', typ: 'JWT' }
    const base64Url = (obj: object): string =>
      btoa(JSON.stringify(obj))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')

    const encodedHeader = base64Url(header)
    const encodedPayload = base64Url(payload)
    const data = `${encodedHeader}.${encodedPayload}`

    const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(data))
    const signatureArray = new Uint8Array(signatureBuffer)
    const signature = btoa(String.fromCharCode(...signatureArray))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')

    return `${encodedHeader}.${encodedPayload}.${signature}`
  }
}
