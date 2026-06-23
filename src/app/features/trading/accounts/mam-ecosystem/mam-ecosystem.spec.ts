import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MamEcosystem } from './mam-ecosystem';

describe('MamEcosystem', () => {
  let component: MamEcosystem;
  let fixture: ComponentFixture<MamEcosystem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MamEcosystem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MamEcosystem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
