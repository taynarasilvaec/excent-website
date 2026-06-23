import { Component, computed, input } from '@angular/core'
import {
  ExcentCardBackground,
  ExcentCardColor,
} from './excent-card.types'

@Component({
  selector: 'excent-card',
  standalone: true,
  templateUrl: './excent-card.html',
  styleUrl: './excent-card.scss',
})
export class ExcentCard {
  public color = input<ExcentCardColor>('blue')
  public background = input<ExcentCardBackground>('none')
  public width = input<string>()
  public height = input<string>()
  public padding = input<string>()
  public radius = input<string>()
  public fit = input<boolean>(false)

  protected readonly hostStyle = computed(() => ({
    display: this.fit() ? 'inline-flex' : null,
    width: this.fit() ? 'auto' : (this.width() ?? null),
    height: this.height() ?? null,
    padding: this.padding() ?? null,
    'border-radius': this.radius() ?? null,
  }))

  protected readonly cls = computed(
    () =>
      `excent-card excent-card--${this.color()} excent-card--bg-${this.background()}` +
      (this.fit() ? ' excent-card--fit' : '')
  )

  protected readonly showGrid = computed(() => this.background() === 'grid')
}
