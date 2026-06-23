import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketBlog } from './market-blog';

describe('MarketBlog', () => {
  let component: MarketBlog;
  let fixture: ComponentFixture<MarketBlog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarketBlog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarketBlog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
