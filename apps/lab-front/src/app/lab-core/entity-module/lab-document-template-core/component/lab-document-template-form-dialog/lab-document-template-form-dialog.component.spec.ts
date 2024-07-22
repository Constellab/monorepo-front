import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LabDocumentTemplateFormDialogComponent } from './lab-document-template-form-dialog.component';

describe('LabDocumentTemplateFormDialogComponent', () => {
  let component: LabDocumentTemplateFormDialogComponent;
  let fixture: ComponentFixture<LabDocumentTemplateFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabDocumentTemplateFormDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabDocumentTemplateFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
