import { Injectable, PLATFORM_ID, inject } from '@angular/core'
import { isPlatformBrowser } from '@angular/common'

export type DevicePlatform = 'android' | 'ios' | 'other'

@Injectable({ providedIn: 'root' })
export class DevicePlatformService {
  private readonly _platformId = inject(PLATFORM_ID)

  public readonly platform: DevicePlatform = this._detectPlatform()

  public get isAndroid(): boolean {
    return this.platform === 'android'
  }

  public get isIOS(): boolean {
    return this.platform === 'ios'
  }

  public get isMobileOS(): boolean {
    return this.platform !== 'other'
  }

  private _detectPlatform(): DevicePlatform {
    if (!isPlatformBrowser(this._platformId)) return 'other'
    const ua = navigator.userAgent
    if (/android/i.test(ua)) return 'android'
    if (/iPad|iPhone|iPod/.test(ua)) return 'ios'
    if (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) return 'ios'
    return 'other'
  }
}
