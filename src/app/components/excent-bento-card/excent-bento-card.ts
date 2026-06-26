import { Component, input } from '@angular/core'

export type BentoVariant = 'navy' | 'blue-bright'

/**
 * Excent signature bento SHELL — the single source of truth for one bento card's
 * look (border, radius, decorative blueprint pattern, hover). The fill is navy by
 * default; `blue-bright` is the only sanctioned restyle (matches excent-card's
 * blue-bright). Everything else is content, projected via <ng-content>.
 *
 * Used both by <excent-bento> (the grid) and directly, when a layout needs a
 * custom arrangement the uniform grid can't express. Set `pad="false"` when the
 * projected content owns its own padding (e.g. full-bleed sub-panels).
 */
@Component({
  selector: 'excent-bento-card',
  standalone: true,
  templateUrl: './excent-bento-card.html',
  styleUrl: './excent-bento-card.scss',
  host: {
    '[class.excent-bento-card--pad]': 'pad()',
    '[class.excent-bento-card--blue-bright]': "variant() === 'blue-bright'",
  },
})
export class ExcentBentoCard {
  readonly name = input<string>('bento-card')
  readonly variant = input<BentoVariant>('navy')
  readonly pad = input<boolean>(true)

  // Shared decorative pattern — same dot/square scatter on every card.
  protected readonly dots = [
    { x: 37, y: 44 },
    { x: 63, y: 31 },
    { x: 69, y: 56 },
    { x: 18, y: 50 },
  ]
  protected readonly squares = [
    { x: 69, y: 38 },
    { x: 13, y: 58 },
    { x: 83, y: 57 },
  ]
}
