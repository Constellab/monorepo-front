import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaDocumentPreviewComponent } from './ca-document-preview.component';

describe('CaDocumentPreviewComponent', () => {
  let component: CaDocumentPreviewComponent;
  let fixture: ComponentFixture<CaDocumentPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaDocumentPreviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaDocumentPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
