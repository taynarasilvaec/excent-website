import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypesExecution } from './types-execution';

describe('TypesExecution', () => {
  let component: TypesExecution;
  let fixture: ComponentFixture<TypesExecution>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypesExecution]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypesExecution);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
