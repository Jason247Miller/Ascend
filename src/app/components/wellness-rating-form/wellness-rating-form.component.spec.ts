import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WellnessRatingFormComponent } from './wellness-rating-form.component';

describe('WellnessRatingFormComponent', () => {
  let component: WellnessRatingFormComponent;
  let fixture: ComponentFixture<WellnessRatingFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WellnessRatingFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WellnessRatingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
