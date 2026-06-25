import { Component, input, output } from '@angular/core'
import { TranslateModule } from '@ngx-translate/core'
import { ExcentButton } from '../excent-button/excent-button'

/**
 * One bento card. The SHELL (blue gradient, decorative pattern, border, radius,
 * padding) is always identical — only the content slots and the grid span vary.
 * Text fields accept a final string or an i18n key (the grid applies translate).
 */
export interface BentoItem {
  icon?: string
  /** Optional image filling the top media slot. */
  media?: string
  /** Show the empty media panel (placeholder) when there's no image yet. */
  mediaPanel?: boolean
  title?: string
  /** Lighter continuation of the title (e.g. "Operate Less"). */
  titleDim?: string
  description?: string
  link?: string
  /** Big stat, e.g. "24/7". */
  stat?: string
  statLabel?: string
  /** Renders a CTA button with this label. */
  button?: string
  /** Grid span — lets the arrangement change while the card style stays the same. */
  colSpan?: number
  rowSpan?: number
}

/**
 * Excent signature bento — ONE card style for the whole site (border, stroke,
 * colour, gap, padding, decorative pattern). Only the grid arrangement changes:
 * pass `cols` and per-item `colSpan`/`rowSpan`. Gap is always constant.
 */
@Component({
  selector: 'excent-bento',
  standalone: true,
  imports: [TranslateModule, ExcentButton],
  templateUrl: './excent-bento.html',
  styleUrl: './excent-bento.scss',
})
export class ExcentBento {
  readonly name = input<string>('bento')
  readonly cols = input<number>(3)
  readonly items = input.required<BentoItem[]>()

  readonly cardAction = output<BentoItem>()

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

  protected span(item: BentoItem): string {
    return `grid-column: span ${item.colSpan ?? 1}; grid-row: span ${item.rowSpan ?? 1};`
  }
}
