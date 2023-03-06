import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitReviewFormComponent } from './habit-review-form.component';

describe('HabitReviewFormComponent', () => {
  let component: HabitReviewFormComponent;
  let fixture: ComponentFixture<HabitReviewFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({declarations: [ HabitReviewFormComponent ]})
    .compileComponents();

    fixture = TestBed.createComponent(HabitReviewFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
