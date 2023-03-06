import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuidedJournalFormComponent } from './guided-journal-form.component';

describe('GuidedJournalFormComponent', () => {
  let component: GuidedJournalFormComponent;
  let fixture: ComponentFixture<GuidedJournalFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({declarations: [ GuidedJournalFormComponent ]})
    .compileComponents();

    fixture = TestBed.createComponent(GuidedJournalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
