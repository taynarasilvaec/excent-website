import { Component, input, output } from '@angular/core'
import { EcosystemApp } from '../../shared/constants'

@Component({
  selector: 'apps-menu',
  standalone: true,
  templateUrl: './apps-menu.html',
  styleUrl: './apps-menu.scss',
})
export class AppsMenu {
  public readonly apps = input.required<EcosystemApp[]>()
  public readonly heading = input<string>('Excent Ecosystem')

  public readonly navigate = output<EcosystemApp>()

  protected onSelect(app: EcosystemApp): void {
    this.navigate.emit(app)
  }
}
