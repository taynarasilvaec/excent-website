import { Component, computed, input } from '@angular/core'

export type PillVariant = 'soft' | 'outline' | 'solid'
export type PillColor = 'neutral' | 'blue' | 'green'
export type PillSize = 'sm' | 'md' | 'lg'

/**
 * Excent pill / tag — the single shared chip used across the site
 * (kickers, status badges, eyebrows, labels). One style, many variations:
 * `variant` (soft · outline · solid) × `color` (neutral · blue · green) × `size`.
 * Optional status `dot` and `uppercase`. Label is projected as content.
 */
@Component({
  selector: 'excent-pill',
  standalone: true,
  template: `
    <span [class]="classes()">
      @if (dot()) {
        <span class="excent-pill__dot" aria-hidden="true"></span>
      }
      <span class="excent-pill__label"><ng-content /></span>
    </span>
  `,
  styleUrl: './excent-pill.scss',
})
export class ExcentPill {
  readonly variant = input<PillVariant>('soft')
  readonly color = input<PillColor>('neutral')
  readonly size = input<PillSize>('md')
  readonly dot = input<boolean>(false)
  readonly uppercase = input<boolean>(false)

  protected readonly classes = computed(() => {
    const c = [
      'excent-pill',
      `excent-pill--${this.variant()}`,
      `excent-pill--${this.color()}`,
      `excent-pill--${this.size()}`,
    ]
    if (this.uppercase()) c.push('excent-pill--upper')
    return c.join(' ')
  })
}
