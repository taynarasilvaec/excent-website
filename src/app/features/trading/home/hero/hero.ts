import { isPlatformBrowser } from '@angular/common'
import { Component, DestroyRef, PLATFORM_ID, inject, signal } from '@angular/core'
import { TranslateModule } from '@ngx-translate/core'
import { ExcentButton } from '../../../../components/excent-button/excent-button'
import { ExcentText } from '../../../../components/excent-text/excent-text'
import { SlideEffect } from '../../../../components/slide-effect/slide-effect'
import { STORE_URLS } from '../../../../shared/constants'
import { RevealDirective } from '../../../../shared/directives/reveal.directive'
import { SsoRedirectService } from '../../../../shared/services/sso-redirect.service'

// Safety net: if the intro never fires `ended` (stalled buffering, codec
// issue, tab backgrounded), reveal the hero text anyway after this long.
const INTRO_MAX_WAIT_MS = 12_000

@Component({
  selector: 'app-home-hero',
  standalone: true,
  imports: [ExcentButton, ExcentText, RevealDirective, SlideEffect, TranslateModule],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class HomeHero {
  private readonly _sso = inject(SsoRedirectService)
  private readonly _platformId = inject(PLATFORM_ID)
  private readonly _destroyRef = inject(DestroyRef)

  protected readonly appStoreRating = '4.8'
  protected readonly googlePlayRating = '4.3'
  protected readonly appStoreUrl = STORE_URLS.appStore
  protected readonly googlePlayUrl = STORE_URLS.playStore

  protected readonly introVideo = '/assets/video/home-intro.mp4'
  protected readonly introPoster = '/assets/video/home-intro-poster.jpg'

  protected readonly contentRevealed = signal(false)
  protected readonly introDone = signal(false)
  protected readonly playIntro = signal(false)

  constructor() {
    if (!isPlatformBrowser(this._platformId)) {
      this.contentRevealed.set(true)
      return
    }
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) {
      this.revealContent()
      return
    }
    this.playIntro.set(true)
    const timer = window.setTimeout(() => this.finishIntro(), INTRO_MAX_WAIT_MS)
    this._destroyRef.onDestroy(() => window.clearTimeout(timer))
  }

  protected onIntroReady(event: Event): void {
    const video = event.target as HTMLVideoElement
    const playback = video.play()
    if (playback && typeof playback.catch === 'function') {
      playback.catch(() => this.finishIntro())
    }
  }

  protected onIntroEnded(): void {
    this.finishIntro()
  }

  protected onIntroError(): void {
    this.finishIntro()
  }

  private finishIntro(): void {
    this.introDone.set(true)
    this.revealContent()
  }

  private revealContent(): void {
    this.contentRevealed.set(true)
  }

  protected onStartTrading(): void {
    this._sso.goToTrading()
  }
}
