import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TdDynamicEditableFormGroupComponent } from './td-dynamic-editable-form-group.component';

describe('FlDynamicFormGroupDynamicComponent', () => {
  let component: TdDynamicEditableFormGroupComponent;
  let fixture: ComponentFixture<TdDynamicEditableFormGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TdDynamicEditableFormGroupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TdDynamicEditableFormGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
