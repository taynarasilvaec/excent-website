import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcentAcademy } from './excent-academy';

describe('ExcentAcademy', () => {
  let component: ExcentAcademy;
  let fixture: ComponentFixture<ExcentAcademy>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExcentAcademy]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExcentAcademy);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
