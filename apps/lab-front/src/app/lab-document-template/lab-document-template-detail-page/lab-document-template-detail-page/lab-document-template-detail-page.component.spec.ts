import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LabDocumentTemplateDetailPageComponent } from './lab-document-template-detail-page.component';

describe('LabDocumentTemplateDetailPageComponent', () => {
  let component: LabDocumentTemplateDetailPageComponent;
  let fixture: ComponentFixture<LabDocumentTemplateDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabDocumentTemplateDetailPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabDocumentTemplateDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
