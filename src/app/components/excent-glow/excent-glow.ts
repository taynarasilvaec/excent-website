import { Component, computed, input } from '@angular/core'

export type GlowPosition =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'center'

export type GlowShape = 'ellipse' | 'circle'

@Component({
  selector: 'excent-glow',
  standalone: true,
  template: '',
  styleUrl: './excent-glow.scss',
  host: {
    '[style.--glow-top]': 'top()',
    '[style.--glow-right]': 'right()',
    '[style.--glow-bottom]': 'bottom()',
    '[style.--glow-left]': 'left()',
    '[style.--glow-width]': 'width()',
    '[style.--glow-height]': 'height()',
    '[style.--glow-origin]': 'resolvedOrigin()',
    '[style.--glow-shape]': 'shape()',
    '[style.--glow-transparent]': 'transparentAt()',
    '[style.--glow-blur]': 'blur()',
    '[attr.aria-hidden]': 'true',
  },
})
export class ExcentGlow {
  public readonly position = input<GlowPosition | null>(null)
  public readonly shape = input<GlowShape>('ellipse')

  public readonly top = input<string>('auto')
  public readonly right = input<string>('auto')
  public readonly bottom = input<string>('auto')
  public readonly left = input<string>('auto')
  public readonly width = input<string>('100%')
  public readonly height = input<string>('100%')

  public readonly origin = input<string | null>(null)
  public readonly transparentAt = input<string>('76%')
  public readonly blur = input<string>('100px')

  protected readonly resolvedOrigin = computed<string>(() => {
    const manual = this.origin()
    if (manual) return manual

    switch (this.position()) {
      case 'top-right': return '100% 0%'
      case 'bottom-left': return '0% 100%'
      case 'bottom-right': return '100% 100%'
      case 'center': return '50% 50%'
      case 'top-left':
      default: return '0% 0%'
    }
  })
}
