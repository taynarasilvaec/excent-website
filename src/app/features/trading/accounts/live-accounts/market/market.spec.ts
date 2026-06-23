import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveAccountMarket } from './market';

describe('LiveAccountMarket', () => {
  let component: LiveAccountMarket;
  let fixture: ComponentFixture<LiveAccountMarket>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveAccountMarket]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiveAccountMarket);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
