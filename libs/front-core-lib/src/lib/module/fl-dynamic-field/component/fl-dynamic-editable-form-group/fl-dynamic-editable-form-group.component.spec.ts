import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlDynamicEditableFormGroupComponent } from './fl-dynamic-editable-form-group.component';

describe('FlDynamicFormGroupDynamicComponent', () => {
  let component: FlDynamicEditableFormGroupComponent;
  let fixture: ComponentFixture<FlDynamicEditableFormGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FlDynamicEditableFormGroupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FlDynamicEditableFormGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
