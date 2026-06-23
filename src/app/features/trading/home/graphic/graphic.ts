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
import { TranslateModule } from '@ngx-translate/core'
import { ExcentText } from '../../../../components/excent-text/excent-text'
import { SlideEffect } from '../../../../components/slide-effect/slide-effect'

// Duracion (ms) del slide del titulo. Tras este tiempo prendemos playContent
// para que descripcion + mockup empiecen su fade — asi aparecen DESPUES de
// que el titulo este en su lugar, no al mismo tiempo.
const TITLE_SLIDE_DURATION_MS = 1100

@Component({
  selector: 'app-home-graphic',
  standalone: true,
  imports: [ExcentText, SlideEffect, TranslateModule],
  templateUrl: './graphic.html',
  styleUrl: './graphic.scss',
})
export class HomeGraphic implements AfterViewInit {
  private readonly platformId = inject(PLATFORM_ID)
  private readonly destroyRef = inject(DestroyRef)
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef)

  // Dos signals encadenados:
  //   1. playTitleSlide: se prende cuando la seccion se acerca al viewport
  //      (rootMargin 200px). Dispara el slide del titulo.
  //   2. playContent: se prende TITLE_SLIDE_DURATION_MS despues del titulo,
  //      es decir, cuando el slide ya termino. Dispara el fade time-based
  //      de descripcion y mockup (con stagger via transition-delay del CSS).
  protected readonly playTitleSlide = signal(false)
  protected readonly playContent = signal(false)

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return

    if (typeof IntersectionObserver === 'undefined') {
      this.playTitleSlide.set(true)
      this.playContent.set(true)
      return
    }

    const section = this.host.nativeElement.querySelector<HTMLElement>('#graphic-section')
    if (!section) return

    // rootMargin bottom 200px: extiende el root 200px hacia abajo del viewport,
    // asi disparamos el slide ANTES de que la seccion sea visible. Cuando el
    // usuario la vea, la animacion ya esta corriendo (evita flash de contenido
    // en posicion final justo antes del snap a la posicion inicial del slide).
    let contentTimer: ReturnType<typeof setTimeout> | null = null
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.playTitleSlide.set(true)
            contentTimer = setTimeout(() => {
              this.playContent.set(true)
              contentTimer = null
            }, TITLE_SLIDE_DURATION_MS)
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
      if (contentTimer !== null) clearTimeout(contentTimer)
    })
  }
}
