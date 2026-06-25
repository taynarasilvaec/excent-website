import { Component, inject } from '@angular/core'
import { TranslateModule } from '@ngx-translate/core'
import { ExcentButton } from '../../../../../components/excent-button/excent-button'
import { ExcentFaq, FaqEntry } from '../../../../../components/excent-faq/excent-faq'
import { ExcentGlow } from '../../../../../components/excent-glow/excent-glow'
import { SsoRedirectService } from '../../../../../shared/services/sso-redirect.service'

@Component({
  selector: 'app-live-account-faq',
  standalone: true,
  imports: [ExcentFaq, ExcentButton, ExcentGlow, TranslateModule],
  templateUrl: './faq.html',
  styleUrl: './faq.scss',
})
export class LiveAccountFaq {
  private readonly _sso = inject(SsoRedirectService)

  protected readonly faqs: FaqEntry[] = [
    { id: 1, question: 'live-account.faq.questions.q1.question', answer: 'live-account.faq.questions.q1.answer' },
    { id: 2, question: 'live-account.faq.questions.q2.question', answer: 'live-account.faq.questions.q2.answer' },
    { id: 3, question: 'live-account.faq.questions.q3.question', answer: 'live-account.faq.questions.q3.answer' },
    { id: 4, question: 'live-account.faq.questions.q4.question', answer: 'live-account.faq.questions.q4.answer' },
    { id: 5, question: 'live-account.faq.questions.q5.question', answer: 'live-account.faq.questions.q5.answer' },
  ]

  protected onContactSupport(): void {
    // TODO: route to support page
  }

  protected onHelpCenter(): void {
    // TODO: route to help center
  }

  protected onCreateAccount(): void {
    this._sso.goTo('sign-up')
  }
}
