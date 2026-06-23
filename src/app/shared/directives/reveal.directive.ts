import { isPlatformBrowser } from '@angular/common'
import {
  Directive,
  ElementRef,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  computed,
  inject,
  input,
} from '@angular/core'

export type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'fade'
export type RevealMode = 'slide' | 'wipe'

@Directive({
  selector: '[appReveal]',
  standalone: true,
  host: {
    class: 'reveal',
    '[class.reveal--from-up]': "from() === 'up'",
    '[class.reveal--from-down]': "from() === 'down'",
    '[class.reveal--from-left]': "from() === 'left'",
    '[class.reveal--from-right]': "from() === 'right'",
    '[class.reveal--fade]': "from() === 'fade'",
    '[class.reveal--wipe]': "mode() === 'wipe'",
    '[class.reveal--no-fade]': 'noFade()',
    '[style.--reveal-delay]': 'delay() + "ms"',
    '[style.--reveal-duration]': 'duration() + "ms"',
    '[style.--reveal-distance]': 'distanceCss()',
  },
})
export class RevealDirective implements OnInit, OnDestroy {
  public readonly delay = input<number>(0)
  public readonly duration = input<number>(700)
  public readonly distance = input<number | string>(20)
  public readonly from = input<RevealDirection>('up')
  public readonly mode = input<RevealMode>('slide')
  public readonly fade = input<boolean>(true)
  public readonly threshold = input<number>(0.15)
  public readonly once = input<boolean>(true)

  protected readonly noFade = computed(() => !this.fade())
  protected readonly distanceCss = computed(() => {
    const d = this.distance()
    return typeof d === 'number' ? `${d}px` : d
  })

  private readonly _platformId = inject(PLATFORM_ID)
  private readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef)
  private _observer: IntersectionObserver | null = null

  ngOnInit(): void {
    const host = this._elementRef.nativeElement

    if (!isPlatformBrowser(this._platformId)) return

    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    // La animacion CSS corre automatica al montar para elementos visibles.
    // Para elementos off-screen, pausamos la animation y la reanudamos cuando
    // entran al viewport via IntersectionObserver.
    const rect = host.getBoundingClientRect()
    const inViewport = rect.top < window.innerHeight && rect.bottom > 0
    if (inViewport) return

    host.style.animationPlayState = 'paused'

    this._observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting || entry.intersectionRatio > 0) {
            host.style.animationPlayState = 'running'
            if (this.once()) {
              this._observer?.disconnect()
              this._observer = null
            }
            return
          }
          if (!this.once()) host.style.animationPlayState = 'paused'
        }
      },
      { threshold: this.threshold() }
    )

    this._observer.observe(host)
  }

  ngOnDestroy(): void {
    this._observer?.disconnect()
    this._observer = null
  }
}
