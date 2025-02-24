import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabSelectFolderDynamicFieldComponent } from './lab-select-folder-dynamic-field.component';

describe('LabSelectFolderDynamicFieldComponent', () => {
  let component: LabSelectFolderDynamicFieldComponent;
  let fixture: ComponentFixture<LabSelectFolderDynamicFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabSelectFolderDynamicFieldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabSelectFolderDynamicFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
