import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsIq } from './news-iq';

describe('NewsIq', () => {
  let component: NewsIq;
  let fixture: ComponentFixture<NewsIq>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsIq]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewsIq);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
