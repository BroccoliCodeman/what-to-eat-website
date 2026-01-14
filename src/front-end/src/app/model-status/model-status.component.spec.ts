import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelStatusComponent } from './model-status.component';

describe('ModelStatusComponent', () => {
  let component: ModelStatusComponent;
  let fixture: ComponentFixture<ModelStatusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModelStatusComponent]
    });
    fixture = TestBed.createComponent(ModelStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
