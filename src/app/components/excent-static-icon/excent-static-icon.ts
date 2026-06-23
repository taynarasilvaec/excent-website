import { isPlatformBrowser } from '@angular/common'
import { Component, PLATFORM_ID, computed, inject, input, signal } from '@angular/core'
import { env } from '../../../environment/environment'
import {
  ExcentStaticIconShape,
  ExcentStaticIconType,
} from './excent-static-icon.types'

@Component({
  selector: 'excent-static-icon',
  standalone: true,
  templateUrl: './excent-static-icon.html',
  styleUrl: './excent-static-icon.scss',
})
export class ExcentStaticIcon {
  private readonly platformId = inject(PLATFORM_ID)

  public name = input<string>('')
  public src = input<string>()
  public size = input<number>(40)
  public type = input<ExcentStaticIconType>('symbol')
  public shape = input<ExcentStaticIconShape>('round')
  public radius = input<number | undefined>(undefined)
  public background = input<string | undefined>(undefined)
  public filled = input<boolean>(false)
  public tinted = input<boolean>(false)

  protected readonly isLoading = signal(true)
  protected readonly extractedColor = signal<string | null>(null)
  protected readonly hasErrored = signal(false)

  protected readonly resolvedBackground = computed<string | undefined>(() => {
    return this.background() ?? this.extractedColor() ?? undefined
  })

  protected readonly resolvedSrc = computed(() => {
    const direct = this.src()
    if (direct) return direct
    const name = this.name()
    if (!name) return ''
    switch (this.type()) {
      case 'symbol': return `${env.SYMBOLS_URL}${name}.svg`
      case 'flag':   return `${env.FLAGS_URL}${name}.svg`
      case 'image':  return name
    }
  })

  protected onImageLoad(event: Event): void {
    this.isLoading.set(false)
    if (this.tinted() && isPlatformBrowser(this.platformId)) {
      this.extractColor(event.target as HTMLImageElement)
    }
  }

  protected onImageError(event: Event): void {
    if (this.hasErrored()) {
      this.isLoading.set(false)
      return
    }
    this.hasErrored.set(true)
    const img = event.target as HTMLImageElement
    switch (this.type()) {
      case 'symbol': img.src = `${env.SYMBOLS_URL}default.svg`; break
      case 'flag':   img.src = `${env.FLAGS_URL}default.svg`; break
    }
    this.isLoading.set(false)
  }

  private extractColor(img: HTMLImageElement): void {
    try {
      const canvas = document.createElement('canvas')
      const w = img.naturalWidth || 64
      const h = img.naturalHeight || 64
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.drawImage(img, 0, 0, w, h)
      const data = ctx.getImageData(0, 0, w, h).data
      let r = 0, g = 0, b = 0, count = 0
      for (let i = 0; i < data.length; i += 4) {
        const alpha = data[i + 3]
        if (alpha > 128) {
          r += data[i]
          g += data[i + 1]
          b += data[i + 2]
          count++
        }
      }
      if (count > 0) {
        const avgR = Math.round(r / count)
        const avgG = Math.round(g / count)
        const avgB = Math.round(b / count)
        this.extractedColor.set(`rgb(${avgR}, ${avgG}, ${avgB})`)
      }
    } catch {
      this.extractedColor.set(null)
    }
  }
}
