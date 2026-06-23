import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveAccounts } from './live-accounts';

describe('LiveAccounts', () => {
  let component: LiveAccounts;
  let fixture: ComponentFixture<LiveAccounts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveAccounts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiveAccounts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
