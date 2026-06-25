import { Component, input } from '@angular/core'
import { TranslateModule } from '@ngx-translate/core'
import { ExcentAccordion } from '../excent-accordion/excent-accordion'
import { ExcentAccordionItem } from '../excent-accordion/excent-accordion-item'
import { ExcentText } from '../excent-text/excent-text'

/** One FAQ entry. `question`/`answer` may be a final string or an i18n key. */
export interface FaqEntry {
  id: number
  question: string
  answer: string
  /** Optional inline link below the answer (e.g. "Learn More" → Knowledge Base). */
  link?: { label: string; href?: string }
}

/**
 * Shared FAQ block — the single standard used across the site: a Title-Case
 * heading + the excent-accordion. Pages pass their own title/items; everything
 * else (type scale, spacing, accordion behaviour) is identical everywhere.
 * `title`/`question`/`answer` accept a string or an i18n key (applies translate).
 */
@Component({
  selector: 'excent-faq',
  standalone: true,
  imports: [TranslateModule, ExcentText, ExcentAccordion, ExcentAccordionItem],
  templateUrl: './excent-faq.html',
  styleUrl: './excent-faq.scss',
})
export class ExcentFaq {
  readonly title = input<string>('FAQ')
  readonly items = input.required<FaqEntry[]>()
  readonly initialActiveId = input<number>(1)
}
