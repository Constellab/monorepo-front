import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiCodeEditorDynamicFieldComponent } from './li-code-editor-dynamic-field.component';

describe('LabPythonCodeDynamicFieldComponent', () => {
  let component: LiCodeEditorDynamicFieldComponent;
  let fixture: ComponentFixture<LiCodeEditorDynamicFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiCodeEditorDynamicFieldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiCodeEditorDynamicFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
