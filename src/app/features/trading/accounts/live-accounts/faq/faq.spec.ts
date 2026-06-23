import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveAccountFaq } from './faq';

describe('LiveAccountFaq', () => {
  let component: LiveAccountFaq;
  let fixture: ComponentFixture<LiveAccountFaq>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveAccountFaq]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiveAccountFaq);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
