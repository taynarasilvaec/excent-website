import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisIq } from './analysis-iq';

describe('AnalysisIq', () => {
  let component: AnalysisIq;
  let fixture: ComponentFixture<AnalysisIq>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalysisIq]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalysisIq);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
