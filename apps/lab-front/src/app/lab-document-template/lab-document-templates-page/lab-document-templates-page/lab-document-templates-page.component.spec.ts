import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabDocumentTemplatesPageComponent } from './lab-document-templates-page.component';

describe('LabDocumentTemplatesPageComponent', () => {
  let component: LabDocumentTemplatesPageComponent;
  let fixture: ComponentFixture<LabDocumentTemplatesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabDocumentTemplatesPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabDocumentTemplatesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
