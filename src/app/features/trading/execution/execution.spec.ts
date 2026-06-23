import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Execution } from './execution';

describe('Execution', () => {
  let component: Execution;
  let fixture: ComponentFixture<Execution>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Execution]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Execution);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
