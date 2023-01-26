import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyReviewComponent } from './daily-review.component';

describe('DailyReviewComponent', () => {
  let component: DailyReviewComponent;
  let fixture: ComponentFixture<DailyReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyReviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
