import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import { ExcentAccordion } from './excent-accordion';
import { ExcentAccordionItem } from './excent-accordion-item';

@Component({
  standalone: true,
  imports: [ExcentAccordion, ExcentAccordionItem],
  template: `
    <excent-accordion [initialActiveId]="1">
      <excent-accordion-item [itemId]="1" question="Q1" answer="A1" />
      <excent-accordion-item [itemId]="2" question="Q2" answer="A2" />
    </excent-accordion>
  `,
})
class HostComponent {}

describe('ExcentAccordion', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the initial active item', () => {
    const answer = fixture.nativeElement.querySelector('.excent-accordion-item__answer');
    expect(answer?.textContent).toContain('A1');
  });
});
