import { isPlatformBrowser } from '@angular/common'
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core'

export interface IUserLogin {
  uuid: string
  email: string
  role: number
  status: number
  name?: string
  permissions?: string[]
  groups?: number[]
  menus?: unknown[]
  config?: {
    language?: number
    [key: string]: unknown
  }
  user?: {
    name?: string
    firstName?: string
    lastName?: string
    avatar?: string
  }
  [key: string]: unknown
}

const TOKEN_KEY = 'token'
const REFRESH_TOKEN_KEY = 'refreshToken'
const LOGIN_KEY = 'login'
const PREMIUM_KEY = 'premium'

@Injectable({ providedIn: 'root' })
export class StoreService {
  private readonly _platformId = inject(PLATFORM_ID)
  private readonly _isBrowser = isPlatformBrowser(this._platformId)
  private readonly _login = signal<IUserLogin | null>(this._read<IUserLogin>(LOGIN_KEY))
  private readonly _premium = signal<boolean>(this._readPremium())

  public readonly login = this._login.asReadonly()
  public readonly premium = this._premium.asReadonly()

  public get token(): string {
    return this._isBrowser ? localStorage.getItem(TOKEN_KEY) ?? '' : ''
  }

  public set token(value: string) {
    if (this._isBrowser) localStorage.setItem(TOKEN_KEY, value)
  }

  public get refreshToken(): string {
    return this._isBrowser ? localStorage.getItem(REFRESH_TOKEN_KEY) ?? '' : ''
  }

  public set refreshToken(value: string) {
    if (this._isBrowser) localStorage.setItem(REFRESH_TOKEN_KEY, value)
  }

  public setLogin(value: IUserLogin | null): void {
    if (!this._isBrowser) return
    if (value) localStorage.setItem(LOGIN_KEY, JSON.stringify(value))
    else localStorage.removeItem(LOGIN_KEY)
    this._login.set(value)
    this.setPremium(value !== null)
  }

  public setPremium(value: boolean): void {
    if (!this._isBrowser) return
    localStorage.setItem(PREMIUM_KEY, String(value))
    this._premium.set(value)
  }

  public clear(): void {
    if (!this._isBrowser) return
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(LOGIN_KEY)
    this._login.set(null)
    this.setPremium(false)
  }

  private _read<T>(key: string): T | null {
    if (!this._isBrowser) return null
    const raw = localStorage.getItem(key)
    if (!raw) return null
    try {
      return JSON.parse(raw) as T
    } catch {
      return null
    }
  }

  private _readPremium(): boolean {
    if (!this._isBrowser) return false
    return localStorage.getItem(PREMIUM_KEY) === 'true'
  }
}
