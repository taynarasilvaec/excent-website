import { Component, computed, inject, input } from '@angular/core'
import { ExcentAccordion, ExcentAccordionItemId } from './excent-accordion'

@Component({
  selector: 'excent-accordion-item',
  standalone: true,
  templateUrl: './excent-accordion-item.html',
  styleUrl: './excent-accordion-item.scss',
})
export class ExcentAccordionItem {
  private readonly _parent = inject(ExcentAccordion)

  public readonly itemId = input.required<ExcentAccordionItemId>()
  public readonly question = input.required<string>()
  public readonly answer = input.required<string>()
  public readonly linkLabel = input<string | null>(null)
  public readonly linkHref = input<string | null>(null)

  protected readonly isOpen = computed(() => this._parent.isActive(this.itemId()))

  protected onToggle(): void {
    this._parent.toggle(this.itemId())
  }
}
