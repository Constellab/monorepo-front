import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaConstellabDocumentPreviewComponent } from './ca-constellab-document-preview.component';

describe('CaConstellabDocumentPreviewComponent', () => {
  let component: CaConstellabDocumentPreviewComponent;
  let fixture: ComponentFixture<CaConstellabDocumentPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaConstellabDocumentPreviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaConstellabDocumentPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
