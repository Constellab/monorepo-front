import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LabReportTemplatesPageComponent} from './lab-report-templates-page.component';

describe('LabReportTemplatesPageComponent', () => {
  let component: LabReportTemplatesPageComponent;
  let fixture: ComponentFixture<LabReportTemplatesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabReportTemplatesPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabReportTemplatesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
