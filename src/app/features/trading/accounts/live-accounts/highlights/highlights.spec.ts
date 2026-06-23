import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveAccountHighlights } from './highlights';

describe('LiveAccountHighlights', () => {
  let component: LiveAccountHighlights;
  let fixture: ComponentFixture<LiveAccountHighlights>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveAccountHighlights]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiveAccountHighlights);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
