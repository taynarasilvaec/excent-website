import { Component, computed, input } from '@angular/core'
import {
  ExcentTextAs,
  ExcentTextColor,
  ExcentTextVariant,
} from './excent-text.types'

const DEFAULT_TAG: Record<ExcentTextVariant, ExcentTextAs> = {
  display: 'h1',
  title: 'h2',
  subtitle: 'h3',
  body: 'p',
  'footer-text': 'p',
  kicker: 'p',
}

const DEFAULT_COLOR: Record<ExcentTextVariant, ExcentTextColor> = {
  display: 'primary',
  title: 'primary',
  subtitle: 'primary',
  body: 'secondary',
  'footer-text': 'muted',
  kicker: 'muted',
}

const ARIA_LEVEL: Partial<Record<ExcentTextAs, number>> = {
  h1: 1, h2: 2, h3: 3, h4: 4, h5: 5, h6: 6,
}

@Component({
  selector: 'excent-text',
  standalone: true,
  templateUrl: './excent-text.html',
  styleUrl: './excent-text.scss',
})
export class ExcentText {
  public variant = input<ExcentTextVariant>('body')
  public as = input<ExcentTextAs | undefined>(undefined)
  public color = input<ExcentTextColor | undefined>(undefined)

  protected readonly resolvedAs = computed<ExcentTextAs>(
    () => this.as() ?? DEFAULT_TAG[this.variant()]
  )

  protected readonly resolvedColor = computed<ExcentTextColor>(
    () => this.color() ?? DEFAULT_COLOR[this.variant()]
  )

  protected readonly cls = computed(
    () => `excent-text excent-text--${this.variant()} excent-text--${this.resolvedColor()}`
  )

  protected readonly role = computed(() =>
    ARIA_LEVEL[this.resolvedAs()] ? 'heading' : null
  )

  protected readonly ariaLevel = computed(() => ARIA_LEVEL[this.resolvedAs()] ?? null)
}
