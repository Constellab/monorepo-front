import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LabSelectDocumentTemplateComponent } from './lab-select-document-template.component';

describe('LabSelectDocumentTemplateComponent', () => {
  let component: LabSelectDocumentTemplateComponent;
  let fixture: ComponentFixture<LabSelectDocumentTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabSelectDocumentTemplateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabSelectDocumentTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
