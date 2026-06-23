import { Component, inject, signal } from '@angular/core'
import { ExcentAccordion } from '../../../../components/excent-accordion/excent-accordion'
import { ExcentAccordionItem } from '../../../../components/excent-accordion/excent-accordion-item'
import { ExcentButton } from '../../../../components/excent-button/excent-button'
import { ExcentText } from '../../../../components/excent-text/excent-text'
import { RevealDirective } from '../../../../shared/directives/reveal.directive'
import { SsoRedirectService } from '../../../../shared/services/sso-redirect.service'

interface Persona {
  title: string
  description: string
}

interface FlowStep {
  short: string
  title: string
  description: string
}

interface FeeItem {
  icon: string
  title: string
  description: string
}

interface Faq {
  id: number
  question: string
  answer: string
}

@Component({
  selector: 'app-mam-ecosystem',
  standalone: true,
  imports: [ExcentText, ExcentButton, ExcentAccordion, ExcentAccordionItem, RevealDirective],
  templateUrl: './mam-ecosystem.html',
  styleUrl: './mam-ecosystem.scss',
})
export class MamEcosystem {
  private readonly _sso = inject(SsoRedirectService)

  protected readonly heroImage = '/assets/images/mam-hero.png'

  // Interactive flow — clicking a step animates its title/description + visual.
  protected readonly activeStep = signal(0)
  protected readonly flow: FlowStep[] = [
    {
      short: 'Open Your Account',
      title: 'Open Your Account',
      description:
        "Complete your registration and start managing your clients' capital, all from a single dashboard.",
    },
    {
      short: 'Apply For Master Status',
      title: 'Apply For Master Status',
      description:
        "That track record is the foundation of your application. Submit it to Excent Capital's dealing team, who will review your trading history and eligibility criteria to grant access to the program.",
    },
    {
      short: 'Receive Investors',
      title: 'Receive Investors',
      description:
        "With Master status confirmed, investors can allocate capital under your management. Excent Capital's MAM ecosystem gives you control over each Echo account, with every trade replicated in real time.",
    },
    {
      short: 'Earn Performance Fees',
      title: 'Earn Performance Fees',
      description:
        'Performance fees of up to 50% on net new profit. The High-Water Mark rule ensures you earn on real progress, rewarding consistency while building long-term investor confidence.',
    },
  ]

  protected readonly personas: Persona[] = [
    {
      title: 'Fund Manager',
      description:
        'You already manage client capital. Now you need a platform that matches your operation, centralised execution, flexible allocation methods, and real-time reporting across all sub-accounts.',
    },
    {
      title: 'Skilled Trader',
      description:
        'You have the track record. The MAM account lets you turn performance into a business. Manage external capital, set your own fee structure, and scale without operational friction.',
    },
    {
      title: 'Introducing Broker',
      description:
        'You already bring clients. Now go further. With a MAM account, you can actively manage their capital and stream to your existing IB business.',
    },
  ]

  protected readonly feeItems: FeeItem[] = [
    {
      icon: '/assets/icons/balance.svg',
      title: 'Performance Fees',
      description:
        'Configure your performance fee to reflect your trading style, your assets, and your audience.',
    },
    {
      icon: '/assets/icons/coins.svg',
      title: 'Monthly Settlement',
      description:
        'Performance fees are calculated and settled on a monthly cycle, based on the new profit generated through your Master account.',
    },
    {
      icon: '/assets/icons/security.svg',
      title: 'Full Transparency',
      description:
        'Your fee structure is displayed on your public Master profile, so every follower sees the terms before connecting to your account.',
    },
  ]

  // Q1 answer is from the Figma; Q2–Q5 answers are draft (grounded in the page) — confirm with compliance.
  protected readonly faqs: Faq[] = [
    {
      id: 1,
      question: 'Who can apply for a MAM account?',
      answer:
        'The MAM account is available to money managers, professional traders, and introducing brokers who wish to manage client capital under a structured platform.',
    },
    {
      id: 2,
      question: 'How are trades allocated across sub-accounts?',
      answer:
        'A trade placed on your Master account is mirrored to every connected sub-account in real time, using flexible allocation methods so each account is sized to its own equity.',
    },
    {
      id: 3,
      question: 'Is there a minimum number of sub-accounts required?',
      answer:
        'Specific requirements are confirmed during the application process. Reach out to our team and we will walk you through what fits your structure.',
    },
    {
      id: 4,
      question: 'How and when are performance fees paid?',
      answer:
        'Performance fees are calculated and settled on a monthly cycle, charged only on new profit above your High-Water Mark.',
    },
    {
      id: 5,
      question: 'Is the MAM account available to managers in all regions?',
      answer:
        'The MAM account is available to managers across most regions. Eligibility depends on local regulations and the jurisdiction of the entity providing the service.',
    },
  ]

  protected setStep(index: number): void {
    this.activeStep.set(index)
  }

  protected onApply(): void {
    this._sso.goTo('sign-up')
  }

  protected onTalkToTeam(): void {
    this._sso.goTo('sign-up')
  }
}
