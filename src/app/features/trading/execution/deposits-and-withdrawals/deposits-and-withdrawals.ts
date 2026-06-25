import { Component, inject, signal } from '@angular/core'
import { ExcentButton } from '../../../../components/excent-button/excent-button'
import { ExcentGlow } from '../../../../components/excent-glow/excent-glow'
import { ExcentFaq, FaqEntry } from '../../../../components/excent-faq/excent-faq'
import { ExcentPill } from '../../../../components/excent-pill/excent-pill'
import { ExcentText } from '../../../../components/excent-text/excent-text'
import { RevealDirective } from '../../../../shared/directives/reveal.directive'
import { SsoRedirectService } from '../../../../shared/services/sso-redirect.service'
import { env } from '../../../../../environment/environment'
import { MethodRow, MethodsTable } from './methods-table/methods-table'

interface SecurityCard {
  icon: string
  title: string
  description: string
}

interface PaymentMethod {
  icon: string
  title: string
  time: string
  wide?: boolean
}

@Component({
  selector: 'app-deposits-and-withdrawals',
  standalone: true,
  imports: [ExcentText, ExcentButton, ExcentGlow, ExcentFaq, ExcentPill, MethodsTable, RevealDirective],
  templateUrl: './deposits-and-withdrawals.html',
  styleUrl: './deposits-and-withdrawals.scss',
})
export class DepositsAndWithdrawals {
  private readonly _sso = inject(SsoRedirectService)

  protected readonly clientPhone = '/assets/images/mam-hero-phone.png'
  protected readonly usdCoin = '/assets/images/usd-coin.png'
  protected readonly paymentLogos = '/assets/images/payment-logos.png'

  protected readonly paymentMethods: PaymentMethod[] = [
    { icon: '/assets/icons/balance.svg', title: 'Local Bank Transfer', time: 'Processing time: Up to 40 minutes' },
    { icon: '/assets/icons/globe.svg', title: 'Swift Transfer', time: 'Processing time: Up to 40 minutes' },
    { icon: '/assets/icons/money-safe.svg', title: 'Credit / Debit Card', time: 'Processing time: Instant' },
    { icon: '/assets/icons/coins.svg', title: 'Crypto', time: 'Processing time: Usually under 1 hour (up to 24h)' },
    { icon: '/assets/icons/terminal.svg', title: 'Broker-to-Broker Transfer', time: 'Processing time: 1–2 business days', wide: true },
  ]

  // "Log in to your Client Area" stepper (steps 2–4 have no label in the design).
  protected readonly steps = ['Login', '', '', '']
  protected readonly activeStep = signal(0)

  // Method / processing-time rows — shared by the Deposit & Withdrawal tables.
  protected readonly methodRows: MethodRow[] = [
    { method: 'Credit / Debit Card', time: 'Instant' },
    { method: 'Local bank transfer', time: 'Up to 40 minutes' },
    { method: 'Swift Transfer', time: 'Up to 40 minutes' },
    { method: 'Broker-to-Broker Transfer', time: '1–2 business days' },
    { method: 'Crypto', time: 'Usually under 1 hour (up to 24h)' },
  ]

  // FAQ copy from the Deposits & Withdrawals copywriting doc.
  protected readonly faqs: FaqEntry[] = [
    {
      id: 1,
      question: 'How do I make a deposit into my Excent Capital account?',
      answer:
        'Log in to your Client Area, select your preferred payment method, and follow the instructions to fund your account. Your balance will be updated as soon as the deposit is confirmed.',
    },
    {
      id: 2,
      question: 'How long does a withdrawal take to process?',
      answer:
        'Processing times vary by method. Credit and debit card withdrawals are processed instantly, while bank transfers may take up to 40 minutes. Broker-to-Broker transfers are completed within 1–2 business days.',
      link: { label: 'See processing times per method.', href: env.KNOWLEDGE },
    },
    {
      id: 3,
      question: 'Are there any fees for deposits or withdrawals?',
      answer:
        'Excent Capital does not charge fees on deposits or withdrawals. Processing times and any applicable charges from your payment provider may vary depending on the method selected.',
    },
    {
      id: 4,
      question: 'Can I withdraw to a different account than the one I deposited from?',
      answer:
        'Withdrawals are processed exclusively to the same account used for the original deposit, in accordance with our Same-Name Policy and regulatory requirements.',
    },
    {
      id: 5,
      question: 'What currencies are supported for deposits?',
      answer:
        'All Excent Capital accounts are denominated in US dollars. Deposits made in other currencies will be converted at the prevailing exchange rate at the time of processing.',
    },
  ]

  protected readonly securityCards: SecurityCard[] = [
    {
      icon: '/assets/icons/security.svg',
      title: 'Segregated Accounts',
      description:
        "Client funds are held in dedicated accounts, entirely separate from Excent Capital's operational funds. Your capital is always yours.",
    },
    {
      icon: '/assets/icons/balance.svg',
      title: 'Regulated Broker',
      description:
        'Excent Capital operates under strict regulatory oversight across multiple jurisdictions, in full compliance with international financial standards.',
    },
    {
      icon: '/assets/icons/coins.svg',
      title: 'Same-Name Policy',
      description:
        'Withdrawals are processed exclusively to the account used for deposit. Every transaction remains secure and fully traceable.',
    },
  ]

  protected onDeposit(): void {
    this._sso.goTo('sign-up')
  }

  protected onDemoAccount(): void {
    this._sso.goTo('sign-up')
  }

  protected onTalkSupport(): void {
    // TODO: route to support / contact
  }

  protected onTradeNow(): void {
    this._sso.goToTrading()
  }

  protected onLearnTransfer(): void {
    // TODO: route to transfer guide
  }

  protected onHelpCentre(): void {
    // TODO: route to help centre
  }

  protected setStep(i: number): void {
    this.activeStep.set(i)
  }
}
