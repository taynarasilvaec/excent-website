import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateCalendar } from './corporate-calendar';

describe('CorporateCalendar', () => {
  let component: CorporateCalendar;
  let fixture: ComponentFixture<CorporateCalendar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CorporateCalendar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CorporateCalendar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
