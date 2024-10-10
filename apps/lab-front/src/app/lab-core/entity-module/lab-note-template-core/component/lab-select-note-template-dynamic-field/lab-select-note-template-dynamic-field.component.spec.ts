import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LabSelectNoteTemplateDynamicFieldComponent } from './lab-select-note-template-dynamic-field.component';

describe('LabSelectNoteTemplateDynamicFieldComponent', () => {
  let component: LabSelectNoteTemplateDynamicFieldComponent;
  let fixture: ComponentFixture<LabSelectNoteTemplateDynamicFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabSelectNoteTemplateDynamicFieldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      LabSelectNoteTemplateDynamicFieldComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
