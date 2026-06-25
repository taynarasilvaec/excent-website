import { isPlatformBrowser } from '@angular/common'
import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  PLATFORM_ID,
  computed,
  inject,
  signal,
} from '@angular/core'
import { TranslateModule } from '@ngx-translate/core'
import { ExcentButton } from '../../../../components/excent-button/excent-button'
import { ExcentCard } from '../../../../components/excent-card/excent-card'
import { ExcentText } from '../../../../components/excent-text/excent-text'
import { SlideEffect } from '../../../../components/slide-effect/slide-effect'
import { Review, StarType, TrustpilotData } from '../home.models'

// Cascada scroll-driven: cada bloque (titulo, filas, trust, cta) tiene su
// propio IntersectionObserver y aparece cuando entra al viewport, no todos
// a la vez al inicio de la seccion.
const TITLE_DURATION_MS = 1500
const ROWS_DURATION_MS = 3800
const TRUST_DURATION_MS = 800
const CTA_DURATION_MS = 600

@Component({
  selector: 'app-home-reviews',
  standalone: true,
  imports: [ExcentButton, ExcentCard, ExcentText, SlideEffect, TranslateModule],
  templateUrl: './reviews.html',
  styleUrl: './reviews.scss',
})
export class HomeReviews implements OnInit, AfterViewInit {
  private static readonly BADGE_ROTATION_MS = 3500
  private static readonly BADGE_COUNT = 3

  private readonly platformId = inject(PLATFORM_ID)
  private readonly destroyRef = inject(DestroyRef)
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef)
  private rotationIntervalId: ReturnType<typeof setInterval> | null = null

  protected readonly trustpilotUrl = 'https://www.trustpilot.com/review/excent.capital'
  protected readonly maxStars = 5
  protected readonly showRowsEffect = true

  protected readonly playTitle = signal(false)
  protected readonly playRows = signal(false)
  protected readonly playTrust = signal(false)
  protected readonly playCta = signal(false)

  protected readonly titleDurationMs = TITLE_DURATION_MS
  protected readonly ctaDurationMs = CTA_DURATION_MS

  // TODO: Reemplazar por el endpoint cuando esté disponible.
  // Forma esperada: { score: number }
  protected readonly trustpilot = signal<TrustpilotData>({
    score: 4.4,
  })

  protected readonly trustpilotRating = computed(() => this.trustpilot().score.toFixed(1))

  protected readonly stars = computed<readonly StarType[]>(() => {
    const score = this.trustpilot().score
    const rounded = Math.round(score * 2) / 2
    const filled = Math.floor(rounded)
    const hasHalf = rounded % 1 === 0.5
    const empty = this.maxStars - filled - (hasHalf ? 1 : 0)
    return [
      ...Array<StarType>(filled).fill('filled'),
      ...(hasHalf ? (['half'] as StarType[]) : []),
      ...Array<StarType>(empty).fill('empty'),
    ]
  })

  protected readonly currentBadgeIndex = signal(0)

  protected readonly reviews = signal<Review[]>([
    {
      id: 'r1',
      initials: 'CC',
      name: 'Callum Clark',
      rating: 4,
      content:
        'I switched here after trying two other brokers. Deposits and withdrawals arrived on time with no hidden fees. I trade FX, indices, and some U.S. stocks.',
      date: 'Jan 6, 2025',
      verifyUrl: '#',
    },
    {
      id: 'r2',
      initials: 'GE',
      name: 'George',
      rating: 5,
      content:
        'Platform is smooth overall. I use the dashboard which helps with planning trades. Support could reply faster.',
      date: 'Jan 17, 2025',
      verifyUrl: '#',
    },
    {
      id: 'r3',
      initials: 'MR',
      name: 'Maria Rossi',
      rating: 5,
      content:
        'Charts are responsive and the spreads on majors are competitive. Verification took less than a day.',
      date: 'Feb 2, 2025',
      verifyUrl: '#',
    },
    {
      id: 'r4',
      initials: 'AJ',
      name: 'Adam Johnson',
      rating: 5,
      content:
        'Easy to use the economic calendar inside with planning trades. Support has been quick and helpful.',
      date: 'Feb 9, 2025',
      verifyUrl: '#',
    },
    {
      id: 'r5',
      initials: 'LP',
      name: 'Lucia Perez',
      rating: 4,
      content:
        'Good range of instruments. The mobile app is reliable and lets me close positions on the go without lag.',
      date: 'Feb 18, 2025',
      verifyUrl: '#',
    },
    {
      id: 'r6',
      initials: 'TK',
      name: 'Tom Klein',
      rating: 5,
      content:
        'Solid trading conditions and clear fee structure. Withdrawals processed within a couple of business days.',
      date: 'Mar 3, 2025',
      verifyUrl: '#',
    },
  ])

  protected readonly rowOne = computed(() => this.reviews().slice(0, 3))
  protected readonly rowTwo = computed(() => this.reviews().slice(3, 6))

  constructor() {
    this.destroyRef.onDestroy(() => {
      if (this.rotationIntervalId !== null) {
        clearInterval(this.rotationIntervalId)
        this.rotationIntervalId = null
      }
    })
  }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return
    this.rotationIntervalId = setInterval(() => {
      this.currentBadgeIndex.update(i => (i + 1) % HomeReviews.BADGE_COUNT)
    }, HomeReviews.BADGE_ROTATION_MS)
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return

    if (typeof IntersectionObserver === 'undefined') {
      this.playTitle.set(true)
      this.playRows.set(true)
      this.playTrust.set(true)
      this.playCta.set(true)
      return
    }

    const observers: IntersectionObserver[] = []

    // Helper: dispara onEnter la primera vez que el selector entra al viewport.
    // rootMargin negativo abajo para que el elemento ya este visiblemente
    // dentro antes de animar.
    const observeOnce = (selector: string, onEnter: () => void): void => {
      const el = this.host.nativeElement.querySelector<HTMLElement>(selector)
      if (!el) return
      const observer = new IntersectionObserver(
        entries => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              onEnter()
              observer.disconnect()
              return
            }
          }
        },
        { rootMargin: '0px 0px -80px 0px' }
      )
      observer.observe(el)
      observers.push(observer)
    }

    observeOnce('#reviews-title-slide', () => this.playTitle.set(true))
    observeOnce('#reviews-rows', () => this.playRows.set(true))
    // Pill (mobile) y trust-badge (desktop) comparten playTrust. Solo uno esta
    // visible a la vez; el otro tiene display:none y no dispara su IO.
    observeOnce('#reviews-pill', () => this.playTrust.set(true))
    observeOnce('#reviews-trust-badge', () => this.playTrust.set(true))
    observeOnce('#reviews-cta-slide', () => this.playCta.set(true))

    this.destroyRef.onDestroy(() => {
      for (const o of observers) o.disconnect()
    })
  }

  protected starsArray(rating: number): readonly number[] {
    return Array.from({ length: this.maxStars }, (_, i) => (i < rating ? 1 : 0))
  }

  protected onSeeReviews(): void {
    // Trustpilot redirect removed. TODO: point to an internal reviews page when ready.
  }
}
