import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiSelectLabDynamicFieldComponent } from './li-select-lab-dynamic-field.component';

describe('LiSelectLabDynamicFieldComponent', () => {
  let component: LiSelectLabDynamicFieldComponent;
  let fixture: ComponentFixture<LiSelectLabDynamicFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiSelectLabDynamicFieldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiSelectLabDynamicFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
