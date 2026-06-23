import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveAccountSecurity } from './security';

describe('LiveAccountSecurity', () => {
  let component: LiveAccountSecurity;
  let fixture: ComponentFixture<LiveAccountSecurity>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveAccountSecurity]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiveAccountSecurity);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
