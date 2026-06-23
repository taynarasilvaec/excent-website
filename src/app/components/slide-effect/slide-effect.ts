import { Component, HostListener, computed, input, signal } from '@angular/core'

export type SlideDirection = 'up' | 'down' | 'left' | 'right'

const MOBILE_BREAKPOINT = 1024

@Component({
  selector: 'slide-effect',
  standalone: true,
  templateUrl: './slide-effect.html',
  styleUrl: './slide-effect.scss',
  host: {
    class: 'slide-effect',
    '[class.slide-effect--from-up]': "effectiveFrom() === 'up' && !wipeZoomMobile()",
    '[class.slide-effect--from-down]': "effectiveFrom() === 'down' && !wipeZoomMobile()",
    '[class.slide-effect--from-left]': "effectiveFrom() === 'left' && !wipeZoomMobile()",
    '[class.slide-effect--from-right]': "effectiveFrom() === 'right' && !wipeZoomMobile()",
    '[class.slide-effect--block]': 'block()',
    '[class.slide-effect--wipe-zoom-mobile]': '_isWipeZoomMobileActive()',
  },
})
export class SlideEffect {
  public readonly from = input<SlideDirection>('up')
  public readonly fromMobile = input<SlideDirection | null>(null)
  public readonly delay = input<number>(0)
  public readonly duration = input<number>(700)
  public readonly distance = input<number | string>('100%')
  public readonly fade = input<boolean>(true)
  public readonly play = input<boolean>(true)
  public readonly block = input<boolean>(false)
  // Flag: cuando esta activo y el viewport es mobile, en lugar de un slide
  // direccional el efecto es un zoom-out (la imagen inicia mas grande
  // tapando el slot y se retrae a su tamano natural). En desktop el slide
  // se desactiva y el contenido aparece sin animacion (el padre maneja
  // su fade-in via su propio CSS).
  public readonly wipeZoomMobile = input<boolean>(false)

  protected readonly distanceCss = computed(() => {
    const d = this.distance()
    return typeof d === 'number' ? `${d}px` : d
  })

  protected readonly effectiveFrom = computed<SlideDirection>(() => {
    const mobile = this.fromMobile()
    if (mobile && this._isMobile()) return mobile
    return this.from()
  })

  protected readonly _isMobile = signal(
    typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT
  )

  protected readonly _isWipeZoomMobileActive = computed<boolean>(
    () => this.wipeZoomMobile() && this._isMobile()
  )

  @HostListener('window:resize')
  protected onWindowResize(): void {
    if (typeof window === 'undefined') return
    this._isMobile.set(window.innerWidth < MOBILE_BREAKPOINT)
  }
}
