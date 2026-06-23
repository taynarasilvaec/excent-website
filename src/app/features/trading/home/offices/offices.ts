import { isPlatformBrowser } from '@angular/common'
import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  PLATFORM_ID,
  computed,
  inject,
  signal,
} from '@angular/core'
import { TranslateModule } from '@ngx-translate/core'
import { ExcentCard } from '../../../../components/excent-card/excent-card'
import { ExcentText } from '../../../../components/excent-text/excent-text'
import { SlideEffect } from '../../../../components/slide-effect/slide-effect'
import { OfficeData, OfficeKey } from '../home.models'

// Cascada de entrada:
//   t=0:                          titulo (slide-up) + imagen (slide-down).
//   t=90% de la imagen:           quote (slide-down).
//   t=95% del quote:              ceo+logo (fade) + nombres (slide-down) + barra (crece desde centro).
//   t=90% de los nombres:         descripcion (fade) + get-to-know (slide desde la izquierda).
const TITLE_DURATION_MS = 700
const IMAGE_DURATION_MS = 1000
const QUOTE_TRIGGER_MS = Math.round(IMAGE_DURATION_MS * 0.9)
const QUOTE_DURATION_MS = 700
const BLOCK_BOTTOM_TRIGGER_MS = QUOTE_TRIGGER_MS + Math.round(QUOTE_DURATION_MS * 0.95)
const NAMES_DURATION_MS = 600
const BAR_DURATION_MS = 700
const TAIL_TRIGGER_MS = BLOCK_BOTTOM_TRIGGER_MS + Math.round(NAMES_DURATION_MS * 0.9)
const LINK_DURATION_MS = 500

@Component({
  selector: 'app-home-offices',
  standalone: true,
  imports: [ExcentCard, ExcentText, SlideEffect, TranslateModule],
  templateUrl: './offices.html',
  styleUrl: './offices.scss',
})
export class HomeOffices implements AfterViewInit {
  private readonly platformId = inject(PLATFORM_ID)
  private readonly destroyRef = inject(DestroyRef)
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef)

  protected readonly officeKeys: readonly OfficeKey[] = ['mexico', 'brazil']
  protected readonly offices: Record<OfficeKey, OfficeData> = {
    mexico: {
      ceoName: 'Wilfredo Rodriguez',
      photo: '/assets/images/rodolpho.svg',
      image: '/assets/images/office-mexico.jpg',
      labelKey: 'home.offices.mexico-office',
      descriptionKey: 'home.offices.mexico-description',
    },
    brazil: {
      ceoName: 'Rodolpho Brito',
      photo: '/assets/images/rodolpho.svg',
      image: '/assets/images/office-brazil.png',
      labelKey: 'home.offices.brazil-office',
      descriptionKey: 'home.offices.brazil-description',
    },
  }

  protected readonly selected = signal<OfficeKey>('mexico')
  protected readonly hovered = signal<OfficeKey | null>(null)

  // Capas de imagen activas. Durante una transicion hay 2 (la anterior abajo
  // visible al 100% y la nueva arriba con wipe-in). Tras IMAGE_SWAP_MS se
  // limpia la inferior y queda solo la actual.
  protected readonly imageLayers = signal<
    { tick: number; key: OfficeKey; direction: 'ltr' | 'rtl' | null }[]
  >([{ tick: 0, key: 'mexico', direction: null }])

  protected readonly playTitle = signal(false)
  protected readonly playImage = signal(false)
  protected readonly playQuote = signal(false)
  protected readonly playCeo = signal(false)
  protected readonly playNames = signal(false)
  protected readonly playBar = signal(false)
  protected readonly playDescription = signal(false)
  protected readonly playLink = signal(false)

  protected readonly titleDurationMs = TITLE_DURATION_MS
  protected readonly imageDurationMs = IMAGE_DURATION_MS
  protected readonly quoteDurationMs = QUOTE_DURATION_MS
  protected readonly namesDurationMs = NAMES_DURATION_MS
  protected readonly barDurationMs = BAR_DURATION_MS
  protected readonly linkDurationMs = LINK_DURATION_MS

  protected readonly activeKey = computed(() => this.hovered() ?? this.selected())
  protected readonly active = computed(() => this.offices[this.activeKey()])

  protected select(key: OfficeKey): void {
    this.selected.set(key)
    this.syncImageLayers()
  }

  protected hover(key: OfficeKey | null): void {
    this.hovered.set(key)
    this.syncImageLayers()
  }

  // Mantiene la cola de capas de imagen. La direccion del wipe depende del
  // sentido del cambio: mexico -> brasil = ltr (cubre de izquierda a derecha),
  // brasil -> mexico = rtl. Se conserva la capa previa durante IMAGE_SWAP_MS
  // para que el wipe se vea encima de la imagen anterior visible.
  private _imageTick = 0
  private _lastImageKey: OfficeKey = 'mexico'
  private _imageCleanup: ReturnType<typeof setTimeout> | null = null
  private static readonly IMAGE_SWAP_MS = 450
  private syncImageLayers(): void {
    const current = this.activeKey()
    if (current === this._lastImageKey) return
    const direction: 'ltr' | 'rtl' =
      this._lastImageKey === 'mexico' && current === 'brazil' ? 'ltr' : 'rtl'
    this._lastImageKey = current
    this._imageTick += 1
    this.imageLayers.update(layers => {
      const last = layers[layers.length - 1]
      return [last, { tick: this._imageTick, key: current, direction }]
    })
    if (this._imageCleanup) clearTimeout(this._imageCleanup)
    this._imageCleanup = setTimeout(() => {
      this.imageLayers.update(layers => [layers[layers.length - 1]])
      this._imageCleanup = null
    }, HomeOffices.IMAGE_SWAP_MS)
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return

    if (typeof IntersectionObserver === 'undefined') {
      this.playTitle.set(true)
      this.playImage.set(true)
      this.playQuote.set(true)
      this.playCeo.set(true)
      this.playNames.set(true)
      this.playBar.set(true)
      this.playDescription.set(true)
      this.playLink.set(true)
      return
    }

    const section = this.host.nativeElement.querySelector<HTMLElement>('#offices-section')
    if (!section) return

    const timers: ReturnType<typeof setTimeout>[] = []

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.playTitle.set(true)
            this.playImage.set(true)
            timers.push(setTimeout(() => this.playQuote.set(true), QUOTE_TRIGGER_MS))
            timers.push(
              setTimeout(() => {
                this.playCeo.set(true)
                this.playNames.set(true)
                this.playBar.set(true)
              }, BLOCK_BOTTOM_TRIGGER_MS)
            )
            timers.push(
              setTimeout(() => {
                this.playDescription.set(true)
                this.playLink.set(true)
              }, TAIL_TRIGGER_MS)
            )
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
      if (this._imageCleanup) clearTimeout(this._imageCleanup)
    })
  }
}
