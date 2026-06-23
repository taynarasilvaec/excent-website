import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcentGlow } from './excent-glow';

describe('ExcentGlow', () => {
  let component: ExcentGlow;
  let fixture: ComponentFixture<ExcentGlow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExcentGlow]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExcentGlow);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
