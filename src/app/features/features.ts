import { DOCUMENT, isPlatformBrowser } from '@angular/common'
import { Component, PLATFORM_ID, inject, signal } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { NavigationEnd, Router, RouterOutlet } from '@angular/router'
import { filter } from 'rxjs'
import { ExcentGlow } from '../components/excent-glow/excent-glow'
import { Footer } from '../shared/footer/footer'
import { Header } from '../shared/header/header'

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [Header, Footer, RouterOutlet, ExcentGlow],
  templateUrl: './features.html',
  styleUrl: './features.scss',
})
export class Features {
  private readonly router = inject(Router)
  private readonly document = inject(DOCUMENT)
  private readonly platformId = inject(PLATFORM_ID)

  protected readonly isTrading = signal(false)

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return

    this.applyRouteBackground(this.router.url)

    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(e => this.applyRouteBackground(e.urlAfterRedirects))
  }

  private applyRouteBackground(url: string): void {
    const isTrading = url.startsWith('/trading')
    this.isTrading.set(isTrading)
    this.document.documentElement.classList.toggle('bg-trading', isTrading)
  }
}
