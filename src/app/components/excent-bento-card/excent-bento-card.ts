import { Component, computed, input } from '@angular/core'

export type BentoVariant = 'navy' | 'blue-bright'

/**
 * Excent signature bento SHELL — the single source of truth for one bento card's
 * look (border, radius, decorative pattern, hover). The decorative `bg` is
 * faithful to Figma: a positionable blurred blue glow ("Ellipse 2") + a cyan
 * blueprint grid + sparkles + dots, all under a radial alpha mask.
 *
 * The fill is navy by default; `blue-bright` is the only sanctioned restyle.
 * Everything else is content, projected via <ng-content>. Set `pad="false"`
 * when the projected content owns its own padding (full-bleed sub-panels).
 *
 * Glow/pattern placement is positionable per card (glowX/glowY/glowW/glowFlip,
 * patX/patY) so each card lights its own corner, exactly like Figma. Defaults
 * give a sensible look for cards that don't set them.
 */
@Component({
  selector: 'excent-bento-card',
  standalone: true,
  templateUrl: './excent-bento-card.html',
  styleUrl: './excent-bento-card.scss',
  host: {
    '[class.excent-bento-card--pad]': 'pad()',
    '[class.excent-bento-card--blue-bright]': "variant() === 'blue-bright'",
    '[class.excent-bento-card--flip]': 'glowFlip()',
    '[style.--bento-glow-x.px]': 'glowX()',
    '[style.--bento-glow-y.px]': 'glowY()',
    '[style.--bento-glow-w.px]': 'glowW()',
    '[style.--bento-glow-h.px]': 'glowH()',
    '[style.--bento-pat-x.px]': 'patX()',
    '[style.--bento-pat-y.px]': 'patY()',
  },
})
export class ExcentBentoCard {
  readonly name = input<string>('bento-card')
  readonly variant = input<BentoVariant>('navy')
  readonly pad = input<boolean>(true)

  // Glow placement (px, relative to the card's top-left).
  readonly glowX = input<number>(-205)
  readonly glowY = input<number>(120)
  readonly glowW = input<number>(1096)
  readonly glowFlip = input<boolean>(true)

  // Decorative accents tile (768×768) placement (px).
  readonly patX = input<number>(190)
  readonly patY = input<number>(-150)

  // Glow keeps the source aspect ratio (1694.67 × 1822.67).
  protected readonly glowH = computed(() => Math.round((this.glowW() * 1822.67) / 1694.67))
}
