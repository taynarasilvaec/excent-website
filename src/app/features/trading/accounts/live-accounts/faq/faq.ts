import { Component, inject } from '@angular/core'
import { TranslateModule } from '@ngx-translate/core'
import { ExcentAccordion } from '../../../../../components/excent-accordion/excent-accordion'
import { ExcentAccordionItem } from '../../../../../components/excent-accordion/excent-accordion-item'
import { ExcentButton } from '../../../../../components/excent-button/excent-button'
import { ExcentGlow } from '../../../../../components/excent-glow/excent-glow'
import { SsoRedirectService } from '../../../../../shared/services/sso-redirect.service'

interface FaqItem {
  id: number
  questionKey: string
  answerKey: string
}

@Component({
  selector: 'app-live-account-faq',
  standalone: true,
  imports: [ExcentAccordion, ExcentAccordionItem, ExcentButton, ExcentGlow, TranslateModule],
  templateUrl: './faq.html',
  styleUrl: './faq.scss',
})
export class LiveAccountFaq {
  private readonly _sso = inject(SsoRedirectService)

  protected readonly faqs: ReadonlyArray<FaqItem> = [
    {
      id: 1,
      questionKey: 'live-account.faq.questions.q1.question',
      answerKey: 'live-account.faq.questions.q1.answer',
    },
    {
      id: 2,
      questionKey: 'live-account.faq.questions.q2.question',
      answerKey: 'live-account.faq.questions.q2.answer',
    },
    {
      id: 3,
      questionKey: 'live-account.faq.questions.q3.question',
      answerKey: 'live-account.faq.questions.q3.answer',
    },
    {
      id: 4,
      questionKey: 'live-account.faq.questions.q4.question',
      answerKey: 'live-account.faq.questions.q4.answer',
    },
    {
      id: 5,
      questionKey: 'live-account.faq.questions.q5.question',
      answerKey: 'live-account.faq.questions.q5.answer',
    },
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
