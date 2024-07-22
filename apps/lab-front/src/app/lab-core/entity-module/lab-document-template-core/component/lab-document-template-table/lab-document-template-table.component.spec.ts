import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LabDocumentTemplateTableComponent } from './lab-document-template-table.component';

describe('LabDocumentTemplateTableComponent', () => {
  let component: LabDocumentTemplateTableComponent;
  let fixture: ComponentFixture<LabDocumentTemplateTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabDocumentTemplateTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabDocumentTemplateTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
