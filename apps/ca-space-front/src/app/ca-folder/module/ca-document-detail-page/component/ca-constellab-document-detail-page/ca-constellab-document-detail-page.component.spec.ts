import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaConstellabDocumentDetailPageComponent } from './ca-constellab-document-detail-page.component';

describe('CaDocumentDetailPageComponent', () => {
  let component: CaConstellabDocumentDetailPageComponent;
  let fixture: ComponentFixture<CaConstellabDocumentDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaConstellabDocumentDetailPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaConstellabDocumentDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
