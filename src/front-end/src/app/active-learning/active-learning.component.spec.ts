import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveLearningComponent } from './active-learning.component';

describe('ActiveLearningComponent', () => {
  let component: ActiveLearningComponent;
  let fixture: ComponentFixture<ActiveLearningComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActiveLearningComponent]
    });
    fixture = TestBed.createComponent(ActiveLearningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
