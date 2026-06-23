import { isPlatformBrowser } from '@angular/common'
import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  PLATFORM_ID,
  computed,
  inject,
  signal,
} from '@angular/core'
import { TranslateModule } from '@ngx-translate/core'
import { SlideEffect } from '../../../../components/slide-effect/slide-effect'
import { ExcentButton } from '../../../../components/excent-button/excent-button'
import { ExcentText } from '../../../../components/excent-text/excent-text'
import { STORE_URLS } from '../../../../shared/constants'

// Cascada desktop (>=1024px):
//   t=0:                            background image revelado por clip-path (2000ms).
//   t=BACKGROUND_DURATION_MS*0.7:   titulo (slide-down) + descripcion (slide-up) juntos.
//   t=tras 800ms del paso anterior: boton 1 (slide-left).
//   t=+250ms:                       boton 2 (slide-left).
//
// Cascada mobile (<1024px) — secuencia mas escalonada con titulo partido en lineas:
//   t=70% del image: linea 1 del titulo (slide-up).
//   t=90% del image: linea 2 del titulo (slide-up).
//   t=tras linea 2:  descripcion (slide-up).
//   t=tras descripcion: boton 1 (slide-left), boton 2 con stagger de 250ms.
//
// IMPORTANTE: si cambias BACKGROUND_DURATION_MS, sincronizalo con el valor
// del transition en devices.scss (.home-devices__card::before).
const BACKGROUND_DURATION_MS = 2000
const CONTENT_TRIGGER_MS = Math.round(BACKGROUND_DURATION_MS * 0.7)
const CONTENT_DURATION_MS = 800
const BUTTONS_TRIGGER_MS = CONTENT_TRIGGER_MS + CONTENT_DURATION_MS
const BUTTON_STAGGER_MS = 250

const MOBILE_BREAKPOINT = 1024
const MOBILE_LINE_1_TRIGGER_MS = Math.round(BACKGROUND_DURATION_MS * 0.7)
const MOBILE_LINE_1_DURATION_MS = 400
const MOBILE_LINE_2_TRIGGER_MS = Math.round(BACKGROUND_DURATION_MS * 0.9)
const MOBILE_LINE_2_DURATION_MS = 500
const MOBILE_DESCRIPTION_TRIGGER_MS = MOBILE_LINE_2_TRIGGER_MS + MOBILE_LINE_2_DURATION_MS
const MOBILE_DESCRIPTION_DURATION_MS = 500
const MOBILE_BUTTONS_TRIGGER_MS = MOBILE_DESCRIPTION_TRIGGER_MS + MOBILE_DESCRIPTION_DURATION_MS

@Component({
  selector: 'app-home-devices',
  standalone: true,
  imports: [ExcentButton, ExcentText, SlideEffect, TranslateModule],
  templateUrl: './devices.html',
  styleUrl: './devices.scss',
})
export class HomeDevices implements AfterViewInit {
  private readonly platformId = inject(PLATFORM_ID)
  private readonly destroyRef = inject(DestroyRef)
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef)

  protected readonly appStoreUrl = STORE_URLS.appStore
  protected readonly playStoreUrl = STORE_URLS.playStore

  protected readonly playBackground = signal(false)
  protected readonly playTitleLine1 = signal(false)
  protected readonly playTitleLine2 = signal(false)
  protected readonly playDescription = signal(false)
  protected readonly playButton1 = signal(false)
  protected readonly playButton2 = signal(false)

  protected readonly backgroundDurationMs = BACKGROUND_DURATION_MS

  protected readonly isMobile = signal(
    typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT
  )

  protected readonly line1DurationMs = computed(() =>
    this.isMobile() ? MOBILE_LINE_1_DURATION_MS : CONTENT_DURATION_MS
  )
  protected readonly line2DurationMs = computed(() =>
    this.isMobile() ? MOBILE_LINE_2_DURATION_MS : CONTENT_DURATION_MS
  )
  protected readonly descriptionDurationMs = computed(() =>
    this.isMobile() ? MOBILE_DESCRIPTION_DURATION_MS : CONTENT_DURATION_MS
  )

  protected openStore(url: string): void {
    window.open(url, '_blank', 'noopener')
  }

  @HostListener('window:resize')
  protected onWindowResize(): void {
    if (typeof window === 'undefined') return
    this.isMobile.set(window.innerWidth < MOBILE_BREAKPOINT)
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return

    if (typeof IntersectionObserver === 'undefined') {
      this.playBackground.set(true)
      this.playTitleLine1.set(true)
      this.playTitleLine2.set(true)
      this.playDescription.set(true)
      this.playButton1.set(true)
      this.playButton2.set(true)
      return
    }

    const section = this.host.nativeElement.querySelector<HTMLElement>('#devices-section')
    if (!section) return

    const timers: ReturnType<typeof setTimeout>[] = []

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.playBackground.set(true)
            if (this.isMobile()) {
              timers.push(setTimeout(() => this.playTitleLine1.set(true), MOBILE_LINE_1_TRIGGER_MS))
              timers.push(setTimeout(() => this.playTitleLine2.set(true), MOBILE_LINE_2_TRIGGER_MS))
              timers.push(
                setTimeout(() => this.playDescription.set(true), MOBILE_DESCRIPTION_TRIGGER_MS)
              )
              timers.push(setTimeout(() => this.playButton1.set(true), MOBILE_BUTTONS_TRIGGER_MS))
              timers.push(
                setTimeout(
                  () => this.playButton2.set(true),
                  MOBILE_BUTTONS_TRIGGER_MS + BUTTON_STAGGER_MS
                )
              )
            } else {
              timers.push(
                setTimeout(() => {
                  this.playTitleLine1.set(true)
                  this.playTitleLine2.set(true)
                  this.playDescription.set(true)
                }, CONTENT_TRIGGER_MS)
              )
              timers.push(setTimeout(() => this.playButton1.set(true), BUTTONS_TRIGGER_MS))
              timers.push(
                setTimeout(() => this.playButton2.set(true), BUTTONS_TRIGGER_MS + BUTTON_STAGGER_MS)
              )
            }
            observer.disconnect()
            return
          }
        }
      },
      { rootMargin: '0px 0px 200px 0px' }
    )
    observer.observe(section)

    this.destroyRef.onDestroy(() => {
      observer.disconnect()
      for (const t of timers) clearTimeout(t)
    })
  }
}
