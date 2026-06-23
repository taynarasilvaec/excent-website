import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalArea } from './legal-area';

describe('LegalArea', () => {
  let component: LegalArea;
  let fixture: ComponentFixture<LegalArea>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LegalArea]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LegalArea);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
