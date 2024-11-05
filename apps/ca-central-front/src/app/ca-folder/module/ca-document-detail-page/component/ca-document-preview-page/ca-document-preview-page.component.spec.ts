import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaDocumentPreviewPageComponent } from './ca-document-preview-page.component';

describe('CaDocumentPreviewComponent', () => {
  let component: CaDocumentPreviewPageComponent;
  let fixture: ComponentFixture<CaDocumentPreviewPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaDocumentPreviewPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaDocumentPreviewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
