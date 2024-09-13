import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CaFolderReportPreviewComponent} from './ca-folder-report-preview.component';

describe('CaFolderReportPreviewComponent', () => {
  let component: CaFolderReportPreviewComponent;
  let fixture: ComponentFixture<CaFolderReportPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaFolderReportPreviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaFolderReportPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
