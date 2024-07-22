import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LabSelectDocumentTemplateDialogComponent } from './lab-select-document-template-dialog.component';

describe('LabSelectDocumentTemplateDialogComponent', () => {
  let component: LabSelectDocumentTemplateDialogComponent;
  let fixture: ComponentFixture<LabSelectDocumentTemplateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabSelectDocumentTemplateDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabSelectDocumentTemplateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
