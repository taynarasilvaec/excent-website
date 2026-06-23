import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcentCapital } from './excent-capital';

describe('ExcentCapital', () => {
  let component: ExcentCapital;
  let fixture: ComponentFixture<ExcentCapital>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExcentCapital]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExcentCapital);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
