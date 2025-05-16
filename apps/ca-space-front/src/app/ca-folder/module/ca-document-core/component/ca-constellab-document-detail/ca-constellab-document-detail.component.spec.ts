import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaConstellabDocumentDetailComponent } from './ca-constellab-document-detail.component';

describe('CaConstellabDocumentDetailComponent', () => {
  let component: CaConstellabDocumentDetailComponent;
  let fixture: ComponentFixture<CaConstellabDocumentDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaConstellabDocumentDetailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaConstellabDocumentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
