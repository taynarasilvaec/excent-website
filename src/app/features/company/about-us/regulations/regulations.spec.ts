import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Regulations } from './regulations';

describe('Regulations', () => {
  let component: Regulations;
  let fixture: ComponentFixture<Regulations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Regulations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Regulations);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
