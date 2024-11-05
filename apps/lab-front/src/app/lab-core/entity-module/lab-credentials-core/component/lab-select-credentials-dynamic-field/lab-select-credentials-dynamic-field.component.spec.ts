import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabSelectCredentialsDynamicFieldComponent } from './lab-select-credentials-dynamic-field.component';

describe('LabSelectCredentialsDynamicFieldComponent', () => {
  let component: LabSelectCredentialsDynamicFieldComponent;
  let fixture: ComponentFixture<LabSelectCredentialsDynamicFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabSelectCredentialsDynamicFieldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabSelectCredentialsDynamicFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
