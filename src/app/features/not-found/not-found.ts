import { Component, inject } from '@angular/core'
import { Router } from '@angular/router'
import { ExcentButton } from '../../components/excent-button/excent-button'
import { ExcentPill } from '../../components/excent-pill/excent-pill'
import { ExcentText } from '../../components/excent-text/excent-text'

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [ExcentButton, ExcentPill, ExcentText],
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss',
})
export class NotFound {
  private readonly _router = inject(Router)

  protected onHome(): void {
    this._router.navigate(['/' + this.lang()])
  }

  private lang(): string {
    return this._router.url.split('/').filter(Boolean)[0] || 'en'
  }
}
