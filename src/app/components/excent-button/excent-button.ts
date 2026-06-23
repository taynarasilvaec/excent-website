import { Component, input } from '@angular/core'
import {
  ExcentButtonColor,
  ExcentButtonRadius,
  ExcentButtonSize,
  ExcentButtonType,
} from './excent-button.types'

@Component({
  selector: 'excent-button',
  standalone: true,
  templateUrl: './excent-button.html',
  styleUrl: './excent-button.scss',
  host: {
    '[style.width]': 'width()',
  },
})
export class ExcentButton {
  public color = input<ExcentButtonColor>('blue')
  public radius = input<ExcentButtonRadius>('sm')
  public size = input<ExcentButtonSize>('md')
  public type = input<ExcentButtonType>('button')
  public disabled = input<boolean>(false)
  public width = input<string>('100%')
  public ariaLabel = input<string | null>(null)
}
