import { Component, input, output } from '@angular/core'
import { TranslateModule } from '@ngx-translate/core'
import { ExcentButton } from '../excent-button/excent-button'
import { BentoVariant, ExcentBentoCard } from '../excent-bento-card/excent-bento-card'

/**
 * One bento card. The SHELL (gradient, decorative pattern, border, radius,
 * padding) is owned by <excent-bento-card> and is always identical — only the
 * content slots, the grid span, and the optional `variant` vary. Text fields
 * accept a final string or an i18n key (the grid applies translate).
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
  /** Shell fill — navy (default) or the sanctioned blue-bright restyle. */
  variant?: BentoVariant
  /** Grid span — lets the arrangement change while the card style stays the same. */
  colSpan?: number
  rowSpan?: number
}

/**
 * Excent signature bento — ONE card style for the whole site (see
 * <excent-bento-card>). Only the grid arrangement changes: pass `cols` and
 * per-item `colSpan`/`rowSpan`. Gap is always constant.
 */
@Component({
  selector: 'excent-bento',
  standalone: true,
  imports: [TranslateModule, ExcentButton, ExcentBentoCard],
  templateUrl: './excent-bento.html',
  styleUrl: './excent-bento.scss',
})
export class ExcentBento {
  readonly name = input<string>('bento')
  readonly cols = input<number>(3)
  readonly items = input.required<BentoItem[]>()

  readonly cardAction = output<BentoItem>()

  protected span(item: BentoItem): string {
    return `grid-column: span ${item.colSpan ?? 1}; grid-row: span ${item.rowSpan ?? 1};`
  }
}
