import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabSelectScenarioDynamicFieldComponent } from './lab-select-scenario-dynamic-field.component';

describe('LabSelectScenarioDynamicFieldComponent', () => {
  let component: LabSelectScenarioDynamicFieldComponent;
  let fixture: ComponentFixture<LabSelectScenarioDynamicFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabSelectScenarioDynamicFieldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabSelectScenarioDynamicFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
