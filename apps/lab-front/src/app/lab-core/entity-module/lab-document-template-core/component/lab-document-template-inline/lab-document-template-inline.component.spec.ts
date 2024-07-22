import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LabDocumentTemplateInlineComponent } from './lab-document-template-inline.component';

describe('LabDocumentTemplateInlineComponent', () => {
  let component: LabDocumentTemplateInlineComponent;
  let fixture: ComponentFixture<LabDocumentTemplateInlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabDocumentTemplateInlineComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabDocumentTemplateInlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
