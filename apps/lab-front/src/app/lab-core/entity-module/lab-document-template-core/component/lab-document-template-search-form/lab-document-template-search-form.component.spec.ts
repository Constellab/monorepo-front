import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LabDocumentTemplateSearchFormComponent } from './lab-document-template-search-form.component';

describe('LabDocumentTemplateSearchFormComponent', () => {
  let component: LabDocumentTemplateSearchFormComponent;
  let fixture: ComponentFixture<LabDocumentTemplateSearchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabDocumentTemplateSearchFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabDocumentTemplateSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
