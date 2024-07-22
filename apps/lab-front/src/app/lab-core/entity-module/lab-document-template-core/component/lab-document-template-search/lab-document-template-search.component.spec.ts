import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LabDocumentTemplateSearchComponent } from './lab-document-template-search.component';

describe('LabDocumentTemplateSearchComponent', () => {
  let component: LabDocumentTemplateSearchComponent;
  let fixture: ComponentFixture<LabDocumentTemplateSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabDocumentTemplateSearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabDocumentTemplateSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
