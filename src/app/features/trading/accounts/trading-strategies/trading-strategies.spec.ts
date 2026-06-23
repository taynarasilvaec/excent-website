import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradingStrategies } from './trading-strategies';

describe('TradingStrategies', () => {
  let component: TradingStrategies;
  let fixture: ComponentFixture<TradingStrategies>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TradingStrategies]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TradingStrategies);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
