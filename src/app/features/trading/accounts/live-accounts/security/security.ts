import { Component } from '@angular/core'
import { TranslateModule } from '@ngx-translate/core'
import { ExcentGlow } from '../../../../../components/excent-glow/excent-glow'

@Component({
  selector: 'app-live-account-security',
  standalone: true,
  imports: [TranslateModule, ExcentGlow],
  templateUrl: './security.html',
  styleUrl: './security.scss',
})
export class LiveAccountSecurity {}
