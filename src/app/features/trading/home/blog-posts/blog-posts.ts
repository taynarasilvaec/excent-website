import { isPlatformBrowser } from '@angular/common'
import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  PLATFORM_ID,
  inject,
  signal,
} from '@angular/core'
import { FormsModule } from '@angular/forms'
import { TranslateModule } from '@ngx-translate/core'
import { ExcentButton } from '../../../../components/excent-button/excent-button'
import { ExcentCard } from '../../../../components/excent-card/excent-card'
import { SlideEffect } from '../../../../components/slide-effect/slide-effect'
import { BlogPost } from '../home.models'

// Cascada scroll-driven: cada bloque (titulo, featured card, subscribe, lista,
// see-all) tiene su propio IntersectionObserver y dispara al entrar al viewport.
// Las sub-cascadas internas se mantienen (ej. content fade al 70% del slide
// del card; boton subscribe al 70% del fade del texto+input) para que el
// usuario perciba un orden dentro de cada bloque conforme va llegando.
const CARD_DURATION_MS = 1500
const CONTENT_TRIGGER_MS = Math.round(CARD_DURATION_MS * 0.7)
const SUBSCRIBE_CONTENT_DURATION_MS = 900
const SUBSCRIBE_BTN_TRIGGER_MS = Math.round(SUBSCRIBE_CONTENT_DURATION_MS * 0.7)
const SUBSCRIBE_BTN_DURATION_MS = 700
const SEE_ALL_DURATION_MS = 700

@Component({
  selector: 'app-home-blog-posts',
  standalone: true,
  imports: [ExcentButton, ExcentCard, FormsModule, SlideEffect, TranslateModule],
  templateUrl: './blog-posts.html',
  styleUrl: './blog-posts.scss',
})
export class HomeBlogPosts implements AfterViewInit {
  private readonly platformId = inject(PLATFORM_ID)
  private readonly destroyRef = inject(DestroyRef)
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef)

  protected readonly email = signal<string>('')
  protected readonly seeAllUrl = '#'

  protected readonly playTitle = signal(false)
  protected readonly playCard = signal(false)
  protected readonly playContent = signal(false)
  protected readonly playSubscribeContent = signal(false)
  protected readonly playSubscribeBtn = signal(false)
  protected readonly playList = signal(false)
  protected readonly playSeeAll = signal(false)

  protected readonly subscribeBtnDurationMs = SUBSCRIBE_BTN_DURATION_MS
  protected readonly seeAllDurationMs = SEE_ALL_DURATION_MS

  protected readonly featured = signal<BlogPost>({
    id: 'featured-1',
    category: 'Market Analysis',
    date: '8th dec, 2024',
    // Line break after the colon to match the Figma (title : subtitle).
    title: 'January 2026 Market Wrap-Up:\nKey Economic and Trading Highlights',
    description:
      'This month proved to be a dynamic start to the year, driven by geopolitical events, currency volatility, and commodities price movements.',
    image: '/assets/images/trump.png',
    author: {
      name: 'Ryccielli Ongaratto',
      avatar: '/assets/images/rodolpho.svg',
    },
    url: '#',
    isLatest: true,
  })

  protected readonly posts = signal<BlogPost[]>([
    {
      id: 'post-1',
      category: 'Tech',
      date: '28th feb, 2026',
      title: 'New release! Excent Capital for iOS',
      description:
        'Explore lorem ipsum dolor sit amet, consectetur adipiscing elit, abore et dolore magna aliqua.',
      author: {
        name: 'Alonso Solano',
        avatar: '/assets/images/gustavo.svg',
      },
      url: '#',
    },
    {
      id: 'post-2',
      category: 'Trading Analisys',
      date: '29th feb, 2026',
      title: 'What the Capture of Nicolás Maduro Means — Volatility as opportunity.',
      description:
        'Explore lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
      author: {
        name: 'Ryccielli Ongaratto',
        avatar: '/assets/images/rodolpho.svg',
      },
      url: '#',
    },
  ])

  protected onSubscribe(): void {
    if (!this.email()) return
    window.console.log('Subscribe:', this.email())
  }

  protected onSeeAll(): void {
    window.open(this.seeAllUrl, '_self')
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return

    if (typeof IntersectionObserver === 'undefined') {
      this.playTitle.set(true)
      this.playCard.set(true)
      this.playContent.set(true)
      this.playSubscribeContent.set(true)
      this.playSubscribeBtn.set(true)
      this.playList.set(true)
      this.playSeeAll.set(true)
      return
    }

    const timers: ReturnType<typeof setTimeout>[] = []
    const observers: IntersectionObserver[] = []

    // Helper: observa un selector y dispara onEnter la primera vez que entra
    // al viewport (con un pequeno rootMargin negativo para que se dispare
    // cuando el elemento ya esta visiblemente dentro, no apenas asomando).
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

    observeOnce('#blog-posts-title', () => this.playTitle.set(true))

    observeOnce('#blog-posts-featured', () => {
      this.playCard.set(true)
      timers.push(setTimeout(() => this.playContent.set(true), CONTENT_TRIGGER_MS))
    })

    observeOnce('#blog-posts-subscribe', () => {
      this.playSubscribeContent.set(true)
      timers.push(setTimeout(() => this.playSubscribeBtn.set(true), SUBSCRIBE_BTN_TRIGGER_MS))
    })

    observeOnce('#blog-posts-list', () => this.playList.set(true))
    observeOnce('#blog-posts-see-all', () => this.playSeeAll.set(true))

    this.destroyRef.onDestroy(() => {
      for (const o of observers) o.disconnect()
      for (const t of timers) clearTimeout(t)
    })
  }
}
