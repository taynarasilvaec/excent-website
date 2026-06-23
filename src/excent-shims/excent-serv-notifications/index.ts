import { Injectable } from '@angular/core'

@Injectable({ providedIn: 'root' })
export class ExcentServNotificationsService {
  isConnect = false
  sendPing = false
  connect(_url: string, _reconnect: boolean, _auth: unknown): void {}
  disconnect(): void {}
}
