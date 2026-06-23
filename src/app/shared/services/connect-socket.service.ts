import { isPlatformBrowser } from '@angular/common'
import { Injectable, PLATFORM_ID, inject } from '@angular/core'
import { ExcentServNotificationsService } from '../../../excent-shims/excent-serv-notifications/index'
import { env } from '../../../environment/environment'
import { StoreService } from './store.service'

interface AuthMessage {
  type: 'auth'
  session: string
  token: string
  project: string
  version: string
}

@Injectable({ providedIn: 'root' })
export class ConnectSocketService {
  private readonly _platformId = inject(PLATFORM_ID)
  private readonly _store = inject(StoreService)
  private readonly _notificationWS = inject(ExcentServNotificationsService)
  private readonly _session: string = this._generateUUID()

  public get sessionID(): string {
    return this._session
  }

  public connectNotifications(): void {
    if (!isPlatformBrowser(this._platformId)) return
    if (!this._store.token) return
    if (this._notificationWS.isConnect) return

    const auth: AuthMessage = {
      type: 'auth',
      session: this._session,
      token: this._store.token,
      project: 'website',
      version: env.VERSION,
    }
    this._notificationWS.sendPing = true
    this._notificationWS.connect(env.NOTIFICATIONS_WS, false, auth)
  }

  public disconnect(): void {
    if (this._notificationWS.isConnect) this._notificationWS.disconnect()
  }

  private _generateUUID(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0
      const v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }
}
