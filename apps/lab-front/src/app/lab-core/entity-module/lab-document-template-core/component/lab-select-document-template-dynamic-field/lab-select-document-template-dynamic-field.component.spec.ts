import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LabSelectDocumentTemplateDynamicFieldComponent } from './lab-select-document-template-dynamic-field.component';

describe('LabSelectDocumentTemplateDynamicFieldComponent', () => {
  let component: LabSelectDocumentTemplateDynamicFieldComponent;
  let fixture: ComponentFixture<LabSelectDocumentTemplateDynamicFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabSelectDocumentTemplateDynamicFieldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      LabSelectDocumentTemplateDynamicFieldComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
