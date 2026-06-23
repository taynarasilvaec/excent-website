import { Component, OnInit, input, signal } from '@angular/core'

export type ExcentAccordionItemId = string | number

@Component({
  selector: 'excent-accordion',
  standalone: true,
  template: '<ng-content />',
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      width: 100%;
    }
  `,
})
export class ExcentAccordion implements OnInit {
  public readonly initialActiveId = input<ExcentAccordionItemId | null>(null)

  public readonly activeId = signal<ExcentAccordionItemId | null>(null)

  public ngOnInit(): void {
    this.activeId.set(this.initialActiveId())
  }

  public isActive(id: ExcentAccordionItemId): boolean {
    return this.activeId() === id
  }

  public toggle(id: ExcentAccordionItemId): void {
    this.activeId.update(current => (current === id ? null : id))
  }
}
