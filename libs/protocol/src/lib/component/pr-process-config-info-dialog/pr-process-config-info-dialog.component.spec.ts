import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrProcessConfigInfoDialogComponent } from './pr-process-config-info-dialog.component';

describe('CaScenarioTechnicalReportConfigInfoDialogComponent', () => {
  let component: PrProcessConfigInfoDialogComponent;
  let fixture: ComponentFixture<PrProcessConfigInfoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrProcessConfigInfoDialogComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PrProcessConfigInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
